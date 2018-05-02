import { Component, OnInit } from '@angular/core';
import { LoginService } from '../core/login.service';

@Component({
  selector: 'app-postauth',
  templateUrl: './postauth.component.html',
  styleUrls: ['./postauth.component.css']
})
export class PostauthComponent implements OnInit {

  constructor( private loginService: LoginService) { 
    this.loginService.checkSignIn();
  }

  ngOnInit() {
  }

  public dumpUserInfo(): string {
    return this.loginService.dumpUserInfo();      
  }

}
