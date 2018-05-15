import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { IdentityTokenInfo, UserClaim } from '../shared/shared.module';
import { LoggerService } from './logger.service';
import { Router } from '@angular/router';

import * as WindowsAzure from 'azure-mobile-apps-client';

@Injectable()
export class LoginService { 
    private azureServiceClient: any;
    public readonly baseUrl: string = environment.baseUrl;
    private userIdentity: IdentityTokenInfo = null;
    private loggedIn: boolean = false;

    private storageTokenKey: string = 'identity_token_info';

    constructor( private httpClient: HttpClient, private logger: LoggerService, private router: Router ) {
        this.azureServiceClient = new WindowsAzure.MobileServiceClient(this.baseUrl);
        
        // Load userIdentity from local storage if it exists
        this.userIdentity = this.userTokenInfo;
    }

    public get userTokenInfo() 
    {
      let token: IdentityTokenInfo = null;

      if( this.userIdentity ) 
      {
        if( this.isTokenExpired(this.userIdentity.expires_on))
        {
          this.logout();             
          return null;
        }

        // If its a valid token, just return it and move on.
        token = this.userIdentity;
      }
      else 
      {
        // Does this user's token reside in local storage?
        try
        {
          token = JSON.parse(localStorage.getItem(this.storageTokenKey));
          
          if( token )
          {
            if( this.isTokenExpired(token.expires_on))
            {
              this.logout();             
              token = null;
            }
          }

        }
        catch(e)
        {
          this.logger.debug(e);
          this.logout();             
          token = null;
        }
      }

      return token;
    }

    public isLoggedIn(): boolean {

      this.logger.trace( "--> LoginService.isLoggedIn()");

      let loggedIn: boolean = false;

      let userInfo: IdentityTokenInfo = this.userTokenInfo;
            
      if( userInfo ) 
      {
        if( userInfo.user_id && userInfo.access_token && this.userIdentity.expires_on ) 
        {
          if( this.isTokenExpired(this.userIdentity.expires_on) )
          {
            // Expired token. Reset
            this.logout();
            loggedIn = false;
          }
          else
          {
              loggedIn = true;
          }
        }
      }

      this.logger.trace("<-- LoginService.isLoggedIn() [" + loggedIn + "]");

      return loggedIn;
    }

    public get loggedInUsername(): string {
      let username: string = null;

      if( this.userIdentity )
      {
        if( this.userIdentity.user_claims.length > 0 )
        {
          // Alternative claims to consider:   
          // http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn
          // http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
          //let name: string = this.userIdentity.user_claims.filter( claim => claim.typ === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name" )[0].val; //DevSkim: ignore DS137138 
          
          let name: string = this.userIdentity.user_id;
          
          if( name )
          {
            username = name;
          }


        }
        else
        {
          this.logger.debug("No claims found");
        }
      }
      else
      {
        this.logger.debug( "No identity found.");
      }

      return username;
    }

    login = (loginType: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        switch (loginType.toLowerCase()) {
          case 'aad':
          case 'microsoftaccount':
            this.azureServiceClient.login(loginType).done(
              results => {
                resolve(results.userId);

                let httpHeaders = new HttpHeaders();
                httpHeaders = httpHeaders.set( 'X-ZUMO-AUTH', this.azureServiceClient.currentUser.mobileServiceAuthenticationToken );

                this.httpClient.get<IdentityTokenInfo[]>(this.baseUrl + '/.auth/me', { headers: httpHeaders })
                  .subscribe(
                    data => {
                      this.userIdentity = data[0];
                      this.loggedIn = true;

                      // Write out userIdentity to local storage
                      localStorage.setItem( this.storageTokenKey, JSON.stringify(this.userIdentity));
                      
                      this.router.navigateByUrl( "/home" );
                    },
                    error => {
                      if (error instanceof HttpErrorResponse) {
                        if (error.status === 401) {
                          this.logger.log("401 - Unauthorized");
                        }
                        else if (error.status === 404) {
                          this.logger.log("404 - WTF? How is App Service Auth not installed?");
                        }
                        else {
                          this.logger.log("Sorry, but we are unable to grant access as your have failed to sign in successfully.");
                        }
                      }

                      this.clearAuth();
                    }
                );
            }, 
            err => {
                reject("Login failed");
                this.logger.error('Error: ' + err);
                localStorage.removeItem(this.storageTokenKey);
            });
            break;
          default:
            this.logger.error('Error: not implemented login request: ' + loginType);
            reject("Unknown login method");
            break;
        }
      });
    }

    private clearAuth(): void {
      this.loggedIn = false; 
      this.userIdentity = null;
      localStorage.removeItem(this.storageTokenKey);
    }

    public logout(): Observable<any> {
      this.logger.trace("--> LoginService.logout()");

      this.clearAuth();

      this.azureServiceClient.logout();

      this.logger.trace("<-- LoginService.logout()");
      return Observable.of(true);
    }

    private isTokenExpired(expires_on): boolean
    {
      let date:Date = new Date(expires_on);
      
      if( date === null )
      {
        return true;
      }

      return !(date.valueOf() > Date.now() );
    }
}
