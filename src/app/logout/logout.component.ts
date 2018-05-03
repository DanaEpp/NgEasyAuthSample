import { Component, OnInit } from '@angular/core';
import { LoginService } from '../core/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor( private router: Router, private loginService: LoginService) { 
    this.loginService.logout();
    this.router.navigateByUrl( "/login" );
  }

  ngOnInit() {
  }

}
