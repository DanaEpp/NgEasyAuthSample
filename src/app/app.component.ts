import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './core/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NgEasyAuth Sample';

  constructor( private router: Router, private loginService: LoginService ) {}
  
  get isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  get isLoginPage(): boolean {
    return (this.router.url === '/login');
  }

  login() {
    this.router.navigateByUrl("/login");
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl("/login");
  }
}
