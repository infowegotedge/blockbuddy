import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit {

  errorMessage: string;
  searchUser: any = [];
  successMessage: string;
  username: string;

  form: FormGroup;
  role: FormControl;
  category: FormControl;
  permission: FormControl;
  userId: FormControl;

  @ViewChild('userRoleModal') public userRoleModal:ModalDirective;
  constructor(private bbService:BBService, private _ngZone: NgZone) { }

  findUser(username) {
    this.bbService.searchUser(username)
    .subscribe((res) => {
      if (!res.error) {
        this.errorMessage = null;
        this.searchUser   = res.users;
      } else {
        this.errorMessage = res.message;
      }
    });
  }

  public hideModal(): void {
    this.userRoleModal.hide();
  }

  manageRole(userIndex) {
    let user = this.searchUser[userIndex];
    this.form.controls['userId'].setValue(user._id);
    this.userRoleModal.show();
  }

  setRole() {
    if (this.form.valid) {
      let roleData = {
        role: this.form.value.role,
        category: this.form.value.category,
        permission: this.form.value.permission,
        userId: this.form.value.userId
      }

      this.bbService.setRole(roleData)
      .subscribe((res) => {
        if ( res.hasError ) {
          this.successMessage = null;
          this.errorMessage   = res.message;
        } else {
          this.successMessage = res.message;
          this.errorMessage   = null;
          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this._ngZone.run(() => {
                this.successMessage = null;
                this.errorMessage   = null;
                this.hideModal();
              })
            }, 3000);
          });
        }
      })
    }
  }

  createFormControls() {
    this.role = new FormControl('', [
      Validators.required
    ]);
    this.category = new FormControl('', [
      Validators.required
    ]);
    this.permission = new FormControl('', [
      Validators.required
    ]);
    this.userId = new FormControl('', [
      Validators.required
    ])
  }

  createForm() {
    this.form = new FormGroup({
      role: this.role,
      category: this.category,
      permission: this.permission,
      userId: this.userId
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

}
