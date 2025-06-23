import { createReducer, on } from "@ngrx/store";
import { IUser, IUsersState } from "../users.state";
import * as userActions from "./users.action";
import { authState } from "../auth/auth.reducer";



export const initalState: IUsersState = {
    users: [],
    loading: false,
    error: null,
    message: null,
    result: false,
}


export const usersReducer = createReducer(
    initalState,

    // load users 
    on( userActions.loadUser, state => ({ ...state, loading: true, message: null })),
    on( userActions.loadUserSuccess, (state, { response }) => {
          return { 
            ...state, 
            loading: false, 
            users: response.result && response.data, 
            message: response.message
          }
        }
      ),
    on( userActions.loadUserFailed, (state, {error}) => ({ ...state, loading: false, error, message: null })),


    // Create User
    on( 
        userActions.createUser , 
        (state, { user }) => {
            // debugger;
            return { ...state, loading: true, message: null }
        }
    ),
    on( 
        userActions.createUserSuccess , 
        (state, { response }) => {
            return { 
            ...state, 
            users: response.result && response.data ? [ ...state.users, response.data ] : [ ...state.users], 
            loading: false, 
            message: response.message,
            result: true
        }
    }
    ),
    on( 
        userActions.createUserFailure,
        ( state, { error }) => ({ ...state, loading: false, error })
    ),

    // Edit User
    on(
        userActions.editUser,
        ( state, { userId, userForm }) => ({ ...state, loading: true })
    ),
    on(
        userActions.editUserSuccess,
        (state, { response }) => { 
            return {...state, loading: false, message: response.message, result: true } 
        }
    ),
    on(
        userActions.editUserFailure,
        (state, { error }) => ({ ...state, loading: false, error, message: state.message })
    ),


    // Delete User
    on(
        userActions.deleteUser,
        (state, { userId }) => {
            console.log(' state : ' + state);
            console.log(state);
            return { ...state, loading: true };
        }
    ),
    on(
        userActions.deleteUserSuccess,
        ( state, { response, userId }) => {
            const updatedUsers = state.users.filter((user) => user._id !== userId );
            return { ...state, loading: false, message: state.message, users: updatedUsers, result: response.result }
        }
    ),
    on(
        userActions.deleteUserFailure,
        (state, { error }) => ({ ...state, error, loading: false, result: false })
    ),


    //switch user role
    on(
        userActions.switchUserRole,
        (state, { userId, role }) => ({ ...state, loading: true })
    ),
    on(
        userActions.switchUserRoleSuccess,
        (state, { response, userId }) => {
            const updatedUsers = state.users.map((user) => (user._id === userId ? { ...user, role: response.data.role } : user ));
            return { ...state, loading: false, message: response.message, users: updatedUsers, result: true }
        }
    ),
    on(
        userActions.switchUserRoleFailure,
        (state, { error }) => ({ ...state, loading: false, error, result: false, message: state.message  })
    ),


    // reset result
    on(
        userActions.resetResult,
        (state) => ({ ...state, result: false })
    )
)