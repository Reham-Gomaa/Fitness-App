import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Bot} from "./bot";

describe("Bot", () => {
    let component: Bot;
    let fixture: ComponentFixture<Bot>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Bot],
        }).compileComponents();

        fixture = TestBed.createComponent(Bot);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
