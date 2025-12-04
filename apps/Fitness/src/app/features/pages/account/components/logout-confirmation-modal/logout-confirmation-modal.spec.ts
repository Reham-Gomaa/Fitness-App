import {ComponentFixture, TestBed} from "@angular/core/testing";
import {LogoutConfirmationModal} from "./logout-confirmation-modal";

describe("LogoutConfirmationModal", () => {
    let component: LogoutConfirmationModal;
    let fixture: ComponentFixture<LogoutConfirmationModal>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LogoutConfirmationModal],
        }).compileComponents();

        fixture = TestBed.createComponent(LogoutConfirmationModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
