import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-admin-commission',
  templateUrl: './admin-commission.component.html',
  styleUrls: ['./admin-commission.component.css']
})
export class AdminCommissionComponent implements OnInit {

  public title: string = '<strong>Commission Delete!!!</strong>';
  public message: string = '<strong>Are you sure</strong>, you want to delete this!!!<br/><br/>';

  commission: any = [];
  editCommission: any = {};
  commissionForm: FormGroup;
  numberCommission: FormControl;
  commissionPercent: FormControl;
  commissionType: FormControl;
  numberPattern: string;
  numberPatternDecimal: string;
  updateError: string;
  updateSuccess: string;
  createError: string;
  createSuccess: string;
  currentPage: number;
  totalCommission: number;
  perPageItem: number;
  commissionMaxSize: number;

  @ViewChild('commissionModal') public commissionModal:ModalDirective;
  @ViewChild('commissionCreateModal') public commissionCreateModal:ModalDirective;
  constructor(private bbService: BBService, private localStorage: LocalStorageService, private _ngZone: NgZone) {
    this.numberPattern        = Constants.NUMBER_PATTER_WITHOUT_DECIMAL;
    this.numberPatternDecimal = Constants.NUMBER_PATTER;
    this.perPageItem          = Constants.PAGINATION_SIZE;
    this.commissionMaxSize    = Constants.MAX_PAGE_SIZE;
  }

  listCommission(page) {
    page = (page || 1);

    this.bbService.listCommission(page).subscribe((_res) => {
      if(_res.hasError) {

      } else {
        this.commission      = _res.commissions;
        this.totalCommission = _res.totalRows;
        this.currentPage     = _res.currentPage;
      }
    });
  }

  deleteCommission(commissionId) {
    this.bbService.deleteCommission({"id": commissionId})
    .subscribe((_res) => {
      this.listCommission(null);
    })
  }

  commissionEdit(commissionId) {
    for (let i in this.commission) {
      if (this.commission[i]['_id'] == commissionId) {
        this.editCommission = this.commission[i];
      }
    }
    
    this.commissionForm.controls["numberCommission"].setValue(this.editCommission.level_number);
    this.commissionForm.controls["commissionPercent"].setValue(this.editCommission.commission);
    this.commissionForm.controls["commissionType"].setValue(this.editCommission.commission_type);
    this.commissionModal.show();
  }

  updateCommission() {
    this.updateError = null;
    if(this.commissionForm.valid && this.commissionForm.value.commissionPercent < 100 && this.commissionForm.value.commissionPercent > 0) {
      let commissionData = {
        commission: this.commissionForm.value.commissionPercent,
        commission_id: this.editCommission._id,
        commission_type: this.commissionForm.value.commissionType
      }

      this.bbService.updateCommission(commissionData)
      .subscribe((_res) => {
        if(_res.hasError) {
          this.updateError   = _res.message;
          this.updateSuccess = null;
        } else {
          this.updateError   = null;
          this.updateSuccess = _res.message;
          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this._ngZone.run(() => {
                if (this.updateSuccess) {
                  this.listCommission(null);
                  this.hideModal();
                }
              })
            }, 3000);
          });
        }
      });
    }
    else {
      this.updateError = "Commission percentage should be less than 100% and greater then 0";
    }
  }

  createCommission() {
    this.createError = null;
    if(this.commissionForm.valid && this.commissionForm.value.commissionPercent < 100 && this.commissionForm.value.commissionPercent > 0) {
      let commissionData = {
        commission: this.commissionForm.value.commissionPercent,
        level_number: this.commissionForm.value.numberCommission,
        commission_type: this.commissionForm.value.commissionType
      }

      this.bbService.createCommission(commissionData)
      .subscribe((_res) => {
        if(_res.hasError) {
          this.createError   = _res.message;
          this.createSuccess = null;
        } else {
          this.createError   = null;
          this.createSuccess = _res.message;
          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this._ngZone.run(() => {
                if (this.createSuccess) {
                  this.listCommission(null);
                  this.hideModal();
                }
              })
            }, 3000);
          });
        }
      });
    }
    else {
      this.createError = "Commission percentage should be less than 100% and greater then 0";
    }
  }

  commissionCreate() {
    this.commissionCreateModal.show();
  }

  createFormControls() {
    this.numberCommission = new FormControl('', [
      Validators.required,
      Validators.pattern(this.numberPattern)
    ]);
    this.commissionPercent = new FormControl('', [
      Validators.required,
      Validators.maxLength(4),
      Validators.pattern(this.numberPatternDecimal)
    ]);
    this.commissionType = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.commissionForm = new FormGroup({
      numberCommission: this.numberCommission,
      commissionPercent: this.commissionPercent,
      commissionType: this.commissionType
    });
  }

  public hideModal(): void {
    this.updateError   = null;
    this.updateSuccess = null;
    this.createError   = null;
    this.createSuccess = null;
    this.commissionModal.hide();
    this.commissionCreateModal.hide();
  }

  ngOnInit() {
    this.commission = [];
    this.createFormControls();
    this.createForm();
    this.listCommission(null)
  }

}
