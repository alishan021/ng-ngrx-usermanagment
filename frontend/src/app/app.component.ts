import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { autoLogin } from './store/auth/auth.action';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'week19userManagment';

  store = inject(Store)

  ngOnInit(): void {
    let token = localStorage.getItem('accessToken');
    let user = localStorage.getItem('user');

    if(token && user) {
      this.store.dispatch(autoLogin({ token: token, user: JSON.parse(user) }))
    }
  }
}
