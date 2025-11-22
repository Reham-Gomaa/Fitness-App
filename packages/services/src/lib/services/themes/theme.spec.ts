import {TestBed} from "@angular/core/testing";
import {DOCUMENT} from "@angular/common";
import {Renderer2, RendererFactory2} from "@angular/core";
import {ThemeService} from "./theme";
import {PlatFormService} from "../platform/platform";

describe("ThemeService", () => {
    let service: ThemeService;
    let mockDocument: any;
    let mockRenderer: jasmine.SpyObj<Renderer2>;
    let mockRendererFactory: jasmine.SpyObj<RendererFactory2>;
    let mockPlatformService: jasmine.SpyObj<PlatFormService>;
    let localStorageMock: {[key: string]: string};

    beforeEach(() => {
        // Setup mocks
        mockRenderer = jasmine.createSpyObj("Renderer2", ["addClass", "removeClass"]);
        mockRendererFactory = jasmine.createSpyObj("RendererFactory2", ["createRenderer"]);
        mockRendererFactory.createRenderer.and.returnValue(mockRenderer);

        mockPlatformService = jasmine.createSpyObj("PlatFormService", ["isBrowser"]);
        mockPlatformService.isBrowser.and.returnValue(true);

        mockDocument = {
            documentElement: document.createElement("html"),
        };

        // Mock localStorage
        localStorageMock = {};
        spyOn(localStorage, "getItem").and.callFake((key: string) => localStorageMock[key] || null);
        spyOn(localStorage, "setItem").and.callFake((key: string, value: string) => {
            localStorageMock[key] = value;
        });

        TestBed.configureTestingModule({
            providers: [
                ThemeService,
                {provide: DOCUMENT, useValue: mockDocument},
                {provide: RendererFactory2, useValue: mockRendererFactory},
                {provide: PlatFormService, useValue: mockPlatformService},
            ],
        });
    });

    describe("Initialization", () => {
        it("should be created", () => {
            service = TestBed.inject(ThemeService);
            expect(service).toBeTruthy();
        });

        it("should create renderer on initialization", () => {
            service = TestBed.inject(ThemeService);
            expect(mockRendererFactory.createRenderer).toHaveBeenCalledWith(null, null);
            expect(service.renderer).toBe(mockRenderer);
        });

        it("should initialize with light theme by default", () => {
            service = TestBed.inject(ThemeService);
            expect(service.theme()).toBe("light");
        });

        it("should load saved theme from localStorage", () => {
            localStorageMock["theme"] = "dark";
            service = TestBed.inject(ThemeService);
            expect(service.theme()).toBe("dark");
        });

        it("should not initialize theme when not in browser", () => {
            mockPlatformService.isBrowser.and.returnValue(false);
            service = TestBed.inject(ThemeService);
            expect(localStorage.getItem).not.toHaveBeenCalled();
        });

        it("should apply theme on initialization", () => {
            service = TestBed.inject(ThemeService);
            expect(mockRenderer.removeClass).toHaveBeenCalled();
            expect(mockRenderer.addClass).toHaveBeenCalledWith(
                mockDocument.documentElement,
                "light-mode"
            );
        });
    });

    describe("toggle()", () => {
        beforeEach(() => {
            service = TestBed.inject(ThemeService);
        });

        it("should toggle from light to dark", () => {
            service.setTheme("light");
            service.toggle();
            expect(service.theme()).toBe("dark");
        });

        it("should toggle from dark to light", () => {
            service.setTheme("dark");
            service.toggle();
            expect(service.theme()).toBe("light");
        });
    });

    describe("setTheme()", () => {
        beforeEach(() => {
            service = TestBed.inject(ThemeService);
        });

        it("should set theme to dark", () => {
            service.setTheme("dark");
            expect(service.theme()).toBe("dark");
        });

        it("should set theme to light", () => {
            service.setTheme("light");
            expect(service.theme()).toBe("light");
        });

        it("should save theme to localStorage when set", (done) => {
            service.setTheme("dark");

            // Wait for effect to run
            setTimeout(() => {
                expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
                done();
            }, 0);
        });

        it("should apply theme when set", (done) => {
            mockRenderer.addClass.calls.reset();
            mockRenderer.removeClass.calls.reset();

            service.setTheme("dark");

            setTimeout(() => {
                expect(mockRenderer.addClass).toHaveBeenCalledWith(
                    mockDocument.documentElement,
                    "dark-mode"
                );
                done();
            }, 0);
        });
    });

    describe("applyTheme()", () => {
        beforeEach(() => {
            service = TestBed.inject(ThemeService);
            mockRenderer.addClass.calls.reset();
            mockRenderer.removeClass.calls.reset();
        });

        it("should remove both theme classes before applying new theme", (done) => {
            service.setTheme("dark");

            setTimeout(() => {
                expect(mockRenderer.removeClass).toHaveBeenCalledWith(
                    mockDocument.documentElement,
                    "light-mode"
                );
                expect(mockRenderer.removeClass).toHaveBeenCalledWith(
                    mockDocument.documentElement,
                    "dark-mode"
                );
                done();
            }, 0);
        });

        it("should add dark-mode class when theme is dark", (done) => {
            service.setTheme("dark");

            setTimeout(() => {
                expect(mockRenderer.addClass).toHaveBeenCalledWith(
                    mockDocument.documentElement,
                    "dark-mode"
                );
                done();
            }, 0);
        });

        it("should add light-mode class when theme is light", (done) => {
            service.setTheme("light");

            setTimeout(() => {
                expect(mockRenderer.addClass).toHaveBeenCalledWith(
                    mockDocument.documentElement,
                    "light-mode"
                );
                done();
            }, 0);
        });

        it("should not apply theme when not in browser", (done) => {
            mockPlatformService.isBrowser.and.returnValue(false);
            mockRenderer.addClass.calls.reset();

            service.setTheme("dark");

            setTimeout(() => {
                expect(mockRenderer.addClass).not.toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    describe("localStorage integration", () => {
        it("should persist theme changes to localStorage", (done) => {
            service = TestBed.inject(ThemeService);
            service.setTheme("dark");

            setTimeout(() => {
                expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
                done();
            }, 0);
        });

        it("should not access localStorage when not in browser", (done) => {
            mockPlatformService.isBrowser.and.returnValue(false);
            service = TestBed.inject(ThemeService);

            (localStorage.setItem as jasmine.Spy).calls.reset();
            service.setTheme("dark");

            setTimeout(() => {
                expect(localStorage.setItem).not.toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    describe("theme signal", () => {
        beforeEach(() => {
            service = TestBed.inject(ThemeService);
        });

        it("should be a signal", () => {
            expect(typeof service.theme).toBe("function");
        });

        it("should emit current theme value", () => {
            service.setTheme("dark");
            expect(service.theme()).toBe("dark");
        });

        it("should update reactively", () => {
            const initialTheme = service.theme();
            service.toggle();
            expect(service.theme()).not.toBe(initialTheme);
        });
    });
});
