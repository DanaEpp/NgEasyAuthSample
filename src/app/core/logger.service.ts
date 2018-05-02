import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class LoggerService {

    log( msg: string) {
      console.log(msg);
    }

    error(msg: string) {
      console.error(msg);
    }

    trace( msg: string) {
      if( environment.tracingOn )
        console.log(msg);
    }

    debug( msg ) {
      if( environment.debugOn )
        console.log(msg);
    }

}
