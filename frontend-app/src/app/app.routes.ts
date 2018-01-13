import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { WalletComponent } from './wallet/wallet.component';
import { MyTeamComponent } from './my-team/my-team.component';
// import { AffiliatesComponent } from './affiliates/affiliates.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { TeamCommunicationComponent } from './team-communication/team-communication.component';
import { SignupSuccessComponent } from './signup-success/signup-success.component';
import { OtpFeatureComponent } from './otp-feature/otp-feature.component';
import { SuccessComponent } from './success/success.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { DownlineFrontlineComponent } from './downline-frontline/downline-frontline.component';
import { StaticComponent } from './static/static.component';
import { TradingLedgerComponent } from './trading-ledger/trading-ledger.component';
import { TradingMyPortalComponent } from './trading-my-portal/trading-my-portal.component';
import { TradeComponent } from './trade/trade.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { AdminWithdrawalComponent } from './admin/admin-withdrawal/admin-withdrawal.component';
import { AdminFeeComponent } from './admin/admin-fee/admin-fee.component';
import { AdminTransactionsComponent } from './admin/admin-transactions/admin-transactions.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { UserGrantLoginComponent } from './admin/user-grant-login/user-grant-login.component';
import { AdminKycComponent } from './admin/admin-kyc/admin-kyc.component';
import { AdminPaymentsComponent } from './admin/admin-payments/admin-payments.component';
import { AdminRolesComponent } from './admin/admin-roles/admin-roles.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { ProductsComponent } from './products/products.component';
import { PurchaseSfComponent } from './purchase-sf/purchase-sf.component';
import { AdminCommissionComponent } from './admin/admin-commission/admin-commission.component';
import { AdminCompanyComponent } from './admin/admin-company/admin-company.component';
import { BroadcastMessagesComponent } from './admin/broadcast-messages/broadcast-messages.component';
import { AdminNotuserComponent } from './admin/admin-notuser/admin-notuser.component';
import { AdminCmsComponent } from './admin/admin-cms/admin-cms.component';

import { Authenticate } from './app.authenticate';
import { AdminGuard } from './app.adminGuard';


const routes: Routes = [
 { path: '', component: LoginComponent, pathMatch: 'full' },
 { path: 'login', component: LoginComponent },
 { path: 'signup', component: SignupComponent },
 { path: 'success', component: SuccessComponent },
 { path: 'verify-email/:token', component: SignupSuccessComponent },
 { path: 'dashboard', component: DashboardComponent },
 { path: 'profile', component: ProfileComponent, canActivate: [Authenticate] },
 { path: 'wallet', component: WalletComponent, canActivate: [Authenticate] },
 { path: 'my-team', component: DownlineFrontlineComponent, canActivate: [Authenticate] },
 { path: 'my-team/:accessType', component: DownlineFrontlineComponent, canActivate: [Authenticate] },
//  { path: 'affiliate', component: AffiliatesComponent},
 { path: 'commissions', component: CommissionsComponent, canActivate: [Authenticate] },
 { path: 'team-communication', component: TeamCommunicationComponent, canActivate: [Authenticate] },
 { path: 'forgot-password', component: ForgotPasswordComponent },
 { path: 'reset-password/:token', component: ResetPasswordComponent },
 { path: 'manage-otp', component: OtpFeatureComponent, canActivate: [Authenticate]},
 { path: 'product/:coinsName', component: ProductsComponent, canActivate: [Authenticate] },
 { path: 'products', component: ProductsComponent, canActivate: [Authenticate] },
 { path: 'transaction', component: TransactionsComponent, canActivate: [Authenticate] },
 // { path: 'genealogy', component: MyTeamComponent, canActivate: [Authenticate] },
 { path: 'purchase/:message', component: PurchaseSfComponent, canActivate: [Authenticate] },
 { path: 'purchase/:message/:order', component: PurchaseSfComponent, canActivate: [Authenticate] },
 { path: 'static/:contentType', component: StaticComponent, canActivate: [Authenticate] },
 { path: 'trading/ledger', component: TradingLedgerComponent, canActivate: [Authenticate] },
 { path: 'trading/my-portal', component: TradingMyPortalComponent, canActivate: [Authenticate] },
 { path: 'trade/portal/:companyCode', component: TradeComponent, canActivate: [Authenticate] },
 { path: 'portfolio', component: PortfolioComponent, canActivate: [Authenticate] },

  // Admin Routing
 { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'settings', component: SettingsComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-withdrawals', component: AdminWithdrawalComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-withdrawals/:withdrawalType/show', component: AdminWithdrawalComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-withdrawals/:withdrawalType/list', component: AdminWithdrawalComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-withdrawals/:withdrawalType/view', component: AdminWithdrawalComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-fee', component: AdminFeeComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-transfers', component: AdminTransactionsComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'user-management', component: UserManagementComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'user-management/:username/login', component: UserGrantLoginComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-kyc', component: AdminKycComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-payments', component: AdminPaymentsComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-payments/:paymentType/list', component: AdminPaymentsComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-payments/:paymentType/view', component: AdminPaymentsComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-roles', component: AdminRolesComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-products', component: AdminProductsComponent, canActivate: [Authenticate, AdminGuard]},
 { path: 'admin-commission', component: AdminCommissionComponent, canActivate: [Authenticate, AdminGuard] },
 { path: 'admin-company', component: AdminCompanyComponent, canActivate: [Authenticate, AdminGuard] },
 { path: 'admin-broadcast', component: BroadcastMessagesComponent, canActivate: [Authenticate, AdminGuard] },
 { path: 'admin-no-list-users', component: AdminNotuserComponent, canActivate: [Authenticate, AdminGuard] },
 { path: 'admin-cms', component: AdminCmsComponent, canActivate: [Authenticate, AdminGuard] },
]

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });