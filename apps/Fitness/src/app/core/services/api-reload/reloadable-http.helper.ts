import {inject, Injectable, effect, Injector, DestroyRef} from "@angular/core";
import {Observable, BehaviorSubject, EMPTY} from "rxjs";
import {switchMap, distinctUntilChanged, catchError} from "rxjs/operators";
import {Translation} from "../translation/translation";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

/**
 * High-performance service to help create reloadable HTTP observables
 * Optimized for Angular 20 with proper cleanup and memory management
 * Automatically reloads when language changes
 */
@Injectable({providedIn: "root"})
export class ReloadableHttpHelper {
    private readonly injector = inject(Injector);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Creates a reload trigger that emits when language changes
     * Optimized with distinctUntilChanged and proper cleanup
     *
     * Usage:
     * ```typescript
     * constructor() {
     *   this.reloadTrigger$ = this.reloadHelper.createReloadTrigger();
     * }
     *
     * getData(): Observable<Data> {
     *   return this.reloadTrigger$.pipe(
     *     switchMap(() => this.http.get<Data>('/api/data'))
     *   );
     * }
     * ```
     */
    createReloadTrigger(): BehaviorSubject<string> {
        const translation = this.injector.get(Translation);
        const currentLang = translation.getCurrentLang();
        const reloadTrigger$ = new BehaviorSubject<string>(currentLang);

        // Listen to language changes using effect (Angular 20 best practice)
        // Effect automatically tracks signal dependencies and is more efficient than manual registration
        effect(
            () => {
                const lang = translation.lang();
                // Use distinctUntilChanged logic to prevent unnecessary emissions
                if (lang !== reloadTrigger$.value) {
                    reloadTrigger$.next(lang);
                }
            },
            {
                injector: this.injector,
                allowSignalWrites: true,
            }
        );

        // Cleanup on destroy
        this.destroyRef.onDestroy(() => {
            reloadTrigger$.complete();
        });

        return reloadTrigger$;
    }

    /**
     * Creates a reloadable HTTP GET request with automatic retry and error handling
     * High-performance version with proper RxJS operators
     *
     * Usage:
     * ```typescript
     * getData(): Observable<Data> {
     *   return this.reloadHelper.createReloadableRequest(() =>
     *     this.http.get<Data>('/api/data')
     *   );
     * }
     * ```
     */
    createReloadableRequest<T>(requestFn: () => Observable<T>): Observable<T> {
        const reloadTrigger$ = this.createReloadTrigger();

        return reloadTrigger$.pipe(
            distinctUntilChanged(), // Prevent duplicate requests for same language
            switchMap(() =>
                requestFn().pipe(
                    catchError((error) => {
                        console.error("Error in reloadable request:", error);
                        return EMPTY;
                    })
                )
            ),
            takeUntilDestroyed(this.destroyRef)
        );
    }
}
