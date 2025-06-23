
// users.state.ts

export interface IUser {
    _id?: string,
    username: string,
    email: string,
    password: string,
    role: string,
    profileImage?: File | null
}

export interface IAuthState {
    user: IUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    error: string | null;
    loading: boolean;
    message: string | null;
    result: boolean;
}

export interface IUsersState {
    users: IUser[];
    loading: boolean;
    error: string | null;
    message: null | string;
    result: boolean;
}

export interface IAppState {
    authState: IAuthState
    usersState: IUsersState
}