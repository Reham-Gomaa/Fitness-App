import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Recomendation} from "./recomendation";

describe("Recomendation", () => {
    let component: Recomendation;
    let fixture: ComponentFixture<Recomendation>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Recomendation],
        }).compileComponents();

        fixture = TestBed.createComponent(Recomendation);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
