import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { BBService } from '../bb.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  adminRole: boolean = false;
  roleObject: string;
  linkObject: any;
  username: string;
  notifications: any = {};

  constructor(private bbService: BBService, private localStorage: LocalStorageService) { }

  getProfile() {
    if (this.localStorage.retrieve('userid')) {
      this.username = this.localStorage.retrieve('userid');
    }
  }

  ngOnInit() {

    let role = this.localStorage.retrieve('role');
    let xrole = this.localStorage.retrieve('xrole');

    if(xrole) {
      role = xrole;
    }

    if ( role === 'admin' || role === 'supervisor' ) {
      this.adminRole = true;
      this.roleObject = 'admin';
      this.linkObject = [
        { link: '/dashboard', name: 'Dashboard', icon: 'fa fa-dashboard', image: 'assets/images/icons/dashboard_1x.png', id: 'dashboard' },
        { link: '#', name: 'Users', role: 'admin', icon: 'fa fa-users', id: 'admin', count: 0, child: [
          { link: '/user-management', name: 'Users' },
          { link: '/admin-no-list-users', name: 'Orphan Users'},
          { link: '/admin-kyc', name: 'KYC', count: 0 },
          // { link: '/genealogy', name: 'Genealogy' },
          { link: '/admin-roles', name: 'Role Management' },
        ]},
        { link: '/admin-company', name: 'Admin Company', role: 'admin', icon: 'fa fa-building-o', id: 'company' },
        { link: '/admin-broadcast', name: 'Broadcast Message', role: 'admin', icon: 'fa fa-microphone', id: 'company' },
        { link: '/admin-products', name: 'Admin Products', role: 'admin', icon: 'fa fa-product-hunt', id: 'products' },
        { link: '#', name: 'Payments', role: 'admin', icon: 'fa fa-credit-card', id: 'payments', count: 0, child: [
          { link: '/admin-payments', name: 'Transactions' },
          { link: '/admin-payments/pending/list', name: 'Pending' },
          { link: '/admin-payments/completed/view', name: 'Completed' }
        ]},
        { link: '#', name: 'Admin Withdrawals', role: 'admin', icon: 'fa fa-money', id: 'withdrawals', count: 0, child: [
          { link: '/admin-withdrawals', name: 'Transactions' },
          { link: '/admin-withdrawals/pending/show', name: 'Pending' },
          { link: '/admin-withdrawals/approved/list', name: 'Approved' },
          { link: '/admin-withdrawals/rejected/view', name: 'Rejected' },
          { link: '/admin-transfers', name: 'Transfers' }
        ]},
        { link: '/admin-fee', name: 'Admin Fees', role: 'admin', icon: 'fa fa-credit-card', id: 'admin-fees' },
        { link: '/admin-cms', name: 'CMS', role: 'admin', icon: 'fa fa-code', id: 'cms' },
        { link: '#', name: 'Trading', role: 'admin', icon: 'fa fa-exchange', id: 'trading', count: 0, child: [
          { link: '#', name: 'Transaction' },
          { link: '#', name: 'BKN' },
          { link: '#', name: 'VAN' }
        ]},
        { link: '/admin-commission', name: 'Commission', role: 'admin', icon: 'fa fa-percent', id: 'admin-commission' },
        { link: '/settings', name: 'Settings', role: 'admin', icon: 'fa fa-cog', id: 'settings' }
      ];

      this.bbService.notificationCounts()
      .subscribe(res => {
        this.notifications = {
          payments: res.payments,
          withdrawals: res.withdrawals,
          kycCount: res.kycCount,
          users: res.users
        }
      });
    } else if (role === 'moderator') {
      this.adminRole = true;
      this.roleObject = 'moderator';
      this.linkObject = [
        { link: '/dashboard', name: 'Dashboard', icon: 'fa fa-dashboard', image: 'assets/images/icons/dashboard_1x.png', id: 'dashboard' },
        { link: '#', name: 'Users', role: 'moderator', icon: 'fa fa-users', id: 'users', child: [
          { link: '/user-management', name: 'Manage Users' },
          { link: '/admin-no-list-users', name: 'Orphan Users'},
          { link: '/admin-kyc', name: 'KYC' }
        ]}
      ];
    } else {
      this.username = null;
      if (this.localStorage.retrieve('userid')) {
        this.username = this.localStorage.retrieve('userid');
      }

      this.linkObject = [
        { link: '/dashboard', name: 'Home', icon: '', image: 'assets/images/icons/dashboard_1x.png', id: 'dashboard' },
        { link: '/portfolio', name: 'Exchange', icon: '', image: 'assets/images/icons/my-team.png', id: 'exchange' },
        // { link: '#', name: 'Portfolio', icon: '', image: 'assets/images/icons/my-team.png', id: 'my-team', child: [
        //   { link: '/genealogy', name: 'Genealogy' },
        //   { link: '/my-team', name: 'My Downline' },
        // ]},
        { link: '#', name: 'Trade', icon: '', image: 'assets/images/icons/trading.png', id: 'trading', child: [
          { link: '/trading/my-portal', name: 'Exchange Portal' },
          { link: '/trading/ledger', name: 'Exchange History' },
        ]},
        { link: '/transaction', name: 'Wallets', icon: '', image: 'assets/images/icons/wallet.png', id: 'wallet' },
        { link: '/products', name: 'Coins', icon: '', image: 'assets/images/icons/my-team.png', id: 'coins' }
        // { link: '/affiliates', name: 'Affiliates', icon: '', image: 'assets/images/icons/dashboard_1x.png', id: 'affiliates' },
        // { link: '/team-communication', name: 'Team Communication', icon: '', image: 'assets/images/icons/team-comunication.png', id: 'mailbox' },
        // { link: '/transaction', name: 'Transaction History', icon: '', image: 'assets/images/icons/transaction-history.png', id: 'transaction' },
      ];
    }
  }

}
