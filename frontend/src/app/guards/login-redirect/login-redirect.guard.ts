import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginRedirectGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if(token) {
      if(user?.role === 'admin') {
        router.navigate(['/admin/home']);
      }else {
        router.navigate(['/home']);
      }
      return false;
  }
  return true;
};
