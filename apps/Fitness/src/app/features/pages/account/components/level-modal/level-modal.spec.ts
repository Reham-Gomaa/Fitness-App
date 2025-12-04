import {ComponentFixture, TestBed} from "@angular/core/testing";
import {LevelModal} from "./level-modal";

describe("LevelModal", () => {
    let component: LevelModal;
    let fixture: ComponentFixture<LevelModal>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LevelModal],
        }).compileComponents();

        fixture = TestBed.createComponent(LevelModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
