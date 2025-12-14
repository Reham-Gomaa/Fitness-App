import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AuthState} from "./auth.reducer";

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const selectRegisterData = createSelector(selectAuthState, (state) => state.registerData);

export const selectAuthLoading = createSelector(selectAuthState, (state) => state.isLoading);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectStep = createSelector(selectAuthState, (state) => state.step);

export const selectIsStepValid = createSelector(selectAuthState, (state) => state.isStepValid);
