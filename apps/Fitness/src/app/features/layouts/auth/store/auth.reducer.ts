import {createReducer, on} from "@ngrx/store";
import * as AuthActions from "./auth.actions";

export interface RegisterData {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    rePassword?: string;
    gender?: string;
    height?: number;
    weight?: number;
    age?: number;
    goal?: string;
    activityLevel?: string;
}

export interface AuthState {
    registerData: RegisterData;
    isLoading: boolean;
    step: number;
    error: string | null;
    token: string | null;
    isStepValid: boolean;
}

export const initialState: AuthState = {
    registerData: {},
    isLoading: false,
    step: 0,
    error: null,
    token: null,
    isStepValid: false,
};

export const authReducer = createReducer(
    initialState,
    on(AuthActions.updateRegisterData, (state, {data}) => ({
        ...state,
        registerData: {...state.registerData, ...data},
    })),
    on(AuthActions.submitRegistration, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(AuthActions.registerSuccess, (state, {response}) => ({
        ...state,
        isLoading: false,
        token: response.token,
        error: null,
    })),
    on(AuthActions.registerFailure, (state, {error}) => ({
        ...state,
        isLoading: false,
        error,
    })),
    on(AuthActions.setStep, (state, {step}) => ({
        ...state,
        step,
        isStepValid: false,
    })),
    on(AuthActions.nextStep, (state) => ({
        ...state,
        step: state.step + 1,
        isStepValid: false,
    })),
    on(AuthActions.prevStep, (state) => ({
        ...state,
        step: state.step - 1,
        isStepValid: false,
    })),
    on(AuthActions.setStepValidity, (state, {isValid}) => ({
        ...state,
        isStepValid: isValid,
    })),
    on(AuthActions.resetRegisterState, () => initialState)
);
