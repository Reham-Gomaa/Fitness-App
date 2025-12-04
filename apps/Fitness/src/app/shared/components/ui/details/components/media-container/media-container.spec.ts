import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MediaContainer} from "./media-container";

describe("MediaContainer", () => {
    let component: MediaContainer;
    let fixture: ComponentFixture<MediaContainer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MediaContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(MediaContainer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
