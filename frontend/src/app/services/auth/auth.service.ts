import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoginForm, IRegisterForm, IResult } from '../../models/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api: string = "http://localhost:4200/api/users";

  http = inject(HttpClient);

  constructor() { }

  loginUser(loginForm: ILoginForm): Observable<IResult> {
    // debugger;
    return this.http.post<IResult>(`${this.api}/login`, loginForm, { withCredentials: true });
  }

  registerUser(registerForm: FormData): Observable<IResult> {
    return this.http.post<IResult>(`${this.api}/register`, registerForm);
  }

  getRefreshToken(): Observable<IResult> {
    // debugger;
    return this.http.post<IResult>(`${this.api}/refresh-token`, {}, { withCredentials: true });
  }

}
