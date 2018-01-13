import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ngx-webstorage';
import { CookieModule } from 'ngx-cookie';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap';
import { HttpModule } from '@angular/http';
import { routing } from './app.routes';
import { Authenticate } from './app.authenticate';
import { AdminGuard } from './app.adminGuard';
import { WindowRef } from './app.windows';
import { JQueryWork } from './app.jquery';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from "angular4-social-login";
import { TimeAgoPipe } from 'time-ago-pipe';
import { TreeModule } from 'angular-tree-component';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { BBService } from './bb.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { WalletComponent } from './wallet/wallet.component';
import { MyTeamComponent } from './my-team/my-team.component';
import { CommissionsComponent } from './commissions/commissions.component';
// import { AffiliatesComponent } from './affiliates/affiliates.component';
import { TeamCommunicationComponent } from './team-communication/team-communication.component';
import { SignupSuccessComponent } from './signup-success/signup-success.component';

import { NgUploaderModule } from 'ngx-uploader';
import { PaginationModule } from 'ngx-bootstrap';

import { FileUploaderModule } from "ng4-file-upload/file-uploader.module";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdDataTableModule } from 'ng2-md-datatable';
import { OtpFeatureComponent } from './otp-feature/otp-feature.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from './admin/settings/settings.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminWithdrawalComponent } from './admin/admin-withdrawal/admin-withdrawal.component';
import { AdminFeeComponent } from './admin/admin-fee/admin-fee.component';
import { AdminTransactionsComponent } from './admin/admin-transactions/admin-transactions.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { SuccessComponent } from './success/success.component';
import { UserGrantLoginComponent } from './admin/user-grant-login/user-grant-login.component';
import { AdminKycComponent } from './admin/admin-kyc/admin-kyc.component';
import { AdminPaymentsComponent } from './admin/admin-payments/admin-payments.component';
import { AdminRolesComponent } from './admin/admin-roles/admin-roles.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { ProductsComponent } from './products/products.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { MyStaticsComponent } from './my-statics/my-statics.component';
import { TopbarNavComponent } from './topbar-nav/topbar-nav.component';
import { DownlineFrontlineComponent } from './downline-frontline/downline-frontline.component';
import { PurchaseSfComponent } from './purchase-sf/purchase-sf.component';
import { StaticComponent } from './static/static.component';
import { AdminCommissionComponent } from './admin/admin-commission/admin-commission.component';
import { TradingLedgerComponent } from './trading-ledger/trading-ledger.component';
import { TradingMyPortalComponent } from './trading-my-portal/trading-my-portal.component';
import { BuyButtonComponent } from './buy-button/buy-button.component';
import { AdminCompanyComponent } from './admin/admin-company/admin-company.component';
import { BroadcastMessagesComponent } from './admin/broadcast-messages/broadcast-messages.component';
import { AdminNotuserComponent } from './admin/admin-notuser/admin-notuser.component';
import { AdminCmsComponent } from './admin/admin-cms/admin-cms.component';
import { TradeGraphComponent } from './trade-graph/trade-graph.component';
import { TradeComponent } from './trade/trade.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("832021259654-l11ho5vvkskff2jns8af5453f0i6vujk.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("389672018117911")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    BrowserModule,
    Ng2Webstorage,
    CookieModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    NgUploaderModule,
    BrowserAnimationsModule,
    MdDataTableModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    NgbModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    AmChartsModule,
    SocialLoginModule,
    TreeModule,
    FileUploaderModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    WalletComponent,
    MyTeamComponent,
    CommissionsComponent,
    // AffiliatesComponent,
    TeamCommunicationComponent,
    SignupSuccessComponent,
    ResetPasswordComponent,
    OtpFeatureComponent,
    SettingsComponent,
    AdminDashboardComponent,
    AdminWithdrawalComponent,
    AdminFeeComponent,
    AdminTransactionsComponent,
    UserManagementComponent,
    SuccessComponent,
    UserGrantLoginComponent,
    AdminKycComponent,
    AdminPaymentsComponent,
    AdminRolesComponent,
    AdminProductsComponent,
    ProductsComponent,
    TransactionsComponent,
    MyStaticsComponent,
    TopbarNavComponent,
    DownlineFrontlineComponent,
    PurchaseSfComponent,
    TimeAgoPipe,
    StaticComponent,
    AdminCommissionComponent,
    TradingLedgerComponent,
    TradingMyPortalComponent,
    BuyButtonComponent,
    AdminCompanyComponent,
    BroadcastMessagesComponent,
    AdminNotuserComponent,
    AdminCmsComponent,
    TradeGraphComponent,
    TradeComponent,
    PortfolioComponent
  ],
  providers: [
    BBService,
    Authenticate,
    AdminGuard,
    WindowRef,
    JQueryWork,
    { provide: AuthServiceConfig, useFactory: provideConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  public isClass = true;
}
