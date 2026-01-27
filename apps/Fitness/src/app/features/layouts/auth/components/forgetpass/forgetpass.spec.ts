import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Forgetpass} from "./forgetpass";

describe("Forgetpass", () => {
    let component: Forgetpass;
    let fixture: ComponentFixture<Forgetpass>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Forgetpass],
        }).compileComponents();

        fixture = TestBed.createComponent(Forgetpass);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
