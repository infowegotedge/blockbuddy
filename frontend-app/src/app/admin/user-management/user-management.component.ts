import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { WindowRef } from '../../app.windows';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public title: string = '<strong>User Block!!!</strong>';
  public message: string = '<strong>Are you sure</strong>, you want to block this user!!!<br/><br/>';

  public untitle: string = '<strong>User Unblock!!!</strong>';
  public unmessage: string = '<strong>Are you sure</strong>, you want to unblock this user!!!<br/><br/>';

  isConfirmPassError: boolean = false;
  countries: any = [];
  users: any = {};
  userEdit: any = {};
  totalUsers: number = 0;
  currentPage: number = 1;
  usersMaxSize: number = 0;
  updateError: string;
  updateSuccess: string;
  location: string;
  perPageItem: number;
  emailPattern: string;
  passwordPattern: string;
  usernameandemail: string;
  selectedUser: any = [];
  selectAction: boolean = false;
  form: FormGroup;
  fname: FormControl;
  lname: FormControl;
  email: FormControl;
  username: FormControl;
  mobile: FormControl;
  country: FormControl;
  address: FormControl;
  city: FormControl;
  state: FormControl;
  postal: FormControl;
  password: FormControl;

  @ViewChild('userModal') public userModal:ModalDirective;
  constructor(private bbService:BBService, private _windows: WindowRef) {
    this.location = this._windows.nativeWindow.location.origin; // window.location.origin;
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.usersMaxSize = Constants.MAX_PAGE_SIZE;
    this.emailPattern = Constants.EMAIL_PATTER;
    this.passwordPattern = Constants.PASSWORD_PATTER;
  }

  countryInfo() {
    this.bbService.getCountryInfo()
    .subscribe(_res => {
      let results = _res;
      for (let idx in results) {
        this.countries.push({
          "code": results[idx].code,
          "dial_code": results[idx].dial_code,
          "name": results[idx].name,
          "valueCode": results[idx].name.toLowerCase()
        });
      }
    });
  }

  validatePassword(pass, confirmPass) {
    if(pass === confirmPass) {
      this.isConfirmPassError = false;
    }else{
      this.isConfirmPassError = true;
    }
    return this.isConfirmPassError;
  }

  getUsersList(page) {
    let query = {'page': (page || 1)};

    if(this.usernameandemail || this.usernameandemail != '') {
      query["filter"] = this.usernameandemail;
    }

    this.bbService.getUsersList(query)
    .subscribe((res) => {
      this.users        = res.users;
      this.totalUsers   = res.totalRows;
      this.currentPage  = res.currentPage;
    })
  }

  filterById(obj, id) {
    return obj.filter((el) =>
      el._id+'' === id+''
    );
  }

  getUserById(userId) {
    let user = this.filterById(this.users, userId);
    this.userEdit = ((user && user[0]) ? user[0] : {});
    this.userEdit.confirmPassword = '';
    this.userEdit.password = '';
    this.updateError = null;
    this.updateSuccess = null;
    this.form.controls['fname'].setValue(this.userEdit.fname);
    this.form.controls['lname'].setValue(this.userEdit.lname);
    this.form.controls['email'].setValue(this.userEdit.email);
    this.form.controls['username'].setValue(this.userEdit.username);
    this.form.controls['mobile'].setValue(this.userEdit.mobile);
    this.form.controls['country'].setValue(this.userEdit.country);
    this.form.controls['password'].setValue(this.userEdit.password);
    this.form.controls['address'].setValue(this.userEdit.address);
    this.form.controls['city'].setValue(this.userEdit.city);
    this.form.controls['state'].setValue(this.userEdit.state);
    this.form.controls['postal'].setValue(this.userEdit.postal);
    this.userModal.show();
  }

  public updateUser() {
    let userObj = {
      fname: this.form.value.fname,
      lname: this.form.value.lname,
      email: this.form.value.email,
      username: this.form.value.username,
      mobile: this.form.value.mobile,
      country: this.form.value.country,
      user_id: this.userEdit._id
    };

    if ( this.form.value.password && this.form.value.password !== '' ) {
      userObj['password'] = this.form.value.password;
    }

    if ( this.form.value.address && this.form.value.address !== '' ) {
      userObj['address'] = this.form.value.address;
    }

    if ( this.form.value.city && this.form.value.city !== '' ) {
      userObj['city'] = this.form.value.city;
    }

    if ( this.form.value.state && this.form.value.state !== '' ) {
      userObj['state'] = this.form.value.state;
    }

    if ( this.form.value.postal && this.form.value.postal !== '' ) {
      userObj['postal'] = this.form.value.postal;
    }

    this.bbService.updateUser(userObj)
    .subscribe((res) => {
      if ( res.hasError ) {
        this.updateError = res.message;
      } else {
        this.updateSuccess = res.message;
        this.getUsersList(null);
        let that = this;
        setTimeout(function() {
          that.hideModal();
        }, 1500)
      }
    })
  }

  public hideModal(): void {
    this.updateError = null;
    this.updateSuccess = null;

    this.userModal.hide();
  }

  public getBlockUser(userId) {
    let user = this.filterById(this.users, userId);
    if ( user && user.length > 0 ) {
      let _data = {
        user_id: user[0]._id,
        block_user: true
      };

      this.bbService.blockUser(_data)
      .subscribe((res) => {
        if ( res.hasError ) {
          user[0].is_blocked = false;
        }
        else {
          user[0].is_blocked = true;
        }
      });
    }
  }

  public getUnBlockUser(userId) {
    let user = this.filterById(this.users, userId);

    if ( user && user.length > 0 ) {
      let _data = {
        user_id: user[0]._id,
        block_user: false
      };

      this.bbService.blockUser(_data)
      .subscribe((res) => {
        if ( res.hasError ) {
          user[0].is_blocked = true;
        }
        else {
          user[0].is_blocked = false;
        }
      });
    }
  }

  createFormControls() {
    this.fname = new FormControl('', [
      Validators.required
    ]);
    this.lname = new FormControl('', [
      Validators.required
    ]);
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailPattern)
    ]);
    this.username = new FormControl('', [
      Validators.required
    ]);
    this.mobile = new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]);
    this.country = new FormControl('', [
      Validators.required
    ]);
    this.password = new FormControl('', [
      Validators.pattern(this.passwordPattern),
      Validators.minLength(6)
    ]);
    this.address = new FormControl('');
    this.city = new FormControl('');
    this.state = new FormControl('');
    this.postal = new FormControl('');
  }

  createForm() {
    this.form = new FormGroup({
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      username: this.username,
      mobile: this.mobile,
      country: this.country,
      password: this.password,
      address: this.address,
      city: this.city,
      state: this.state,
      postal: this.postal
    });
  }

  // Check User Selection
  checkSelectedUser(_selectedUser, _user) {
    let matchedId = [];
    let countSelection = 0;
    for (let i=0; i<_user.length; i++) {
      if (this.selectedUser.indexOf(_user[i]._id) !== -1) {
        _user[i].isSelected = true;
        matchedId.push(_user[i]._id);
        countSelection++;
      } else {
        _user[i].isSelected = false;
        matchedId.push(_user[i]._id);
      }
    }

    // Check / Uncheck Select All 
    if (_user.length === countSelection) {
      this.selectAction = true;
    } else {
      this.selectAction = false;
    }
  }

  // Pagewise select all user
  selectAllUser(_user, _selectAction) {
    for (let i=0; i<_user.length; i++) {
      this.users[i].isSelected = (_selectAction === false ? true : false);
      if (_selectAction === true && this.selectedUser.indexOf(_user[i]._id) !== -1) {
        let emailArray = this.selectedUser.indexOf(_user[i]._id);
        delete this.selectedUser[emailArray];
      } else {
        this.selectedUser.push(this.users[i]._id);
      }
    }
  }

  // Update selected user list
  updateUserList(_id, _param) {
    if (_param === true && this.selectedUser.indexOf(_id) !== -1) {
      let emailArray = this.selectedUser.indexOf(_id);
      delete this.selectedUser[emailArray];
    } else {
      this.selectedUser.push(_id);
    }

    this.checkSelectedUser(this.selectedUser, this.users);
  }

  public markUserAsOld() {
    let userObj = {
      users: this.selectedUser
    };

    if (userObj.users.length > 0) {
      this.bbService.markUserAsOld(userObj)
      .subscribe((res) => {
        this.updateSuccess = res.message;
        this.getUsersList(null);
      })
    }
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getUsersList(null);
    this.countryInfo();
  }

}
