import { createReducer, on } from "@ngrx/store";
import { IAuthState } from "../users.state";
import * as authActions from "./auth.action";

export const authState: IAuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    error: null,
    loading: false,
    message: null,
    result: false
}

export const authReducer = createReducer(
    authState,
    on( authActions.login, (state, { loginForm }) => ({ ...state, loading: true })),
    on( authActions.loginSuccess, (state, { response }) => {
            localStorage.setItem('accessToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            // debugger;
            return { 
                ...state, 
                loading: false, 
                accessToken: response.data.token, 
                isAuthenticated: true,
                user: response.data
            }
    }),
    on(authActions.refreshUser, (state, { response }) => ({ ...state, loading: false, user: response })),
    on(authActions.loginFailure, (state, { error }) => ({ ...state, loading: false, error, isAuthenticated: false })),
    on(authActions.logout, () => {
        localStorage.clear();
        return {
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null,
            loading: false,
            message: null,
            result: false
        }
    }),


     // ------------------------ Create User -------------------------------
        on( 
            authActions.registerUser , 
            (state, { user }) => ({ ...state, loading: true, message: null })
        ),
        on( 
            authActions.registerUserSuccess , 
            (state, { response }) => {
                return { 
                ...state, 
                loading: false, 
                message: response.message,
                result: true
            }
        }
        ),
        on( 
            authActions.registerUserFailure,
            ( state, { error }) => ({ ...state, loading: false, error })
        ),

        // ---------------- Refresh Token -------------------------------//
        // on(
        //     authActions.refreshToken,
        //     (state) => ({ ...state, loading: true, result: false, message: null })
        // ),
        // on(
        //     authActions.refreshTokenSuccess,
        //     (state, { response }) => {
        //         localStorage.setItem('accessToken', response.data?.token );
        //         return { ...state, accessToken: response.data?.token, loading: false, result: true }
        //     }),
        // on(
        //     authActions.refreshTokenFailure,
        //     (state, { error }) => ({ ...state, loading: false, result: false, error })
        // ),
        on(
            authActions.refreshToken,
            (state, { response }) => {
                localStorage.setItem('accessToken', response.data?.token );
                return { ...state, accessToken: response.data?.token }
            }),


         // ----------------------- reset result -----------------------//
        on(
            authActions.resetResult,
            (state) => ({ ...state, result: false })
        ),


        // --------------------------- Auto Login ---------------------------------//
        on(
            authActions.autoLogin,
            (state, { token, user }) => {
                return {
                    ...state,
                    accessToken: token,
                    isAuthenticated: true,
                    user: {...user}
                }
            }
        )
    
)