import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { BBService } from './bb.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private bbService: BBService, private router: Router) {}

  canActivate() {
    if (!this.bbService.getRole()) {
      // this.router.navigate(['dashboard']);
      // Change to false in order to authenticate user
      return false;
    } else {
      return true;
    }
  }
}