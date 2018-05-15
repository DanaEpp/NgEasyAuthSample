import { Component, OnInit } from '@angular/core';
import { LoginService } from '../core/login.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private loginService: LoginService, private https: HttpClient) { }

  get loggedInUsername(): string {
    return this.loginService.loggedInUsername;
  }

  ngOnInit() {
  }

  // Sample REST request where Bearer token is added with the interceptor
  public sampleRestCall() {
     this.https
      .get<string>('https://reqres.in/api/users')
      .subscribe(
        data => {
            // Do something with the data
        });
  }

}
