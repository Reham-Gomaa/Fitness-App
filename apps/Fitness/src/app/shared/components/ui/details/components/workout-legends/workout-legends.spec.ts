import {ComponentFixture, TestBed} from "@angular/core/testing";
import {WorkoutLegends} from "./workout-legends";

describe("WorkoutLegends", () => {
    let component: WorkoutLegends;
    let fixture: ComponentFixture<WorkoutLegends>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WorkoutLegends],
        }).compileComponents();

        fixture = TestBed.createComponent(WorkoutLegends);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
