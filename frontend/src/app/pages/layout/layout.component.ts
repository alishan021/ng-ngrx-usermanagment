import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as authActions from '../../store/auth/auth.action';
import { selectAuthUserAuthenticated } from '../../store/auth/auth.select';
import { filter, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [ RouterOutlet, RouterLink ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  store = inject(Store);
  router = inject(Router);

  onLogout() {
    const isLogout = confirm('Are you sure to logout');
    if(!isLogout) return;
    this.store.dispatch(authActions.logout());
    this.store.select(selectAuthUserAuthenticated).pipe(
      filter(result => result === false),
      take(1),
      tap(() => this.router.navigateByUrl('/login'))
    ).subscribe();
  }
}
