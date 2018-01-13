import { Component, ViewChild, OnInit, NgZone  } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-withdrawal',
  templateUrl: './admin-withdrawal.component.html',
  styleUrls: ['./admin-withdrawal.component.css']
})
export class AdminWithdrawalComponent implements OnInit {
  autoWithdrawals: any = {};
  numberPattern: any;
  totalAWithdrawals: number = 0; 
  waCurrentPage: number = 1;
  awithdrawalsMaxSize: number =0; 
  manualWithdrawals: any = {};
  totalMWithdrawals: number = 0;
  wmCurrentPage: number = 1;
  mwithdrawalsMaxSize: number = 0;
  holdWithdrawals: any = {};
  totalHWithdrawals: number = 0;
  whCurrentPage: number = 1;
  hwithdrawalsMaxSize: number = 0;
  completedWithdrawals: any = {};
  totalCWithdrawals: number = 0;
  wcCurrentPage: number = 1;
  cwithdrawalsMaxSize: number = 0;
  perPageItem: number;
  withdrawalTypeString: string;
  withdrawalTabsetInit: boolean;
  withdrawType: string;
  withdrawals: any;
  withdrawalId: string;
  listType: string;

  withdrawalForm: FormGroup;
  withdrawalAmount: FormControl;
  withdrawalStatus: FormControl;
  withdrawalComments: FormControl;

  withdrawalSuccessMessage: string;
  withdrawalErrorMessage: string;

  @ViewChild('withdrawalModal') public withdrawalModal:ModalDirective;
  constructor(private bbService: BBService, private route: ActivatedRoute, private _ngZone: NgZone) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.awithdrawalsMaxSize = Constants.MAX_PAGE_SIZE;
    this.mwithdrawalsMaxSize = Constants.MAX_PAGE_SIZE;
    this.hwithdrawalsMaxSize = Constants.MAX_PAGE_SIZE;
    this.cwithdrawalsMaxSize = Constants.MAX_PAGE_SIZE;
    this.numberPattern       = Constants.NUMBER_PATTER;
    this.withdrawalTypeString = this.route.snapshot.params.withdrawalType;
    if (!this.withdrawalTypeString) {
      this.withdrawalTypeString = '';
    }
  }

  beforeChange(event) {
    if (event.nextId === 'withdrawal-pending') {
      this.getWithdrawalPending(null);
    } else if (event.nextId === 'withdrawal-hold') {
      this.getWithdrawalRejected(null);
    } else if (event.nextId === 'withdrawal-completed') {
      this.getWithdrawalCompleted(null);
    } else if (event.nextId === 'withdrawal-auto') {
      this.getWithdrawals(null);
    }
  }

  withdrawalTebsetEvent(withdrawalTebset) {
    if (this.withdrawalTabsetInit === false) {
      this.withdrawalTabsetInit = true;

      if (this.withdrawalTypeString === 'approved') {
        withdrawalTebset.select('withdrawal-completed');
      } else if (this.withdrawalTypeString === 'rejected') {
        withdrawalTebset.select('withdrawal-hold');
      } else if (this.withdrawalTypeString === 'pending') {
        withdrawalTebset.select('withdrawal-pending');
      }
    }
  }

  getWithdrawalsAll(page) {
    let query = {'page': (page || 1)};
    
    if(this.withdrawType != '') {
      query['type'] = this.withdrawType;
    }

    this.bbService.getWithdrawals(query)
    .subscribe((res) => {
      this.manualWithdrawals   = res.withdrawals;
      this.totalMWithdrawals   = res.totalRows;
      this.wmCurrentPage       = res.currentPage;
      this.withdrawals         = res.withdrawals;
      this.listType            = 'all'
    });
  }

  getWithdrawals(page) {
    let query = {'auto_withdraw': true, 'page': (page || 1)};

    this.bbService.getWithdrawals(query)
    .subscribe((res) => {
      this.autoWithdrawals     = res.withdrawals;
      this.totalAWithdrawals   = res.totalRows;
      this.waCurrentPage       = res.currentPage;
      this.withdrawals         = res.withdrawals;
      this.listType            = 'auto';
    });
  }

  getWithdrawalPending(page) {
    let query = {'status': 'pending', 'page': (page || 1)};

    this.bbService.getWithdrawals(query)
    .subscribe((res) => {
      this.manualWithdrawals   = res.withdrawals;
      this.totalMWithdrawals   = res.totalRows;
      this.wmCurrentPage       = res.currentPage;
      this.withdrawals         = res.withdrawals;
      this.listType            = 'pending';
    });
  }

  getWithdrawalTransaction(withdrawType) {
    this.withdrawType = withdrawType;
    this.getWithdrawalsAll(null);
  }

  getWithdrawalRejected(page) {
    let query = {'status': 'rejected', 'page': (page || 1)};

    this.bbService.getWithdrawals(query)
    .subscribe((res) => {
      this.holdWithdrawals     = res.withdrawals;
      this.totalHWithdrawals   = res.totalRows;
      this.whCurrentPage       = res.currentPage;
      this.withdrawals         = res.withdrawals;
      this.listType            = 'rejected';
    });
  }

  getWithdrawalCompleted(page) {
    let query = {'status': 'completed', 'page': (page || 1)};

    this.bbService.getWithdrawals(query)
    .subscribe((res) => {
      this.completedWithdrawals = res.withdrawals;
      this.totalCWithdrawals    = res.totalRows;
      this.wcCurrentPage        = res.currentPage;
      this.withdrawals          = res.withdrawals;
      this.listType             = 'completed';
    });
  }

  public hideModal(): void {
    this.withdrawalModal.hide();
    this.withdrawalSuccessMessage = null;
    this.withdrawalErrorMessage   = null;
  }

  doWithdrawal() {
    let withdrawalData = {
      amount: this.withdrawalForm.value.withdrawalAmount,
      status: this.withdrawalForm.value.withdrawalStatus,
      admin_comments: this.withdrawalForm.value.withdrawalComments,
      id: this.withdrawalId
    };

    this.bbService.updateWithdrawApprovedReject(withdrawalData)
    .subscribe((res) => {
      if (res.hasError) {
        this.withdrawalSuccessMessage = null;
        this.withdrawalErrorMessage   = res.message;
      } else {
        this.withdrawalSuccessMessage = res.message;
        this.withdrawalErrorMessage   = null;

        this._ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this._ngZone.run(() => {
              this.withdrawalSuccessMessage = null;
              this.withdrawalErrorMessage   = null;
              if(this.listType == 'completed') {
                this.getWithdrawalCompleted(null)
              }
              else if(this.listType == 'rejected') {
                this.getWithdrawalRejected(null);
              }
              else if(this.listType == 'pending') {
                this.getWithdrawalPending(null);
              }
              else if(this.listType == 'auto') {
                this.getWithdrawals(null);
              }
              else if(this.listType == 'all') {
                this.getWithdrawalsAll(null);
              }
              
              this.hideModal();
            })
          }, 3000);
        });
      }
    });
  }

  createFormControls() {
    this.withdrawalAmount = new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberPattern)
    ]);
    this.withdrawalStatus = new FormControl('', [
      Validators.required
    ]);
    this.withdrawalComments = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.withdrawalForm = new FormGroup({
      withdrawalAmount: this.withdrawalAmount,
      withdrawalStatus: this.withdrawalStatus,
      withdrawalComments: this.withdrawalComments
    })
  }

  withdrawalApproved(withdrawalId) {
    this.withdrawalId = withdrawalId;
    let withdraw = {};
    for(let idx in this.withdrawals) {
      if(this.withdrawalId == this.withdrawals[idx]._id) {
        withdraw = this.withdrawals[idx];
      }
    }

    if(withdraw && withdraw["_id"]) {
      this.withdrawalForm.controls["withdrawalAmount"].setValue(withdraw["amount"]);
      this.withdrawalModal.show();
    }
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.withdrawalTabsetInit = false;

    if (this.withdrawalTypeString === '') {
      this.getWithdrawalsAll(null);
    } else if (this.withdrawalTypeString === 'approved') {
      this.getWithdrawalCompleted(null);
    } else if (this.withdrawalTypeString === 'rejected') {
      this.getWithdrawalRejected(null);
    }
  }

}
