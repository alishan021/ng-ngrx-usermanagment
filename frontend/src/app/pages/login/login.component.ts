import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ILoginForm, IResult } from '../../models/model';
import { AuthService } from '../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import * as authAction from '../../store/auth/auth.action'
import { selectAuthUser, selectAuthUserAuthenticated } from '../../store/auth/auth.select';
import { combineLatest, filter, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ RouterLink, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  authService = inject(AuthService);
  router = inject(Router);
  store = inject(Store);

  loginForm: ILoginForm = {
    email: "",
    password: ""
  }

  onLogin() {

    // alert(JSON.stringify(this.loginForm));
    // debugger;
    this.store.dispatch(authAction.login({ loginForm: this.loginForm }));
    this.store.select(selectAuthUserAuthenticated).pipe(
      filter(result => result),
      take(1),
      switchMap(() => this.store.select(selectAuthUser).pipe(take(1)))
    ).subscribe((user) => {
      if(user?.role === 'user') this.router.navigateByUrl('/home')
      if(user?.role === 'admin') this.router.navigateByUrl('/admin/home')
    })

     this.loginForm = {
        email: "",
        password: ""
    }
  }

}
