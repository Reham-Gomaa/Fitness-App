import {Injectable, signal, DestroyRef, inject} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Subject, Observable, EMPTY} from "rxjs";
import {catchError, shareReplay} from "rxjs/operators";

/**
 * High-performance service to handle global API reloads when language changes
 * Optimized for Angular 20 with proper cleanup and memory management
 */
@Injectable({providedIn: "root"})
export class ApiReloadService {
    private readonly destroyRef = inject(DestroyRef);
    private readonly reloadSubject = new Subject<string>();
    private readonly registeredReloaders = new Set<() => void | Observable<unknown>>();

    /**
     * Observable that emits when language changes and APIs should be reloaded
     * Uses shareReplay for performance and multicasting
     */
    readonly onLanguageChange$ = this.reloadSubject
        .asObservable()
        .pipe(shareReplay({bufferSize: 1, refCount: true}));

    /**
     * Current language signal - optimized for Angular 20
     * User-facing signal for language state
     */
    readonly currentLanguage = signal<string>("en");

    constructor() {
        // Cleanup on destroy
        this.destroyRef.onDestroy(() => {
            this.registeredReloaders.clear();
            this.reloadSubject.complete();
        });
    }

    /**
     * Register a reload function that will be called when language changes
     * @param reloadFn Function to call when language changes
     * @returns Unregister function for cleanup
     */
    registerReloader(reloadFn: () => void | Observable<unknown>): () => void {
        this.registeredReloaders.add(reloadFn);

        // Return unregister function
        return () => {
            this.unregisterReloader(reloadFn);
        };
    }

    /**
     * Unregister a reload function
     * @param reloadFn Function to remove
     */
    unregisterReloader(reloadFn: () => void | Observable<unknown>): void {
        this.registeredReloaders.delete(reloadFn);
    }

    /**
     * Trigger API reload for all registered reloaders
     * Optimized for performance with error handling
     * @param newLanguage The new language code
     */
    triggerReload(newLanguage: string): void {
        // Early return if language hasn't changed
        if (this.currentLanguage() === newLanguage) {
            return;
        }

        this.currentLanguage.set(newLanguage);
        this.reloadSubject.next(newLanguage);

        // Execute all registered reloaders with error handling
        // Create snapshot to avoid iteration issues during execution
        const reloaders = Array.from(this.registeredReloaders);

        reloaders.forEach((reloadFn) => {
            try {
                const result = reloadFn();
                // If it returns an Observable, subscribe with proper error handling
                if (result && typeof result.subscribe === "function") {
                    result
                        .pipe(
                            takeUntilDestroyed(this.destroyRef),
                            catchError((err) => {
                                console.error("Error reloading API after language change:", err);
                                return EMPTY;
                            })
                        )
                        .subscribe();
                }
            } catch (error) {
                console.error("Error executing reload function:", error);
            }
        });
    }
}
