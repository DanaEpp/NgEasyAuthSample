import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { IdentityTokenInfo } from '../shared/shared.module';
import { LoggerService } from './logger.service';

interface LoginResponse {
  success: boolean,
  auth_token: string
}

@Injectable()
export class LoginService {
  
  private loggedIn: boolean = false;
  private storageTokenKey: string = 'access_token';
  public readonly baseUrl: string = environment.baseUrl;

  private userIdentity: IdentityTokenInfo;

  private _devToken: IdentityTokenInfo = {
    user_id: "john@doe.com",
    access_token: "",
    provider_name: "dev_server",
    expires_on: new Date("2042-02-28T01:42:00.7110088Z"),
    user_claims: [
        {
            "typ": "http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/nameidentifier", //DevSkim: ignore DS137138 
            "val": "4242424242424242"
        },
        {
            "typ": "http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/emailaddress", //DevSkim: ignore DS137138 
            "val": "john@doe.com"
        },
        {
            "typ": "http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/name", //DevSkim: ignore DS137138 
            "val": "John Doe"
        },
        {
            "typ": "http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/givenname", //DevSkim: ignore DS137138 
            "val": "John"
        },
        {
            "typ": "http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/surname", //DevSkim: ignore DS137138 
            "val": "Doe"
        }
    ]
};
 
  constructor( private jwtHelper: JwtHelperService, private httpClient: HttpClient, private loggerService: LoggerService ) { }

  
  public getToken(): string {
    return localStorage.getItem(this.storageTokenKey);
  }

  login(username: string, password: string): Observable<boolean> {
    let tokenFromServer: string;

    if(environment.demo) 
    {
      // Dummy authentication here...
      if(username == 'admin' && password == 'admin') 
      {
        tokenFromServer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
        localStorage.setItem(this.storageTokenKey, tokenFromServer);
        this.loggedIn = true;
        return Observable.of(true);
      }

      return Observable.of(false);
    } 
    else 
    {
      // Use http and your backend to async authenticate the user
      // Get back a security token
      let body = {
        login: username,
        pwd: password
      };

      // Real authentication here!
      // return this.http
      //   .post<LoginResponse>(this.baseUrl, body)
      //   .pipe(
      //     map(
      //       response => {
      //         if(response.success) {
      //           tokenFromServer = response.auth_token;
      //           // Store the token locally  in Local Storage (HTML5)
      //           // Check in Chrome Dev Tools / Application / Local Storage
      //           localStorage.setItem(this.storageTokenKey, tokenFromServer);
      //         }
      //         return response.success;
      //       }
      //     )
      // );
      tokenFromServer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
      localStorage.setItem(this.storageTokenKey, tokenFromServer);
      return Observable.of(true);
    }   
  }

  logout(): void {
    localStorage.removeItem(this.storageTokenKey);
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    
    if(this.loggedIn && environment.demo) {
      return true;
    }
    
    if(this.getToken() != null) {
      return this.jwtHelper.isTokenExpired(this.getToken());
    }

    return false;
  }

  checkSignIn()
  {
    this.loggerService.trace("--> LoginService.checkSignIn()");

    let checkAuthService: boolean = false;

      if (this.userIdentity != null)
      {
          if (this.userIdentity.expires_on != null)
          {
              if (this.isTokenExpired(this.userIdentity.expires_on) )
              {
                  // Token has expired. We need to force getting a new one
                  this.loggedIn = false; 
                  this.userIdentity = null;
                  checkAuthService = true;
              }
              else
              {
                  // We are still within the expiry window... no need to recheck
                  checkAuthService = false;
              }
          }
          else
          {
              // No expiry on the token? Then this is invalid. Fail securely, and force another check
              this.loggedIn = false; 
              this.userIdentity = null;
              checkAuthService = true;
          }
      }
      else
      {
          checkAuthService = true;
      }

      if (checkAuthService)
      {
          // Check if there is a valid token at /.auth/me
          let httpHeaders = new HttpHeaders();
          //httpHeaders.set(' X-ZUMO-AUTH', '');

          // TODO: We need to get the actual token that came back from Microsoft's IdP and use that to make this
          //       call, or the get will fail with a 401.
          this.httpClient.get<IdentityTokenInfo[]>(this.baseUrl + '/.auth/me', { headers: httpHeaders })
             .subscribe(
                data => {

                  // TODO: This really should be removed... here to walk a person through how MS IdP returns data
                  this.loggerService.debug("User: " + data[0].user_id);
                  this.loggerService.debug("Access Token: " + data[0].access_token);
                  this.loggerService.debug("Provider: " + data[0].provider_name);
                  this.loggerService.debug(data);
                  // ENd TODO
                    
                  this.userIdentity = data[0];
                  this.loggedIn = true;
                },
                error => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 401) {
                            this.loggerService.log("401 - Unauthorized");
                        }
                        else if (error.status === 404) {
                          this.loggerService.log("404 - WTF? How is App Service Auth not installed?");
                        }
                        else {
                          this.loggerService.log("Sorry, but we are unable to grant access as your have failed to sign in successfully.");
                        }
                    }

                    this.loggedIn = false; 
                    this.userIdentity = null;
                }
          );
      }
      else
      {
        this.loggerService.log("Token is still valid, and hasn't expired. No need to recheck it yet.");
      }

      this.loggerService.trace("<-- LoginService.checkSignIn()");
  }

  public dumpUserInfo(): string 
  {
    let userInfo: string = '';

    if( this.userIdentity )
    {
      userInfo = this.userIdentity.user_id;
    }
    else
    {
      userInfo = 'No authenticated user info available';
    }

    return userInfo;
  }

  private isTokenExpired(expires_on): boolean
  {
      let expireDate = expires_on;
      var _utcExpiry = new Date(expireDate.getUTCFullYear(), expireDate.getUTCMonth(), expireDate.getUTCDate(), expireDate.getUTCHours(), expireDate.getUTCMinutes(), expireDate.getUTCSeconds());

      let dateNow = new Date();
      var _utcNow = new Date(dateNow.getUTCFullYear(), dateNow.getUTCMonth(), dateNow.getUTCDate(), dateNow.getUTCHours(), dateNow.getUTCMinutes(), dateNow.getUTCSeconds());

      return (_utcExpiry < _utcNow);
  }
}
