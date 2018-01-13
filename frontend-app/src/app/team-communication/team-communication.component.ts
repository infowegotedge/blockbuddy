import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../bb.service';
import { Constants } from '../app.constants';

// declare var jQuery: any;
import 'lodash';
declare var _;
declare var tinymce: any;

@Component({
  selector: 'app-team-communication',
  templateUrl: './team-communication.component.html',
  styleUrls: ['./team-communication.component.css']
})
export class TeamCommunicationComponent implements OnInit {
  private myDirects: any = [];
  private sendData: any = {};
  private totalDirects: number;
  elementId: string;
  currentPage: number = 1;
  inboxCurrentPage: number = 1;
  outboxCurrentPage: number = 1;
  maxSize: number
  selectAction: boolean = false;
  selectedUser: any = [];
  sendError: string;
  sendSuccess: boolean;
  inboxMessage: any = [];
  outboxMessage: any = [];
  inboxTotal: number;
  outboxTotal: number;
  inboxMaxSize: number;
  outboxMaxSize: number;
  inboxMessageDescription: any = {};
  outboxMessageDescription: any = {};
  showInboxMessage: boolean = false;
  showOutboxMessage: boolean = false;
  perPageItem: number;
  editor: any;
  public froalaOptions: any;
  firstTimeEditor: boolean;
  noDirectsMessages: string;
  noInBoxMessages: string;
  noOutBoxMessages: string;

  @ViewChild('messageModal') public messageModal: ModalDirective;
  @ViewChild('messageInModal') public messageInModal: ModalDirective;
  constructor(private bbService: BBService, private _ngZone: NgZone) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.maxSize     = Constants.MAX_PAGE_SIZE;
    this.inboxMaxSize = Constants.MAX_PAGE_SIZE;
    this.outboxMaxSize = Constants.MAX_PAGE_SIZE;
    this.elementId = 'text-editor';
  }

  beforeChange(event) {
    if (event.nextId === 'inbox') {
      this.getInboxMessage(null);
      tinymce.remove(this.editor);
    } else if (event.nextId === 'outbox') {
      this.getOutboxMessage(null);
      tinymce.remove(this.editor);
    } else if (event.nextId === 'send-message') {
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this._ngZone.run(() => {
            tinymce.init({
              selector: '#' + this.elementId,
              branding: false,
              height : 300,
              max_height: 300,
              menubar: false,
              plugins: ['link', 'paste', 'table'],
              skin_url: 'assets/skins/lightgray',
              setup: editor => {
                this.editor = editor;
                editor.on('keyup', () => {
                  const content = editor.getContent();
                });
              }
            });
          })
        }, 100);
      });
    }
  }

  // Get Inbox Message
  getInboxMessage(_currentPage) {
    this.bbService.inboxMessage(_currentPage)
    .subscribe((res) => {
      if (!res.hasError) {
        this.inboxMessage = res.messages;
        this.inboxTotal = res.totalRows;
        if(res.messages.length == 0) {
          this.noInBoxMessages = Constants.NO_MESSAGES_FOUND;
        }
      }
    })
  }

  // Get Outbox Message
  getOutboxMessage(_currentPage) {
    this.bbService.outboxMessage(_currentPage)
    .subscribe((res) => {
      if (!res.hasError) {
        this.outboxMessage = res.messages;
        this.outboxTotal = res.totalRows;
        if(res.messages.length == 0) {
          this.noOutBoxMessages = Constants.NO_MESSAGES_FOUND;
        }
      }
    })
  }

  // Remove Null Values
  removeNullValues(_userList) {
    let sendList = [];
    for (let j=0; j<_userList.length; j++) {
      if (_userList[j] !== undefined) {
        sendList.push(_userList[j]);
      }
    }
    this.selectedUser = sendList;
  }

  // Get My Directs
  getMyDirects(currentPage, param) {
    this.bbService.getMyDirects(currentPage)
    .subscribe((res) => {
      this.myDirects = res.directs;

      if(res.directs.length == 0) {
        this.noDirectsMessages = Constants.NO_DIRECTS_FOUND;
      }

      for (let i=0; i<this.myDirects.length; i++) {
        this.myDirects[i].isSelected = false;
      }

      this.totalDirects = res.totalRows;

      // Check User Selection
      if (param === 'true') {
        this.checkSelectedUser(this.selectedUser, this.myDirects);
      }
    })
  }

  // Pagewise select all user
  selectAllUser(_user, _selectAction) {
    for (let i=0; i<_user.length; i++) {
      this.myDirects[i].isSelected = (_selectAction === false ? true : false);
      if (_selectAction === true && this.selectedUser.indexOf(_user[i].userid) !== -1) {
        let emailArray = this.selectedUser.indexOf(_user[i].userid);
        delete this.selectedUser[emailArray];
      } else {
        this.selectedUser.push(this.myDirects[i].userid);
      }
    }
    this.removeNullValues(this.selectedUser);
  }

  // Update selected user list
  updateUserList(_id, _param) {
    if (_param === true && this.selectedUser.indexOf(_id) !== -1) {
      let emailArray = this.selectedUser.indexOf(_id);
      delete this.selectedUser[emailArray];
    } else {
      this.selectedUser.push(_id);
    }

    this.removeNullValues(this.selectedUser);
    this.checkSelectedUser(this.selectedUser, this.myDirects);
  }


  // Check User Selection
  checkSelectedUser(_selectedUser, _user) {
    let matchedId = [];
    let countSelection = 0;
    for (let i=0; i<_user.length; i++) {
      if (this.selectedUser.indexOf(_user[i].userid) !== -1) {
        _user[i].isSelected = true;
        matchedId.push(_user[i]);
        countSelection++;
      } else {
        _user[i].isSelected = false;
        matchedId.push(_user[i]);
      }
    }

    // Check / Uncheck Select All 
    if (_user.length === countSelection) {
      this.selectAction = true;
    } else {
      this.selectAction = false;
    }

    if (matchedId.length > 0) {
      this.myDirects = matchedId;
    }
  }

  // Send Message to Users
  sendMessage(event) {

    if(this.selectedUser.length > 0 && this.sendData.subject != '' && this.editor.getContent() != '') {
      let sendParam = {
        sent_to : this.selectedUser,
        subject : this.sendData.subject,
        message : this.editor.getContent()
      }
  
      this.bbService.sendMail(sendParam).subscribe((_res) => {
        if (_res.hasError) {
          this.sendError = _res.message;
          this.sendSuccess = false;
          this.hideMessage();
        } else {
          this.sendSuccess = true;
          this.sendError = null;
          this.editor.setContent('');
          this.hideMessage();
        }
      });
    }
    else {
      this.sendSuccess = false;
      if(this.selectedUser.length == 0) {
        this.sendError = "Please select your members";
      }
      else if(this.sendData.subject == '') {
        this.sendError = "Please enter your subject";
      }
      else if(this.editor.getContent() == '') {
        this.sendError = "Please enter your message";
      }
      this.hideMessage();
    }
  }

  hideMessage() {
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this._ngZone.run(() => {
          this.sendError = null;
          this.sendSuccess = false;
        })
      }, 3000);
    });
  }

  // View Inbox Message
  viewInboxMessage(_messageId) {
    this.showInboxMessage = true;
    this.inboxMessageDescription = _.find(this.inboxMessage, {'id': _messageId});
    this.messageInModal.show();
    
    if(this.inboxMessageDescription.status != '2') {
      this.bbService.markMessageRead({id: _messageId}).subscribe((_res) => {
        // Output
      });
    }
  }

  // View Outbox Message
  viewOutboxMessage(_messageId) {
    this.showOutboxMessage = true;
    this.outboxMessageDescription = _.find(this.outboxMessage, {'id': _messageId});
    this.messageModal.show();
  }

  // Search Inbox Message
  searchInboxMessage(_searchText) {
    if (_searchText) {
      this.bbService.searchInboxList(_searchText)
      .subscribe((res) => {
        this.inboxMessage = res.messages;
        this.inboxTotal = res.totalRows;
        this.inboxMaxSize = Math.ceil(res.totalRows / res.perPage);
      })
    } else {
      this.getInboxMessage(this.inboxCurrentPage);
    }
  }

  // Search Sent Message
  searchSentMessage(_searchText) {
    if (_searchText) {
      this.bbService.searchSentList(_searchText)
      .subscribe((res) => {
        this.outboxMessage = res.messages;
        this.outboxTotal   = res.totalRows;
        this.outboxMaxSize = Math.ceil(res.totalRows / res.perPage);
      })
    } else {
      this.getOutboxMessage(this.outboxCurrentPage);
    }
  }

  searchUsers(users) {
    let query = '1';

    if(users) {
      query = '1&email='+users;
    }

    this.bbService.getMyDirects(query)
    .subscribe((res) => {
      this.myDirects = res.directs;

      for (let i=0; i<this.myDirects.length; i++) {
        this.myDirects[i].isSelected = false;
      }

      this.totalDirects = res.totalRows;
    })
  }

  ngOnInit() {
    this.firstTimeEditor = false;
    this.getMyDirects(this.currentPage, 'false');
    this.getInboxMessage(this.inboxCurrentPage);
  }
  
}
