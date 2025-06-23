import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthUserAuthenticated } from '../../store/auth/auth.select';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectAuthUserAuthenticated).pipe(
      take(1),
      map( isAuthenticated => {
        if(isAuthenticated) {
          return true;
        }else {
          router.navigateByUrl('/login');
          return false;
        }
      })    
  )
  return true;
};
