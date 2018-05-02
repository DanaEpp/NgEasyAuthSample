# NgEasyAuthSample

This sample project is to help the community understand how to use Azure AD's EasyAuth feature inside an SPA using Angular. It includes the right interceptors and guards to show how you can log into either an Azure AD or Microsoft (LiveID) account, and then drive your app using that IdP's identity data through their emitted access token. You could easily combine this with a dotnet core app to have an end to end solution to deploy as an App Service in Azure.

## Background information

* When debugging locally, you need to remember to set the `allowedExternalRedirectUris` to `http://127.0.0.1:4200` in the Azure Portal for the App Service under "Authentication / Authorization". Currently Microsoft's validation logic in checking if its a valid URI or not will NOT allow you to use `http://localhost:4200`.

* You need to update the environment.ts and environment.prod.ts with the appropriate values. `baseUrl` is extremely important, or it won't work. 

## Thanks & Shout Outs

Many thanks to Auth0 for their [JWT library](https://github.com/auth0/angular2-jwt).

## Contact

Please feel free to expand on this. Pull requests welcome. Alternatively, you can reach out to me on Twitter at [@danaepp](https://twitter.com/danaepp) or by email at [dana@vulscan.com](mailto:dana@vulscan.com).
