import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GoalModal} from "./goal-modal";

describe("GoalModal", () => {
    let component: GoalModal;
    let fixture: ComponentFixture<GoalModal>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GoalModal],
        }).compileComponents();

        fixture = TestBed.createComponent(GoalModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
