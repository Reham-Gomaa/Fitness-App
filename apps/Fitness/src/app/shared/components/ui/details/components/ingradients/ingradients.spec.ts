import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Ingradients} from "./ingradients";

describe("Ingradients", () => {
    let component: Ingradients;
    let fixture: ComponentFixture<Ingradients>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Ingradients],
        }).compileComponents();

        fixture = TestBed.createComponent(Ingradients);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
