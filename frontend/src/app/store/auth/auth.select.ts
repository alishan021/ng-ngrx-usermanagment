import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IAuthState } from "../users.state";

export const authSelectFeature = createFeatureSelector<IAuthState>('auth');

export const selectAuthUser = createSelector(
    authSelectFeature,
    (state) => state.user
);

export const selectAuthUserAuthenticated = createSelector(
    authSelectFeature,
    (state) => state.isAuthenticated
);

export const selectAuthError = createSelector(
    authSelectFeature,
    (state) => state.error
);

export const selectAuthAccessToken = createSelector(
    authSelectFeature,
    (state) => state.accessToken
);


export const selectAuthMessage = createSelector(
    authSelectFeature,
    (state) => state.message
)

export const selectAuthLoading = createSelector(
    authSelectFeature,
    (state) => state.loading
)

export const selectAuthResult = createSelector(
    authSelectFeature,
    (state) => state.result
)
