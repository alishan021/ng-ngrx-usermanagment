
export interface ILoginForm {
    email: string;
    password: string;
}


export interface IRegisterForm {
    id?: string
    username: string;
    email: string;
    password: string;
    role?: string;
    profileImage?: File | null
}

export interface IResult {
    result: boolean,
    message: string,
    data: null | any
}

// export interface IError {
//     fullErrorResponse: Error,
//     errorResponse: IResult
// }