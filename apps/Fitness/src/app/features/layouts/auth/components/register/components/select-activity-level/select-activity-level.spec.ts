import {ComponentFixture, TestBed} from "@angular/core/testing";
import {SelectActivityLevelComponent} from "./select-activity-level";
import {provideMockStore, MockStore} from "@ngrx/store/testing";
import {TranslateModule} from "@ngx-translate/core";
import {register, updateRegisterData} from "../../../../store/auth.actions";

describe("SelectActivityLevelComponent", () => {
    let component: SelectActivityLevelComponent;
    let fixture: ComponentFixture<SelectActivityLevelComponent>;
    let store: MockStore;
    const initialState = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectActivityLevelComponent, TranslateModule.forRoot()],
            providers: [provideMockStore({initialState})],
        }).compileComponents();

        store = TestBed.inject(MockStore);
        spyOn(store, "dispatch");

        fixture = TestBed.createComponent(SelectActivityLevelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should update activity level signal on change", () => {
        component.onActivityChange("expert");
        expect(component.activityLevel()).toBe("expert");
    });

    it("should dispatch updateRegisterData and register actions on submit", () => {
        const activityLevel = "rookie";
        component.activityLevel.set(activityLevel);

        component.submit();

        expect(store.dispatch).toHaveBeenCalledWith(updateRegisterData({data: {activityLevel}}));
        expect(store.dispatch).toHaveBeenCalledWith(register());
    });
});
