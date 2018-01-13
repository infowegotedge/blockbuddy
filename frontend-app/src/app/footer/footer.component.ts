import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  year: number;
  adminRole: boolean;

  constructor(private localStorage: LocalStorageService) {
  }

  ngOnInit() {
    this.year = (new Date()).getFullYear();
    this.adminRole = false;
    if ( this.localStorage.retrieve('role') === 'admin' ) {
      this.adminRole = true;
    }
  }

}
