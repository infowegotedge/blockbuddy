import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { BBService } from './bb.service';

@Injectable()
export class Authenticate implements CanActivate {
  constructor(private bbService: BBService, private router: Router) {}

  canActivate() {
    if (!this.bbService.isLoggedIn()) {
      this.router.navigate(['login']);
      // Change to false in order to authenticate user
      return false;
    } else {
      return true;
    }
  }
}