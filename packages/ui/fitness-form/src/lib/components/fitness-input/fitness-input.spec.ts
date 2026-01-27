import {ComponentFixture, TestBed} from "@angular/core/testing";

import {FitnessInput} from "./fitness-input";

describe("FitnessInput", () => {
    let component: FitnessInput;
    let fixture: ComponentFixture<FitnessInput>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FitnessInput],
        }).compileComponents();

        fixture = TestBed.createComponent(FitnessInput);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
