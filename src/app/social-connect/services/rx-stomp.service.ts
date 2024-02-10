import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RxStompService extends RxStomp {
  constructor() {
    super();
  }
  
  static getToken() : string{
      return AuthService.getAccessToken;
  }

}


