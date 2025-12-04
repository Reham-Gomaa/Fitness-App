import {ComponentFixture, TestBed} from "@angular/core/testing";
import {WeightModal} from "./weight-modal";

describe("WeightModal", () => {
    let component: WeightModal;
    let fixture: ComponentFixture<WeightModal>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WeightModal],
        }).compileComponents();

        fixture = TestBed.createComponent(WeightModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
