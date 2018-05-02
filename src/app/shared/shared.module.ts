import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IdentityTokenInfo
{
    access_token: string;
    expires_on: Date;
    provider_name: string;
    user_claims: UserClaim[];
    user_id: string;
}

export interface UserClaim
{
    typ: string;
    val: string;
}

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ ],
  declarations: [ ]
})
export class SharedModule { }


