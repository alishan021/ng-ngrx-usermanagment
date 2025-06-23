import { createAction, props } from "@ngrx/store";
import { IResult } from "../../models/model";
import { IUser } from "../users.state";

export const loadUser = createAction('[Users Component] Load Users');
export const loadUserSuccess = createAction('[Users Component] Load Users Success', props<{ response: IResult }>());
export const loadUserFailed = createAction('[Users Component] Load Users Failed', props<{ error: string }>());

export const createUser = createAction('[Create New User] Create User', props<{ user: FormData }>());
export const createUserSuccess = createAction('[Create New User] Create User Success', props<{ response: IResult }>());
export const createUserFailure = createAction('[Create New User] Create User Failure', props<{ error: string }>());

export const editUser = createAction('[Edit User] Edit User', props<{ userId: string | null, userForm: FormData }>());
export const editUserSuccess = createAction('[Edit User] Edit User Success', props<{ response: IResult }>());
export const editUserFailure = createAction('[Edit User] Edit User Failure', props<{ error: string }>());

export const deleteUser = createAction('[Delete User] Delete User', props<{ userId: string | undefined }>());
export const deleteUserSuccess = createAction('[Delete User] Delete User Success', props<{ response: IResult, userId: string | undefined }>());
export const deleteUserFailure = createAction('[Delete User] Delete User Failure', props<{ error: string }>());

export const switchUserRole = createAction('[Switch User Role] Switch User Role', props<{ userId: string | undefined, role: string }>());
export const switchUserRoleSuccess = createAction('[Switch User Role] Switch User Role Success', props<{ response: IResult, userId: string | undefined }>());
export const switchUserRoleFailure = createAction('[Switch User Role] Switch User Role Failure', props<{ error: string }>());


export const resetResult = createAction('[Reset Result] Reset Result');