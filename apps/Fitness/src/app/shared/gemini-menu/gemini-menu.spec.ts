import {ComponentFixture, TestBed} from "@angular/core/testing";
import {GeminiMenu} from "./gemini-menu";

describe("GeminiMenu", () => {
    let component: GeminiMenu;
    let fixture: ComponentFixture<GeminiMenu>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GeminiMenu],
        }).compileComponents();

        fixture = TestBed.createComponent(GeminiMenu);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
