import { Component, OnInit, ViewChild } from '@angular/core';
import { BBService } from '../bb.service';
import { Constants } from '../app.constants';
import { LocalStorageService } from 'ngx-webstorage';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';


@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.css']
})
export class MyTeamComponent implements OnInit {

  private myDirects: any = [];
  private myTeam: any = [];
  private totalTeam: number;
  private currentPage: number = 1;
  private teamCurrentPage: number = 1;
  private directsCurrentPage: number = 1;
  private totalDirects: number;
  private userId: string;
  private countryFlag: {};
  private myNetwork: any = [];
  private flagUrl: any = [];
  private user: any = {};
  private showLoader: boolean = false;
  leaderBoardData: any = [];
  last7days: any = [];
  last30days: any = [];
  allUsers: any = [];
  totalTeamMaxSize: number = 0;
  totalDirectsMaxSize: number = 0;
  teamPerPage: number = 0;
  directsPerPage: number = 0;
  perPageItem: number;
  form: FormGroup;
  username: FormControl;
  nodes: any = [];
  options: any = {};
  adminRole: boolean;
  noMyNetworkData: string;
  noUniLevelData: string;

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor(private bbService: BBService, private localStorage: LocalStorageService) {
    this.userId = localStorage.retrieve('userid');
    this.perPageItem = Constants.PAGINATION_SIZE;
    this.totalDirectsMaxSize = Constants.MAX_PAGE_SIZE;
    this.totalTeamMaxSize = Constants.MAX_PAGE_SIZE;
  }

  getMyNetwork(_username) {
    let userData;
    if (_username === null || _username === '' || _username === 'null') {
      if(!this.adminRole) {
        userData = this.localStorage.retrieve('userid');
      }
      else {
        userData = null;
        this.myNetwork  = []
      }
    } else {
      userData = _username;
    }

    if (userData) {
      this.showLoader = true;
      this.bbService.myNetwork(userData)
      .subscribe((_res) => {
        this.showLoader = false;
        this.myNetwork  = [];
        if (!_res.hasError && _res.users.length > 0) {
          this.myNetwork = _res.users;
          this.noMyNetworkData = null
        }
        else {
          this.noMyNetworkData = Constants.NO_BINARY_FOUND;
        }
      })
    }
  }

  getUniLevelMyNetwork(_username) {
    let userData;
    if (_username === null || _username === '' || _username === 'null') {
      userData = this.localStorage.retrieve('userid');
    } else {
      userData = _username;
    }

    if (userData) {
      this.bbService.myUniLevelNetwork(userData, 1)
      .subscribe((_res) => {
        if (!_res.hasError) {
          let myNetwork = _res.users;
          this.nodes.push(_res.parent);
          this.nodes[0]['children'] = [];
          this.nodes[0]['showMeClick'] = 0;
          if (myNetwork.length > 0) {
            for (let network of myNetwork) {
              let data = network;
              data['showMeClick'] = data['count'];
              data['page'] = 1;
              data['totalPages'] = 0;
              this.nodes[0]['children'].push(data);
            }

            if ((_res.currentPage * this.perPageItem) < _res.totalPages) {
              this.nodes[0]['page'] = (_res.currentPage + 1);
              this.nodes[0]['children'].push({
                label: 'Load more...',
                type: 'button',
                showMore: true
              });
            }

            this.noUniLevelData = null
          } else {
            this.noUniLevelData = Constants.NO_UNILEVEL_FOUND;
          }
        }
      })
    }
  }

  getUniLevelMyNetworkLevel(event, _username, index, node, tree, loadMoreButton, nodeIn) {
    let page = 1;
    let userData;

    if (_username === null || _username === '' || _username === 'null') {
      userData = this.localStorage.retrieve('userid');
    } else {
      userData = _username;
    }

    if (userData && (node.data.showMeClick > 0 || loadMoreButton)) {
      node.data.showMeClick = 0;
      page = node.data.page;

      this.bbService.myUniLevelNetwork(userData, page)
      .subscribe((_res) => {
        node.data.showMeClick = 0;

        if (!_res.hasError) {
          let myNetwork = _res.users;
          if (!loadMoreButton) {
            node.data.children = [];
          } else if (loadMoreButton && nodeIn) {
            node.data.children[node.data.children.length - 1].showMore = false;
            nodeIn.hide();
          }

          for (let network of myNetwork) {
            let data = network;
            data['showMeClick'] = data['count'];
            data['page'] = 1;
            data['totalPages'] = 0;
            node.data.children.push(data);
          }

          if ((_res.currentPage * this.perPageItem) < _res.totalPages) {
            node.data.page = (_res.currentPage + 1);
            node.data.children.push({
              label: 'Load more...',
              type: 'button',
              showMore: true
            });
          }

          tree.treeModel.update();
          tree.treeModel.expandAll();
        }
      })
    }
  }

  getFlagUrl(_countryName) {
    if (_countryName) {
      if(this.countryFlag && this.countryFlag[_countryName]) {
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
    this.adminRole = true;
    this.createFormControls();
    this.createForm();
    this.getCountryFlag();
    this.options = {
      useVirtualScroll: true,
      nodeHeight: 22,
      dropSlotHeight: 3
    };

    let roleAdmin = this.localStorage.retrieve('role');

    if (roleAdmin !== 'admin' && roleAdmin !== 'moderator' && roleAdmin !== 'supervisor') {
      this.adminRole = false;
      this.getMyNetwork(null);
    }

    this.getUniLevelMyNetwork(null);
  }

}
