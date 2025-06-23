import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, filter, pipe, switchMap, take, throwError } from 'rxjs';
import { refreshToken } from '../store/auth/auth.action';
import { selectAuthAccessToken } from '../store/auth/auth.select';
import { AuthService } from '../services/auth/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const store = inject(Store);
  const authService = inject(AuthService);

  const accessToken = localStorage.getItem("accessToken");
  let authReq = req;
  // debugger;
  if(accessToken){
    // debugger;
      const authReq = req.clone({
        setHeaders: {
            authorization: `Bearer ${accessToken}`
        }
      })
      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if(error.status === 401) {
            // alert('error triggered in authReq 401 before dispatch')
            // store.dispatch(refreshToken());
            // alert('error triggered in authReq 401 after dispatch')
            authService.getRefreshToken().pipe(take(1)).subscribe((response) => {
                if(response.result) {
                  store.dispatch(refreshToken({response}));
                  return;
                  // localStorage.setItem('accessToken', response.data?.token );
                }
            })

          }

          return throwError(() => error);
        })
      )
    }else {
      return next(req);
    }
  
};



// import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { catchError, filter, switchMap, take, throwError } from 'rxjs';
// import { refreshToken } from '../store/auth/auth.action';
// import { selectAuthAccessToken } from '../store/auth/auth.select';

// export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const store = inject(Store);

//   const accessToken = localStorage.getItem("accessToken");
//   let authReq = req;
//   debugger;
//   if (accessToken) {
//     authReq = req.clone({
//       setHeaders: {
//         authorization: `Bearer ${accessToken}`
//       }
//     });
//   }

//   return next(authReq).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status === 401) {
//         // Dispatch refresh token action
//         store.dispatch(refreshToken());

//         // Wait for new token to appear in store
//         return store.select(selectAuthAccessToken).pipe(
//           filter(token => !!token),
//           take(1),
//           switchMap((newToken) => {
//             const retryReq = req.clone({
//               setHeaders: {
//                 authorization: `Bearer ${newToken}`
//               }
//             });
//             return next(retryReq);
//           }),
//           catchError(() => throwError(() => error)) // fallback if retry fails
//         );
//       }

//       return throwError(() => error); // return original error if not 401
//     })
//   );
// };
