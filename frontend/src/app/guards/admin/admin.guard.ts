import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../store/auth/auth.select';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectAuthUser).pipe(
    take(1),
    map(user => {
      if(user?.role === 'admin') {
        return true;
      }else {
        router.navigateByUrl('/home');
        return false;
      }
    })
  )
  
  return true;
};
