import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { usersReducer } from './store/users/users.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { UsersEffects } from './store/users/users.effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffect } from './store/auth/auth.effects';
import { tokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient( withInterceptors([ tokenInterceptor ])),
    // provideHttpClient( withInterceptors([  ])),
    provideStore({ 'users': usersReducer, 'auth': authReducer }),
    provideEffects([ UsersEffects, AuthEffect ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), trace: true })
]
};
