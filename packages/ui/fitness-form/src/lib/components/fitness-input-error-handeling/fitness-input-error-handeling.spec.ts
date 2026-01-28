import {ComponentFixture, TestBed} from "@angular/core/testing";

import {FitnessInputErrorHandeling} from "./fitness-input-error-handeling";

describe("FitnessInputErrorHandeling", () => {
    let component: FitnessInputErrorHandeling;
    let fixture: ComponentFixture<FitnessInputErrorHandeling>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FitnessInputErrorHandeling],
        }).compileComponents();

        fixture = TestBed.createComponent(FitnessInputErrorHandeling);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
