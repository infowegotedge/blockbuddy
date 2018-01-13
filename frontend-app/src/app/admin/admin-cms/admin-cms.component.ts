import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { BBService } from '../../bb.service';
import { Constants } from '../../app.constants';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import 'lodash';
declare var _;
declare var tinymce: any;

@Component({
  selector: 'app-admin-cms',
  templateUrl: './admin-cms.component.html',
  styleUrls: ['./admin-cms.component.css']
})
export class AdminCmsComponent implements OnInit {
  public title: string = '<strong>CMS Content Delete!!!</strong>';
  public message: string = '<strong>Are you sure</strong>, you want to delete this CMS Content!!!<br/><br/>';

  public deTitle: string = '<strong>CMS Content Block!!!</strong>';
  public deMessage: string = '<strong>Are you sure</strong>, you want to block this CMS Content!!!<br/><br/>';

  elementId: string;
  perPageItem: number;
  cmsMaxSize: number;
  totalCMSContent: number;
  currentPage: number;
  cms: any = [];
  successMessage: string;
  errorMessage: string;
  editor: any;
  cmsContent: any;
  contentHeading: string;
  cmsPhotoString: string;
  showLoader: boolean;

  form: FormGroup;
  cmsHeading: FormControl;
  cmsPhoto: FormControl;

  @ViewChild('createCMSModal') public createCMSModal:ModalDirective;
  constructor(private bbService:BBService, private _ngZone: NgZone) {
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.cmsMaxSize = Constants.MAX_PAGE_SIZE;
    this.elementId = 'text-editor';
  }

  getCMSList(page) {
    let currentPage = page || 1;

    this.bbService.listCMSContent(currentPage)
    .subscribe(_res => {
      if (!_res.hasError) {
        this.cms = _res.cmsContent;
        this.currentPage = _res.currentPage;
        this.totalCMSContent = _res.totalRows;
      }
    });
  }

  hideModal() {
    this.contentHeading = 'Create';
    this.cmsContent     = null;
    this.successMessage = null;
    this.errorMessage   = null;
    this.createCMSModal.hide();
    this.form.controls['cmsHeading'].setValue('');
    tinymce.remove(this.editor);
  }

  createCMSPopup(dataContent) {
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

          if (dataContent != null) {
            this.editor.setContent(dataContent);
          }
        })
      }, 100);
    });

    this.createCMSModal.show();
  }

  saveCMSContent() {
    let cmsContentData = {
      heading: this.form.value.cmsHeading,
      content: this.editor.getContent(),
      photo: this.form.value.cmsPhoto
    }

    if (this.cmsContent == null) {
      if (cmsContentData.content !== '' && this.form.valid) {
        this.bbService.createCMSContent(cmsContentData)
        .subscribe((res) => {
          if (!res.hasError) {
            this.successMessage = res.message;
            this.errorMessage   = null;
            this.getCMSList(null);
            this._ngZone.runOutsideAngular(() => {
              setTimeout(() => {
                this._ngZone.run(() => {
                  this.editor.setContent('');
                  this.hideModal();
                })
              }, 2000);
            });
          } else {
            this.errorMessage   = res.message;
            this.successMessage = null;
          }
        })
      } else {
        this.errorMessage   = 'CMS content is required';
        this.successMessage = null;
      }
    } else if (this.cmsContent != null) {
      cmsContentData['id'] = this.cmsContent._id;
      this.updateCMSContent(cmsContentData);
    }
  }

  updateCMSContent(cmsContentData) {
    if (cmsContentData.content !== '' && this.form.valid) {
      this.bbService.updateCMSContent(cmsContentData)
      .subscribe((res) => {
        if (!res.hasError) {
          this.successMessage = res.message;
          this.errorMessage   = null;
          this.cmsContent     = null;
          this.getCMSList(null);
          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
              this._ngZone.run(() => {
                this.editor.setContent('');
                this.hideModal();
              })
            }, 2000);
          });
        } else {
          this.errorMessage   = res.message;
          this.successMessage = null;
        }
      })
    } else {
      this.errorMessage   = 'CMS content is required';
      this.successMessage = null;
    }
  }

  getDeActivated(cmsId) {
    let cmsContentData = { id: cmsId };
    this.bbService.deActivatedCMSContent(cmsContentData)
    .subscribe((res) => {
      this.getCMSList(null);
    });
  }

  deleteCMSContent(cmsId) {
    let cmsContentData = { id: cmsId };
    this.bbService.deleteCMSContent(cmsContentData)
    .subscribe((res) => {
      this.getCMSList(null);
    });
  }

  // CMS Content Edit
  getCMSContentById(cmsId) {
    this.contentHeading = 'Update';
    this.cmsContent     = _.find(this.cms, {'_id': cmsId});
    this.form.controls['cmsHeading'].setValue(this.cmsContent.cms_heading);
    this.createCMSPopup(this.cmsContent.cms_content);
  }

  createFormControls() {
    this.cmsHeading = new FormControl('', [
      Validators.required
    ]);
    this.cmsPhoto = new FormControl('', [
      Validators.required
    ]);
  }

  createForm() {
    this.form = new FormGroup({
      cmsHeading: this.cmsHeading,
      cmsPhoto: this.cmsPhoto
    });
  }

  fileChange(event, eleId) {
    let fileList: FileList = event;
    let fieldName = "file";

    if (eleId === "cmsPhoto") {
      this.showLoader = true;
      fieldName = "cmsPhoto";
    }

    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append(fieldName, file, file.name);
      this.bbService.changeAvatar(formData)
      .subscribe((res) => {
        if (!res.hasError && eleId === "cmsPhoto") {
          this.form.controls['cmsPhoto'].setValue(res.path);
          this.cmsPhotoString = res.path;
        }

        this.showLoader = false;
      })
    }
  }

  ngOnInit() {
    this.contentHeading = 'Create';
    this.cmsContent = null;
    this.showLoader = false;
    this.getCMSList(null);
    this.createFormControls();
    this.createForm();
  }

}
