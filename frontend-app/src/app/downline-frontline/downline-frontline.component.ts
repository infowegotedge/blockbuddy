import { Component, OnInit } from '@angular/core';
import { BBService } from '../bb.service';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../app.constants';
import { LocalStorageService } from 'ngx-webstorage';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-downline-frontline',
  templateUrl: './downline-frontline.component.html',
  styleUrls: ['./downline-frontline.component.css']
})
export class DownlineFrontlineComponent implements OnInit {

  myDirects: any;
  myDownline: any;
  totalDirects: number;
  directsCurrentPage: number;
  directsPerPage: number;
  perPageItem: number;
  totalDirectsMaxSize: number;
  totalTeamMaxSize: number;
  accessType: string;
  totalDownline: number;
  downlineCurrentPage: number;
  downlinePerPage: number;
  adminRole: boolean;
  showLoader: boolean;
  myNetwork: any = [];
  countryFlag: any;
  myDirectsMessages: string;

  form: FormGroup;
  username: FormControl;

  constructor(private bbService: BBService, private route: ActivatedRoute, private localStorage: LocalStorageService) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.totalDirectsMaxSize = Constants.MAX_PAGE_SIZE;
    this.totalTeamMaxSize = Constants.MAX_PAGE_SIZE;
    this.accessType = this.route.snapshot.params.accessType;
    if (!this.accessType) {
      this.accessType = '';
    }
  }

  getMyDirects(currentPage) {
    this.bbService.getMyDirects(currentPage)
    .subscribe((res) => {
      this.myDirects          = res.directs;
      this.totalDirects       = res.totalRows;
      this.directsCurrentPage = res.currentPage;
      this.directsPerPage     = res.perPage;
      if(res.directs.length == 0) {
        this.myDirectsMessages = Constants.NO_DIRECTS_FOUND;
      }
    });
  }

  getMyDownline(currentPage) {
    this.bbService.getMyDownline(currentPage)
    .subscribe((res) => {
      this.myDownline         = res.downline;
      this.totalDownline       = res.totalRows;
      this.downlineCurrentPage = res.currentPage;
      this.downlinePerPage     = res.perPage;
    });
  }

  tebSetEvent(tabsetId) {
    if (this.accessType === 'frontline') {
      tabsetId.select('directs')
    }
  }

  getMyNetwork(_username) {
    let userData;
    if (_username === null || _username === '' || _username === 'null') {
      userData = this.localStorage.retrieve('userid');
    } else {
      userData = _username;
    }

    if (userData) {
      this.showLoader = true;
      this.bbService.myNetwork(userData)
      .subscribe((_res) => {
        this.showLoader = false;
        if (!_res.hasError) {
          this.myNetwork = _res.users;
          for (let country of this.myNetwork) {
            let countryName = country.country;
            this.getFlagUrl(countryName);
          }
        }
      })
    }
  }

  getFlagUrl(_countryName) {
    if (_countryName) {
      if(this.countryFlag[_countryName]) {
        return 'assets/images/flags/' +
        this.countryFlag[_countryName].toLowerCase() +
        '_16.png';
      } else {
        return '';
      }
    } else  {
      return '';
    }
  }

  getCountryFlag() {
    this.bbService.countryFlag()
    .subscribe((_res) => {
      this.countryFlag = _res;
    })
  }

  createFormControls() {
    this.username = new FormControl('');
  }

  createForm() {
    this.form = new FormGroup({
      username: this.username
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getCountryFlag();
    this.getMyDirects(1);
    this.getMyDownline(1);
    this.getMyNetwork(null);
    this.adminRole = false;

    if ( this.localStorage.retrieve('role') === 'admin' ) {
      this.adminRole = true;
    }
  }

}
