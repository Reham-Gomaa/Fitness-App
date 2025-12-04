import {TestBed} from "@angular/core/testing";
import {MealService} from "./meals";
import {provideZonelessChangeDetection} from "@angular/core";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {mealCatRes} from "../../models/meals";
import {environment} from "@fitness-app/environment/baseUrl.dev";
import { HttpErrorResponse } from '@angular/common/http';
describe("meals service test suite ", () => {
    let _mealService: MealService;
    let httpTestingController: HttpTestingController;
    const catApi = `${environment.mealApiUrl}categories.php`;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection(), MealService, provideHttpClientTesting()],
        });
        _mealService = TestBed.inject(MealService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it("created successfully", () => {
        expect(MealService).toBeTruthy();
    });

    it("getMealsCats testing", () => {
        let mealCategories: mealCatRes | undefined;
        const res = [
            {
                idCategory: "1",
                strCategory: "Beef",
                strCategoryThumb: "https://www.themealdb.com/images/category/beef.png",
                strCategoryDescription:
                    "Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times.[1] Beef is a source of high-quality protein and essential nutrients.[2]",
            },
        ];
        _mealService.getMealsCats().subscribe((response) => {
            mealCategories = response;
        });

        const req = httpTestingController.expectOne(catApi);
        req.flush(res);

        expect(req.request.method).toEqual('GET')
        expect(mealCategories).toEqual(res)


    });

    it("meals api error" , ()=>{
      let apiError : HttpErrorResponse | undefined;
      _mealService.getMealsCats().subscribe({
        next:()=>{
          fail('api error from success')
        },
        error:(err)=>{
          apiError = err
        }
      })

      const req = httpTestingController.expectOne(catApi)
      req.flush('server error', {
        status:422,
        statusText:'error occurred'
      })

      if(!apiError) {
        throw new Error('error should be here')
      }

      expect(apiError?.status).toBe(422)
    })



});
