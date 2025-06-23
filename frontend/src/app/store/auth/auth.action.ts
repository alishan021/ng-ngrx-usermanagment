import { createAction, props } from "@ngrx/store";
import { ILoginForm, IRegisterForm, IResult } from "../../models/model";
import { IUser } from "../users.state";
 
export const login = createAction('[Auth] Login', props<{ loginForm: ILoginForm }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ response: IResult }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const refreshUser = createAction('[Auth Refresh] Refresh User', props<{ response: IUser }>() );
export const logout = createAction('[Auth] Logout');

export const registerUser = createAction('[Register User] Register User', props<{ user: FormData }>());
export const registerUserSuccess = createAction('[Register User] Register User Success', props<{ response: IResult }>());
export const registerUserFailure = createAction('[Register User] Register User Failure', props<{ error: string }>());

// export const refreshToken = createAction('[Refresh Token] Refresh Token');
// export const refreshTokenSuccess = createAction('[Refresh Token] Refresh Token Success', props<{ response: IResult }>());
// export const refreshTokenFailure = createAction('[Refresh Token] Refresh Token Failure', props<{ error: string }>());

export const refreshToken = createAction('[Refresh Token] Refresh Token', props<{ response: IResult }>());

export const autoLogin = createAction('[Auto Login] AutoLogin', props<{ token: string, user: IUser }>())

export const resetResult = createAction('[Reset Result] Reset Result');
