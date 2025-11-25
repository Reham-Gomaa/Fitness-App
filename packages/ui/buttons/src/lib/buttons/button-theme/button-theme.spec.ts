import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ButtonTheme} from "./button-theme";

describe("ButtonThemeComponent", () => {
    let component: ButtonTheme;
    let fixture: ComponentFixture<ButtonTheme>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonTheme],
        }).compileComponents();

        fixture = TestBed.createComponent(ButtonTheme);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
