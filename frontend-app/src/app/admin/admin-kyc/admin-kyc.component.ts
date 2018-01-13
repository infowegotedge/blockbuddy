import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-admin-kyc',
  templateUrl: './admin-kyc.component.html',
  styleUrls: ['./admin-kyc.component.css']
})
export class AdminKycComponent implements OnInit {
  unverifiedKyc: any = [];
  pendingKyc: any = [];
  onHoldKyc: any = [];
  approvedKyc: any = [];
  verifiedKyc: any = [];
  rejectedKyc: any = [];
  viewedKyc: any = [];
  kycInfo: any = {};
  totalRows: any = {};
  currentPage: number;
  perPageItem: number;
  maxSize: number;
  form: FormGroup;
  selfiePhoto: FormControl;
  govidPhoto: FormControl;
  adminStatus: FormControl;
  adminReasonUser: FormControl;
  adminReasonInternal: FormControl;
  moderatorStatus: FormControl;
  moderatorReasonUser: FormControl;
  moderatorReasonInternal: FormControl;
  // supervisorStatus: FormControl;
  // supervisorReasonUser: FormControl;
  // supervisorReasonInternal: FormControl;
  adminRole: boolean;
  moderatorRole: boolean;
  supervisorRole: boolean;
  updateSuccess: string;
  updateError: string;
  usernameandemail: string;
  kycInfoPage: string;

  @ViewChild('kycModal') public kycModal:ModalDirective;
  constructor(private bbService: BBService, private localStorage: LocalStorageService, private _ngZone: NgZone) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.maxSize     = Constants.MAX_PAGE_SIZE;
  }

  getKycUnveirfied(page) {
    let query = {'type': 'unverified', 'page': (page || 1)};

    if(this.usernameandemail || this.usernameandemail != '') {
      query["filter"] = this.usernameandemail;
    }

    this.bbService.getKyc(query)
    .subscribe((res) => {
      this.unverifiedKyc = res.kyc;
      this.viewedKyc     = this.unverifiedKyc;
      this.totalRows     = res.totalRows;
      this.currentPage   = res.currentPage;
      this.kycInfoPage   = 'UNVERIFIED';
      this.kycInfo = {
        admin: {}, assetsStatus: {}, createdAt: '', doctypes: {},
        has_multiple_ids: false, kyc_flag: 'UNVERIFIED',
        moderator: {}, s3asset: {}, uniqueKycId: 0, updatedAt: '',
        user: {}, _id: '',
      }
    });
  }

  getKycPending(page) {
    let query = {'type': 'pending', 'page': (page || 1)};

    if(this.usernameandemail || this.usernameandemail != '') {
      query["filter"] = this.usernameandemail;
    }

    this.bbService.getKyc(query)
    .subscribe((res) => {
      this.pendingKyc  = res.kyc;
      this.viewedKyc   = this.pendingKyc;
      this.totalRows   = res.totalRows;
      this.currentPage = res.currentPage;
      this.kycInfoPage   = 'PENDING';
      this.kycInfo = {
        admin: {}, assetsStatus: {}, createdAt: '', doctypes: {},
        has_multiple_ids: false, kyc_flag: 'UNVERIFIED',
        moderator: {}, s3asset: {}, uniqueKycId: 0, updatedAt: '',
        user: {}, _id: '',
      }
    });
  }

  getKycOnHold(page) {
    let query = {'type': 'onhold', 'page': (page || 1)};

    if(this.usernameandemail || this.usernameandemail != '') {
      query["filter"] = this.usernameandemail;
    }

    this.bbService.getKyc(query)
    .subscribe((res) => {
      this.onHoldKyc   = res.kyc;
      this.viewedKyc   = this.onHoldKyc;
      this.totalRows   = res.totalRows;
      this.currentPage = res.currentPage;
      this.kycInfoPage   = 'ONHOLD';
      this.kycInfo = {
        admin: {}, assetsStatus: {}, createdAt: '', doctypes: {},
        has_multiple_ids: false, kyc_flag: 'UNVERIFIED',
        moderator: {}, s3asset: {}, uniqueKycId: 0, updatedAt: '',
        user: {}, _id: '',
      }
    });
  }

  getKycApproved(page) {
    let query = {'type': 'approved', 'page': (page || 1)};

    if(this.usernameandemail || this.usernameandemail != '') {
      query["filter"] = this.usernameandemail;
    }

    this.bbService.getKyc(query)
    .subscribe((res) => {
      this.approvedKyc = res.kyc;
      this.viewedKyc   = this.approvedKyc;
      this.totalRows   = res.totalRows;
      this.currentPage = res.currentPage;
      this.kycInfoPage   = 'APPROVED';
      this.kycInfo = {
        admin: {}, assetsStatus: {}, createdAt: '', doctypes: {},
        has_multiple_ids: false, kyc_flag: 'UNVERIFIED',
        moderator: {}, s3asset: {}, uniqueKycId: 0, updatedAt: '',
        user: {}, _id: '',
      }
    });
  }

  getKycVerified(page) {
    let query = {'type': 'verified', 'page': (page || 1)};

    if(this.usernameandemail || this.usernameandemail != '') {
      query["filter"] = this.usernameandemail;
    }

    this.bbService.getKyc(query)
    .subscribe((res) => {
      this.verifiedKyc = res.kyc;
      this.viewedKyc   = this.verifiedKyc;
      this.totalRows   = res.totalRows;
      this.currentPage = res.currentPage;
      this.kycInfoPage   = 'VERIFIED';
      this.kycInfo = {
        admin: {}, assetsStatus: {}, createdAt: '', doctypes: {},
        has_multiple_ids: false, kyc_flag: 'UNVERIFIED',
        moderator: {}, s3asset: {}, uniqueKycId: 0, updatedAt: '',
        user: {}, _id: '',
      }
    });
  }

  getKycRejected(page) {
    let query = {'type': 'rejected', 'page': (page || 1)};

    if(this.usernameandemail || this.usernameandemail != '') {
      query["filter"] = this.usernameandemail;
    }

    this.bbService.getKyc(query)
    .subscribe((res) => {
      this.rejectedKyc = res.kyc;
      this.viewedKyc   = this.rejectedKyc;
      this.totalRows   = res.totalRows;
      this.currentPage = res.currentPage;
      this.kycInfoPage   = 'REJECTED';
      this.kycInfo = {
        admin: {}, assetsStatus: {}, createdAt: '', doctypes: {},
        has_multiple_ids: false, kyc_flag: 'UNVERIFIED',
        moderator: {}, s3asset: {}, uniqueKycId: 0, updatedAt: '',
        user: {}, _id: '',
      }
    });
  }

  updateKyc() {
    if (this.form.valid) {
      let updateData = {
        id: this.kycInfo._id,
        adminComments: this.form.value.adminReasonInternal,
        adminUserComments: this.form.value.adminReasonUser,
        adminStatus: this.form.value.adminStatus,
        moderatorComments: this.form.value.moderatorReasonInternal,
        moderatorUserComments: this.form.value.moderatorReasonUser,
        moderatorStatus: this.form.value.moderatorStatus
      }

      this.bbService.updateKYC(updateData)
      .subscribe((res) => {
        if (res.error) {
          this.updateError   = res.message;
          this.updateSuccess = null;
        } else {
          this.updateError   = null;
          this.updateSuccess = res.message;
          if(this.kycInfoPage === 'REJECTED') this.getKycRejected(1);
          if(this.kycInfoPage === 'VERIFIED') this.getKycVerified(1);
          if(this.kycInfoPage === 'APPROVED') this.getKycApproved(1);
          if(this.kycInfoPage === 'ONHOLD') this.getKycOnHold(1);
          if(this.kycInfoPage === 'PENDING') this.getKycRejected(1);
          if(this.kycInfoPage === 'UNVERIFIED') this.getKycUnveirfied(1);

          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this._ngZone.run(() => {
                if (this.updateSuccess) {
                  this.updateSuccess = null;
                  this.kycModal.hide();
                }
              })
            }, 3000);
          });
        }
      });
    }
  }

  public hideModal(): void {
    this.kycModal.hide();
  }

  showUserPages(userId) {
    let viewedKyc1 = {};
    for (let i in this.viewedKyc) {
      if (this.viewedKyc[i]['_id'] == userId) {
        viewedKyc1 = this.viewedKyc[i];
      }
    }

    this.kycInfo = viewedKyc1;
    if(this.kycInfo.admin) {
      this.form.controls['adminStatus'].setValue((this.kycInfo.admin.flag || ''));
      this.form.controls['adminReasonUser'].setValue((this.kycInfo.admin.rejectReason || ''));
      this.form.controls['adminReasonInternal'].setValue((this.kycInfo.admin.comments || ''));
    }

    if ( this.localStorage.retrieve('role') === 'admin' || this.localStorage.retrieve('role') === 'supervisor' ) {
      this.form.controls['moderatorStatus'].setValue((this.kycInfo.moderator.flag || '...'));
      this.form.controls['moderatorReasonUser'].setValue((this.kycInfo.moderator.rejectReason || '...'));
      this.form.controls['moderatorReasonInternal'].setValue((this.kycInfo.moderator.comments || '...'));
    }
    else if ( this.localStorage.retrieve('role') === 'moderator' ) {
      this.form.controls['moderatorStatus'].setValue((this.kycInfo.moderator.flag || ''));
      this.form.controls['moderatorReasonUser'].setValue((this.kycInfo.moderator.rejectReason || ''));
      this.form.controls['moderatorReasonInternal'].setValue((this.kycInfo.moderator.comments || ''));
      this.form.controls['adminStatus'].setValue('UNVERIFIED');
      this.form.controls['adminReasonUser'].setValue(' ');
      this.form.controls['adminReasonInternal'].setValue(' ');
    }

    this.kycModal.show();
  }

  createFormControls() {
    this.adminStatus = new FormControl('', [
      Validators.required
    ]);
    this.adminReasonUser = new FormControl('', [
      Validators.required
    ]);
    this.adminReasonInternal = new FormControl('', [
      Validators.required
    ]);
    this.moderatorStatus = new FormControl('', [
      Validators.required
    ]);
    this.moderatorReasonUser = new FormControl('', [
      Validators.required
    ]);
    this.moderatorReasonInternal = new FormControl('', [
      Validators.required
    ]);
    // this.supervisorStatus = new FormControl('', [
    //   Validators.required
    // ]);
    // this.supervisorReasonUser = new FormControl('', [
    //   Validators.required
    // ]);
    // this.supervisorReasonInternal = new FormControl('', [
    //   Validators.required
    // ]);
    this.selfiePhoto = new FormControl('', [
      Validators.required
    ]);
    this.govidPhoto = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      selfiePhoto: this.selfiePhoto,
      govidPhoto: this.govidPhoto,
      adminStatus: this.adminStatus,
      adminReasonUser: this.adminReasonUser,
      adminReasonInternal: this.adminReasonInternal,
      moderatorStatus: this.moderatorStatus,
      moderatorReasonUser: this.moderatorReasonUser,
      moderatorReasonInternal: this.moderatorReasonInternal
      // supervisorStatus: this.supervisorStatus,
      // supervisorReasonUser: this.supervisorReasonUser,
      // supervisorReasonInternal: this.supervisorReasonInternal,
    });
  }

  beforeChange(event) {
    if (event.nextId === 'unverified') {
      this.getKycUnveirfied(null);
    } else if (event.nextId === 'pending-verification') {
      this.getKycPending(null);
    } else if (event.nextId === 'on-hold') {
      this.getKycOnHold(null);
    } else if (event.nextId === 'approved') {
      this.getKycApproved(null);
    } else if (event.nextId === 'verified') {
      this.getKycVerified(null);
    } else if (event.nextId === 'rejected') {
      this.getKycRejected(null);
    }
  }

  ngOnInit() {
    this.kycInfo = {
      admin: {}, assetsStatus: {}, createdAt: '', doctypes: {},
      has_multiple_ids: false, kyc_flag: 'UNVERIFIED',
      moderator: {}, s3asset: {}, uniqueKycId: 0, updatedAt: '',
      user: {}, _id: '',
    }

    this.getKycUnveirfied(1);
    this.createFormControls();
    this.createForm();

    this.adminRole = false;
    this.moderatorRole = false;
    this.supervisorRole = false;

    if ( this.localStorage.retrieve('role') === 'admin' ) {
      this.adminRole = true;
      this.moderatorRole = false;
      this.supervisorRole = false;
    }
    else if ( this.localStorage.retrieve('role') === 'moderator' ) {
      this.adminRole = false;
      this.moderatorRole = true;
      this.supervisorRole = false;
    }
    else if ( this.localStorage.retrieve('role') === 'supervisor' ) {
      this.adminRole = false;
      this.moderatorRole = false;
      this.supervisorRole = true;
    }
  }

}
