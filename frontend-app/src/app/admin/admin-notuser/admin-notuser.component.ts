import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-notuser',
  templateUrl: './admin-notuser.component.html',
  styleUrls: ['./admin-notuser.component.css']
})
export class AdminNotuserComponent implements OnInit {

  users: any = [];
  totalUsers: number = 0;
  currentPage: number = 1;
  usersMaxSize: number = 0;
  perPageItem: number;
  usernameandemail: string;

  constructor(private bbService:BBService) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.usersMaxSize = Constants.MAX_PAGE_SIZE;
  }

  getUsersList(page) {
    let query = {'page': (page || 1)};

    if(this.usernameandemail || this.usernameandemail != '') {
      query["filter"] = this.usernameandemail;
    }

    this.bbService.getOrphanUsersList(query)
    .subscribe((res) => {
      this.users        = res.users;
      this.totalUsers   = res.totalRows;
      this.currentPage  = res.currentPage;
    })
  }

  ngOnInit() {
    this.getUsersList(null);
  }

}
