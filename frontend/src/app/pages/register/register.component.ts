import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { IRegisterForm, IResult } from '../../models/model';
import { Store } from '@ngrx/store';
import * as userActions from '../../store/users/users.action';
import * as authActions from '../../store/auth/auth.action';
import { selectUserResult, selectUserMessage } from '../../store/users/users.selector';
import { filter, take, switchMap } from 'rxjs';
import { selectAuthMessage, selectAuthResult } from '../../store/auth/auth.select';

@Component({
  selector: 'app-register',
  imports: [ RouterLink, FormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  authService = inject(AuthService);
  router = inject(Router);
  store = inject(Store);

  registerForm: IRegisterForm = {
    username: "",
    email: "",
    password: "",
    profileImage: null,
    role: "user"
  }

  imageSelected(event: any) {
    let file = event.target.files[0];
    if(file) this.registerForm.profileImage = file;
  }

  onRegister() {
    // this.authService.registerUser(this.registerForm).subscribe((res: IResult) => {
    //   if(res.result) {
    //     alert(res.message);
    //     this.router.navigateByUrl("/login");
    //   }else {
    //     alert(res.message);
    //   }
    // })

    const formData = new FormData();

    formData.append('username', this.registerForm.username)
    formData.append('email', this.registerForm.email)
    formData.append('password', this.registerForm.password)
    if(this.registerForm.profileImage) formData.append('profile-image', this.registerForm.profileImage );
    if(this.registerForm.role) formData.append('role', this.registerForm.role )

     this.store.dispatch(authActions.registerUser({user : formData}));
          this.store.select(selectAuthResult).pipe(
            filter((result) => result),
            take(1),
            switchMap(() => this.store.select(selectAuthMessage).pipe(take(1)))
          ).subscribe((message) => {
              alert('message : ' + message);
              this.store.dispatch(authActions.resetResult());
              this.router.navigateByUrl('/login');
          })
  }

}
