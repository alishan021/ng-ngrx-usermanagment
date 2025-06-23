import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/userService/user.service";
import * as userActions from "./users.action";
import { catchError, mergeMap, of, map, tap } from "rxjs";
import { IResult } from "../../models/model";
import { HttpErrorResponse } from "@angular/common/http";



export class UsersEffects {

    action$ = inject(Actions);
    userService = inject(UserService);

    constructor() {}


    loadUsers$ = createEffect(() => 
        this.action$.pipe(
            ofType(userActions.loadUser),
            mergeMap(() => 
                this.userService.getAllUsers().pipe(
                    map((response: IResult ) => userActions.loadUserSuccess({ response })),
                    catchError((httpErrorResponse: HttpErrorResponse) => {
                        // debugger;
                        console.log(JSON.stringify(httpErrorResponse));
                        alert('loadusers effect : ' + httpErrorResponse?.error?.message);
                        return of(userActions.loadUserFailed({ error: httpErrorResponse?.error?.message }))
                    })
                )
            )
        )
    )

    createUser = createEffect(() =>
        this.action$.pipe(
            ofType( userActions.createUser ),
            mergeMap( action =>  
                this.userService.createNewUser( action.user ).pipe(
                    map(( response: IResult ) => userActions.createUserSuccess({ response })),
                    catchError((httpErrorResponse: HttpErrorResponse) => {
                        console.log(JSON.stringify(httpErrorResponse));
                        alert(httpErrorResponse.error?.message)
                        return of(userActions.createUserFailure({ error: httpErrorResponse.error?.message }))
                    })
                )
            )
        )
    )

    editUser = createEffect(() => 
        this.action$.pipe(
            ofType(userActions.editUser),
            mergeMap( (action) => 
                this.userService.editUser(action.userId, action.userForm).pipe(
                    map((response: IResult) => userActions.editUserSuccess({ response })),
                    catchError((httpErrorResponse: HttpErrorResponse) => {
                        console.log(JSON.stringify(httpErrorResponse));
                        alert(httpErrorResponse.error?.message)
                        return of(userActions.editUserFailure( { error: httpErrorResponse.error?.message }))
                    })
                )
            )
        )
    )

    deleteUser = createEffect(() => 
        this.action$.pipe(
            ofType(userActions.deleteUser),
            mergeMap((action) => this.userService.deleteUser(action.userId).pipe(
                map((response: IResult) => userActions.deleteUserSuccess({ response, userId: action.userId })),
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    console.log(JSON.stringify(httpErrorResponse));
                    alert(httpErrorResponse.error?.message)
                    return of(userActions.deleteUserFailure({ error: httpErrorResponse.error?.message }))
                })
            )
            )
        )
    )

    switchUserRole = createEffect(() => 
       this.action$.pipe(
            ofType(userActions.switchUserRole),
            mergeMap((action) => this.userService.switchUserRole(action.userId, action.role).pipe(
                map((response: IResult) => userActions.switchUserRoleSuccess({ response, userId: action.userId })),
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    console.log(JSON.stringify(httpErrorResponse));
                    alert(httpErrorResponse.error?.message)
                    return of(userActions.switchUserRoleFailure({ error: httpErrorResponse.error?.message }))}
                )
            )
        )
        )
    )
}

// error loadUsers$ : {
//     "headers":{"normalizedNames":{},"lazyUpdate":null },
//     "status":401,
//     "statusText":"Unauthorized",
//     "url":"http://localhost:4200/api/users",
//     "ok":false,
//     "name":"HttpErrorResponse",
//     "message":"Http failure response for http://localhost:4200/api/users: 401 Unauthorized",
//     "error":{"message":"No token, authorization denied, on (auth protect middleware)","result":false,"data":null}
// }
