import {createAction, props} from "@ngrx/store";
import {SignInResponse, ErrorResponse} from "auth-api-kp";
import {RegisterData} from "./auth.reducer";

export const updateRegisterData = createAction(
    "[Auth] Update Register Data",
    props<{data: Partial<RegisterData>}>()
);

export const submitRegistration = createAction("[Auth] Submit Registration");

export const setStepValidity = createAction(
    "[Auth] Set Step Validity",
    props<{isValid: boolean}>()
);

export const registerSuccess = createAction(
    "[Auth] Register Success",
    props<{response: SignInResponse}>()
);

export const registerFailure = createAction("[Auth] Register Failure", props<{error: string}>());

export const setStep = createAction("[Auth] Set Step", props<{step: number}>());

export const nextStep = createAction("[Auth] Next Step");

export const prevStep = createAction("[Auth] Previous Step");

export const resetRegisterState = createAction("[Auth] Reset Register State");
