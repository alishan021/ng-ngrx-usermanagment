import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/userService/user.service';
import { IUser } from '../../store/users.state';
import { map, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf } from '@angular/common';
import { IRegisterForm, IResult } from '../../models/model';
import { Router, RouterLink } from '@angular/router';
import * as userAction from "../../store/users/users.action"
import { selectUserResult, selectUsers } from '../../store/users/users.selector';
import * as usersSelect from '../../store/users/users.selector';

@Component({
  selector: 'app-users',
  imports: [ AsyncPipe, RouterLink ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  userService = inject(UserService);
  private store = inject(Store); 
  router = inject(Router);

  users: IUser[] = [];

  users$ = this.store.select(selectUsers).pipe(tap((data) => console.log(data)));
  loading$ = this.store.select(usersSelect.selectUserLoading);
  error$ = this.store.select(usersSelect.selectUserError);

  ngOnInit() {
    this.store.dispatch(userAction.loadUser());
  }


  onEditUser(user: IUser) {
    this.userService.isUserEdit = true;
    this.userService.userForm = user;
    // debugger;
    this.router.navigateByUrl(`/admin/edit-user/${user._id}`)
  }

  onDelete(userId: string | undefined ) {
    if(!userId) {
        alert('No userId, cannot delete without ID');
    }
    const del = confirm("Are you sure to delete")
    if(del) {
      this.store.select(selectUsers).subscribe((res) => {
        this.store.dispatch(userAction.deleteUser({ userId  }));
      })
      // this.store.select(selectUserResult).subscribe((res) => {
      //   console.log(res);
      // })
    }
  }
  

  switchRole(userId: string | undefined, role: string) {
    this.store.dispatch(userAction.switchUserRole({ userId, role }));
  }

}
