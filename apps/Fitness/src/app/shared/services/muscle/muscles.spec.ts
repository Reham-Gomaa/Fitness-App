import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {Muscles} from "./muscles";
import {TestBed} from "@angular/core/testing";
import {provideZonelessChangeDetection} from "@angular/core";
import {muscleGroupRes, musclesRes} from "../../models/muscles";
import {environment} from "@fitness-app/environment/baseUrl.dev";

describe("muscles service testing suite", () => {
    //
    let _muscleService: Muscles;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Muscles, provideHttpClientTesting(), provideZonelessChangeDetection()],
        });

        _muscleService = TestBed.inject(Muscles);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it("should be created", () => {
        expect(_muscleService).toBeTruthy();
    });

    it("get all muscle groups test case", () => {
        let resp: musclesRes | undefined;
        const respMock = {
            message: "success",
            musclesGroup: [
                {
                    _id: "67c79f3526895f87ce0aa970",
                    name: "Adductors",
                },
            ],
        };
        _muscleService.getAllMuscleGroups().subscribe((res) => {
            resp = res;
        });

        const req = httpTestingController.expectOne(`${environment.baseApiUrl}muscles`);
        req.flush(respMock);

        expect(resp?.message).toBe("success");
        expect(req.request.method).toBe("GET");
    });
    it("get all muscle by group test case", () => {
        let resp: muscleGroupRes | undefined;
        const id = "67c79f3526895f87ce0aa971";
        const respMock = {
            message: "success",
            muscleGroup: {
                _id: "67c79f3526895f87ce0aa971",
                name: "Biceps",
            },
            muscles: [
                {
                    _id: "67c8499726895f87ce0aa9c2",
                    name: "Biceps Brachii",
                    image: "https://iili.io/33p7v6b.png",
                },
            ],
        };
        _muscleService.getAllMusclesByMuscleGroup(id).subscribe((res) => {
            resp = res;
        });

        const req = httpTestingController.expectOne(`${environment.baseApiUrl}muscles`);
        req.flush(respMock);

        expect(resp).toEqual(respMock);
        expect(req.request.method).toBe("GET");
    });
    it("get random muscles test case", () => {
        let resp: muscleGroupRes | undefined;
        const respMock = {
            message: "success",
            muscleGroup: {
                _id: "67c79f3526895f87ce0aa971",
                name: "Biceps",
            },
            muscles: [
                {
                    _id: "67c8499726895f87ce0aa9c2",
                    name: "Biceps Brachii",
                    image: "https://iili.io/33p7v6b.png",
                },
            ],
        };
        _muscleService.getRandomMuscles().subscribe((res) => {
            resp = res;
        });

        const req = httpTestingController.expectOne(`${environment.baseApiUrl}muscles/random`);
        req.flush(respMock);

        expect(resp).toEqual(respMock);
        expect(req.request.method).toBe("GET");
    });
});
