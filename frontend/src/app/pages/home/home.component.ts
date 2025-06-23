import { Component, inject, OnInit } from '@angular/core';
import { IUser } from '../../store/users.state';
import { Store } from '@ngrx/store';
import { selectAuthUser, selectAuthUserAuthenticated } from '../../store/auth/auth.select';
import { filter, map, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../services/userService/user.service';
import * as authActions from '../../store/auth/auth.action';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  userInfo!: IUser;

  store = inject(Store);
  router = inject(Router);
  userService = inject(UserService);

  ngOnInit(): void {
    this.store.select(selectAuthUser).pipe(
      filter((user): user is IUser => user !== null),
      take(1),
      map((user) => this.userInfo = user)
    ).subscribe();
  }

  onEdit() {
      // this.router.navigateByUrl('/')
      this.userService.isUserEdit = true;
      this.userService.userForm = this.userInfo;
      this.router.navigateByUrl(`/edit-user`)
  }

  onLogout() {
    this.store.dispatch(authActions.logout());
    this.store.select(selectAuthUserAuthenticated).pipe(
          filter(isAuthenticated => isAuthenticated === false),
          take(1),
          tap(() => this.router.navigateByUrl('/login'))
      ).subscribe()
  }

}
