import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HorizontalCarousel} from "./horizontalCarousel";

describe("HorizontalCarousel", () => {
    let component: HorizontalCarousel;
    let fixture: ComponentFixture<HorizontalCarousel>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HorizontalCarousel],
        }).compileComponents();

        fixture = TestBed.createComponent(HorizontalCarousel);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
