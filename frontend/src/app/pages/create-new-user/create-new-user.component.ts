import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IRegisterForm, IResult } from '../../models/model';
import { UserService } from '../../services/userService/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, IUsersState } from '../../store/users.state';
import { Store } from '@ngrx/store';
import * as userAction from "../../store/users/users.action";
import * as authActions from "../../store/auth/auth.action";
import { selectFullUserState, selectUserError, selectUserMessage, selectUserResult } from '../../store/users/users.selector';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { filter, Observable, switchMap, take } from 'rxjs';
import { selectAuthUser } from '../../store/auth/auth.select';

@Component({
  selector: 'app-create-new-user',
  imports: [ FormsModule ],
  templateUrl: './create-new-user.component.html',
  styleUrl: './create-new-user.component.css'
})
export class CreateNewUserComponent implements OnInit {

  userService = inject(UserService);
  router = inject(Router)
  store = inject(Store);

  states$!: Observable<IUsersState>;

  isAdmin: boolean = false;
  loggedInUserRole!: 'user' | 'admin';
  userId: string | null = null;
  imagePreview!: string | ArrayBuffer | null;

  userForm: IUser = {
    username: "",
    email: "",
    password: "",
    role: "",
  }

  constructor() { 
    // debugger;
    this.userId = (this.userService?.userForm?._id as string)
    console.log("User ID:", this.userId);

    this.states$ = this.store.select(selectFullUserState);

  }

  ngOnInit(): void {
    
    if(this.userService.isUserEdit) {
      this.userForm = {
        username: this.userService.userForm.username,
        email: this.userService.userForm.email,
        password: "",
        role: this.userService.userForm.role,
        _id: this.userService.userForm._id,
        profileImage: this.userService.userForm.profileImage
      }
      console.log(this.userService.userForm);
      this.userId = (this.userService.userForm._id as string)
    }
    this.store.select(selectAuthUser).pipe(take(1)).subscribe((user) => {
      this.loggedInUserRole = (user?.role === 'admin') ? 'admin' : 'user';
    })
    this.isAdmin = this.userForm.role === 'admin' ? true : false;
  }


  imageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.userForm.profileImage = file; // optional: you can save the file if needed
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    this.userForm.role = (this.isAdmin) ? "admin" : "user"

    const formData = new FormData();

    formData.append('username', this.userForm.username)
    formData.append('email', this.userForm.email)
    formData.append('password', this.userForm.password)
    if(!this.userForm.profileImage || !this.userForm.email || !this.userForm.username ) return alert('fill all the forms');
    if(this.userForm.profileImage) formData.append('profile-image', this.userForm.profileImage );
    if(this.userForm.role) formData.append('role', this.userForm.role )

    if(!this.userService.isUserEdit){

      // debugger;
      this.store.dispatch(userAction.createUser({user : formData}));
      this.store.select(selectUserResult).pipe(
        filter((result) => result),
        take(1),
        switchMap(() => this.store.select(selectUserMessage).pipe(take(1)))
      ).subscribe((message) => {
          alert('message : ' + message);
          this.store.dispatch(userAction.resetResult());
          this.router.navigateByUrl('/admin/users')
      })

    } else {

      this.store.dispatch(userAction.editUser({ userId: this.userId, userForm: formData }));
      this.store.select(selectUserResult).pipe(
        filter(result => result),
        take(1),
        switchMap(() => this.store.select(selectUserMessage).pipe(take(1)))
      ).subscribe((message) => {
          alert('message : ' + message );
          this.store.dispatch(userAction.resetResult());
          this.store.select(selectAuthUser).pipe(take(1)).subscribe((user) => {
            if(user?.role === "user") {
              this.router.navigateByUrl('/home');
              this.store.dispatch(authActions.refreshUser({ response: this.userForm }));
            }
            else this.router.navigateByUrl('/admin/users');
          })
      })
    }
  }

}
