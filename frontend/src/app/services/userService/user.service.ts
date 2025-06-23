import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../store/users.state';
import { IRegisterForm, IResult } from '../../models/model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api: string = `http://localhost:4200/api/users`;

  isUserEdit: boolean = false;
  userForm!: IUser;
  
  http = inject(HttpClient);

  constructor() { }

  getAllUsers(): Observable<IResult> {
    return this.http.get<IResult>(this.api);
  }

  createNewUser(newUser: FormData): Observable<IResult> {
    return this.http.post<IResult>(`${this.api}/new-user`, newUser);
  }

  editUser( userId: string | null, userForm: FormData): Observable<IResult> {
    return this.http.put<IResult>(`${this.api}/edit-user/${userId}`, userForm);

  }

  deleteUser(userId: string | undefined): Observable<IResult> {
    return this.http.delete<IResult>(`${this.api}/delete-user/${userId}`);
  }

  switchUserRole(id: string | undefined, role: string): Observable<IResult> {
    return this.http.patch<IResult>(`${this.api}/switch-role/${id}`, { role });
  }

}
