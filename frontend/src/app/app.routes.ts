import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { RegisterComponent } from './pages/register/register.component';
import { CreateNewUserComponent } from './pages/create-new-user/create-new-user.component';
import { authGuard } from './guards/auth/auth.guard';
import { adminGuard } from './guards/admin/admin.guard';
import { loginRedirectGuard } from './guards/login-redirect/login-redirect.guard';

export const routes: Routes = [
    { 
        path: "", 
        redirectTo: "login", 
        pathMatch: "full"
    },
    { 
        path: "login", 
        component: LoginComponent ,
        canActivate: [ loginRedirectGuard ]
    },
    {
        path: "register",
        component: RegisterComponent ,
        canActivate: [ loginRedirectGuard ]
    },
    {
        path: "home",
        component: HomeComponent,
        canActivate: [ authGuard ]
    },
    {
        path: 'edit-user',
        component: CreateNewUserComponent
    },
    { 
        path: "admin", 
        component: LayoutComponent, 
        canActivate: [ authGuard, adminGuard ],
        data: { role: 'admin' },
        children: [
        { 
            path: "home", 
            component: HomeComponent 
        },
        { 
            path: "dashboard", 
            component: DashboardComponent 
        },
        { 
            path: "users", 
            component: UsersComponent 
        },
        {
            path: 'create-new-user',
            component: CreateNewUserComponent
        },
        {
            path: 'edit-user/:id',
            component: CreateNewUserComponent
        }
    ]}
];
