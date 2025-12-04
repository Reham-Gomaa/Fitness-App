import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SeoService} from "./../../../core/services/seo/seo.service";
import {AboutUs} from "./about-us";

describe.only("AboutUs", () => {
    let component: AboutUs;
    let fixture: ComponentFixture<AboutUs>;
    let seoMock!: {update: jest.Mock};

    beforeEach(async () => {
        seoMock = {
            update: jest.fn(),
        };
        await TestBed.configureTestingModule({
            imports: [AboutUs],
            providers: [{provide: SeoService, useValue: seoMock}],
        }).compileComponents();

        fixture = TestBed.createComponent(AboutUs);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
        expect(seoMock.update).toHaveBeenCalled();
    });

    it("should render trainer images with correct class names", () => {
        const imgElements: NodeListOf<HTMLImageElement> =
            fixture.nativeElement.querySelectorAll("img");

        const expectedClasses = ["trainer-3", "trainer-1", "trainer-2"];

        const trainerImgs = Array.from(imgElements).filter((img) =>
            expectedClasses.includes(img.className)
        );

        expect(trainerImgs.length).toBe(expectedClasses.length);

        trainerImgs.forEach((img, index) => {
            expect(img.classList.contains(expectedClasses[index])).toBe(true);
        });
    });
});
