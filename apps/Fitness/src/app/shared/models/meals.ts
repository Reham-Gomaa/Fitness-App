export interface mealCatRes {
    categories: Category[];
}

export interface Category {
    idCategory: string;
    strCategory: string;
    strCategoryThumb: string;
    strCategoryDescription: string;
}

export interface MealsByCategoryResponse {
    meals: Meal[];
}

export interface Meal {
    strMeal: string;
    strMealThumb: string;
    idMeal: string;
}
