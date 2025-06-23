import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as authAction from "./auth.action";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Optional
import { IResult } from "../../models/model";
import { HttpErrorResponse } from "@angular/common/http";



export class AuthEffect {

    actions$ = inject(Actions);
    authService = inject(AuthService);
    router = inject(Router);
    snackBar = inject(MatSnackBar);

    constructor() {}

    login$ = createEffect(() => 
        this.actions$.pipe(
            ofType(authAction.login),
            mergeMap((action) => this.authService.loginUser(action.loginForm).pipe(
                map((response) => authAction.loginSuccess({ response })),
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    console.log('error at login : ' + JSON.stringify(httpErrorResponse));
                    alert(httpErrorResponse.error?.message)
                    return of(authAction.loginFailure({ error: httpErrorResponse.error?.message }))
                }),
            ))
        )
    );


     registerUser = createEffect(() =>
            this.actions$.pipe(
                ofType( authAction.registerUser ),
                mergeMap( action =>  
                    this.authService.registerUser( action.user ).pipe(
                        map(( response: IResult ) => authAction.registerUserSuccess({ response })),
                        catchError((httpErrorResponse: HttpErrorResponse) => {
                            console.log(JSON.stringify(httpErrorResponse));
                            alert(httpErrorResponse.error?.message)
                            return of(authAction.registerUserFailure({ error: httpErrorResponse.error?.message }))
                        }),
                    )
                )
            )
        )

        // refreshToken$ = createEffect(() => 
        //     this.actions$.pipe(
        //         ofType( authAction.refreshToken ),
        //         mergeMap( action => 
        //             this.authService.getRefreshToken().pipe(
        //                 map((response: IResult) => authAction.refreshTokenSuccess({ response })),
        //                 catchError((httpErrorResponse: HttpErrorResponse) => {
        //                     console.log(JSON.stringify(httpErrorResponse));
        //                     alert(httpErrorResponse.error?.message)
        //                     return of(authAction.refreshTokenFailure({ error: httpErrorResponse.error?.message }))
        //                 })
        //             )
        //         )
        //     )
        // )

    // loginSuccessRedirect$ = createEffect(
    //     () =>
    //       this.actions$.pipe(
    //         ofType(authAction.loginSuccess),
    //         tap(() => {
    //           this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
    //           this.router.navigate(['/dashboard']); // redirect
    //         })
    //       ),
    //     { dispatch: false } // no action is dispatched here
    //   );
    
    //   loginFailureAlert$ = createEffect(
    //     () =>
    //       this.actions$.pipe(
    //         ofType(authAction.loginFailure),
    //         tap(action => {
    //           this.snackBar.open(`Login failed: ${action.error}`, 'Close', { duration: 3000 });
    //         })
    //       ),
    //     { dispatch: false }
    //   );
}