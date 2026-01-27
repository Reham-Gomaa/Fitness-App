import {ComponentFixture, TestBed} from "@angular/core/testing";

import {SelectOld} from "./select-old";

describe("SelectOld", () => {
    let component: SelectOld;
    let fixture: ComponentFixture<SelectOld>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectOld],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectOld);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
