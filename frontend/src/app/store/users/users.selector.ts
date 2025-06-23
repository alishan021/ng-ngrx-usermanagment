import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IUsersState } from "../users.state";
import { IResult } from "../../models/model";


// export const selectUsersFeature = createFeatureSelector<IUsersState>('users');
export const selectUsersFeature = createFeatureSelector<IUsersState>('users');


export const selectFullUserState = createSelector(
    selectUsersFeature,
    (state: IUsersState) => state
)

export const selectUsers = createSelector(
    selectUsersFeature, 
    (state: IUsersState) => state.users 
)

export const selectUserMessage = createSelector(
    selectUsersFeature,
    (state: IUsersState) => state.message
)

export const selectUserError = createSelector(
    selectUsersFeature,
    (state: IUsersState) => state.error
)

export const selectUserLoading = createSelector(
    selectUsersFeature,
    (state: IUsersState) => state.loading
)

export const selectUserResult = createSelector(
    selectUsersFeature,
    (state: IUsersState) => state.result
)



// export const selectUsersFeature = createFeatureSelector<IUsersState>('users');

// export const selectUsers = createSelector(selectUsersFeature, state => state.users )
// export const selectLoading = createSelector(selectUsersFeature, state => state.loading )
// export const selectError = createSelector(selectUsersFeature, state => state.error )
// export const selectMessage = createSelector(selectUsersFeature, state => state.message )
// export const selectResult = createSelector(selectUsersFeature, state => state.result )