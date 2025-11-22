import {TestBed} from "@angular/core/testing";
import {Meals} from "../../../features/pages/meals/meals";

describe("Meals", () => {
    let service: Meals;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(Meals);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
