import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginRouteGuard } from './core/login-route.guard';
import { ErrorComponent } from './error/error.component';
import { PostauthComponent } from './login/postauth.component';

const routes: Routes = [
  { path: '', redirectTo:'/home', pathMatch:'full' },
  { path: 'home', component: HomeComponent, canActivate: [LoginRouteGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'postauth', component: PostauthComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
