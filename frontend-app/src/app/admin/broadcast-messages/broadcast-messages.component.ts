import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Constants } from '../../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-broadcast-messages',
  templateUrl: './broadcast-messages.component.html',
  styleUrls: ['./broadcast-messages.component.css']
})
export class BroadcastMessagesComponent implements OnInit {

  public title: string = '<strong>Confirmation!!!</strong>';
  public message1: string = '<strong>Are you sure</strong>, you want to delete this message!!!<br/><br/>';

  public untitle: string = '<strong>Confirmation!!!</strong>';
  public unmessage: string = '<strong>Are you sure</strong>, you want to delete this message!!!<br/><br/>';

  notifyMaxSize: number;
  perPageItem: number;
  totalRows: number;
  currentPage: number;
  noMessageFound: string;
  messages: any = [];
  successMessage: string;
  errorMessage: string;

  form: FormGroup;
  message: FormControl;

  @ViewChild('broadcastNotificationModal') public broadcastNotificationModal:ModalDirective;
  constructor(
    private bbService: BBService, 
    private localStorage: LocalStorageService, 
    private _ngZone: NgZone
  ) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.notifyMaxSize = Constants.MAX_PAGE_SIZE;
  }

  getBroadCastMessage(page) {
    let pageNum = (page || 1);
    this.noMessageFound = null;
    
    this.bbService.getBroadCastMessage(pageNum)
    .subscribe((_res) => {
      if(!_res.hasError) {
        this.messages = _res.notification;
        this.totalRows = _res.totalRows
        this.currentPage = _res.currentPage

        if(_res.notification.length === 0) {
          this.noMessageFound = Constants.NO_MESSAGES_FOUND;
        }
      }
      else {
        this.noMessageFound = Constants.NO_MESSAGES_FOUND;
      }
    })
  }

  broadCastMessage() {
    if(this.form.valid) {
      let messageData = {
        message: this.form.value.message
      };

      this.bbService.createBroadCastMessage(messageData)
      .subscribe((_res) => {
        if(!_res.hasError) {
          this.errorMessage = null;
          this.successMessage = _res.message;
          this.getBroadCastMessage(null);
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
        else {
          this.errorMessage = _res.message;
          this.successMessage = null;
        }
      });
    }
    else {
      this.errorMessage = 'Validation failed.';
    }
  }

  getBlockNotify(messageId) {
    this.bbService.updateBroadCastMessage({"messageId": messageId})
    .subscribe((_res) => {
      this.getBroadCastMessage(null);
    });
  }

  showBroadCastNotificationMessage() {
    this.broadcastNotificationModal.show();
  }

  public hideModal(): void {
    this.broadcastNotificationModal.hide();
  }

  createFormControls() {
    this.message = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      message: this.message,
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getBroadCastMessage(null);
  }

}
