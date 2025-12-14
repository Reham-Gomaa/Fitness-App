import {TestBed} from "@angular/core/testing";
import {PLATFORM_ID} from "@angular/core";
import {PlatFormService} from "./platform";

describe("PlatFormService (Browser)", () => {
    let service: PlatFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PlatFormService],
        });
        service = TestBed.inject(PlatFormService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should return true", () => {
        expect(service.isBrowser()).toBe(true);
    });
});

describe("PlatFormService (Server)", () => {
    let service: PlatFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PlatFormService, {provide: PLATFORM_ID, useValue: "server"}],
        });
        service = TestBed.inject(PlatFormService);
    });

    it("should return false", () => {
        expect(service.isBrowser()).toBe(false);
    });
});
