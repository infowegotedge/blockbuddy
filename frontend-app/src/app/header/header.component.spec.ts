/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { BBService } from '../bb.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PaginationModule } from 'ngx-bootstrap';
import { CookieModule, CookieService } from 'ngx-cookie';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, AuthService } from "angular4-social-login";
import { TimeAgoPipe } from 'time-ago-pipe';
import { WindowRef } from '../app.windows';
import { Constants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

import { HeaderComponent } from './header.component';

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

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule,
        ModalModule.forRoot(),
        ConfirmationPopoverModule.forRoot({
          confirmButtonType: 'danger' // set defaults here
        }),
        PaginationModule.forRoot(),
        CookieModule.forRoot()
      ],
      providers: [
        BBService,
        WindowRef,
        LocalStorageService,
        Constants,
        CookieService,
        AuthService,
        { provide: XHRBackend, useClass: MockBackend },
        { provide: AuthServiceConfig, useFactory: provideConfig }
      ],
      declarations: [ TimeAgoPipe, HeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submitting a form ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    // Mock testing parameter
    let profile: any;
    let country: any;
    const mockBody = {
      hasError: false,
      user: {
        avatar: "", first_name: "ravi89", last_name: "mehrotra89",
        name: "ravi89 mehrotra89", email: "ravi89@allies.co.in",
        username: "ravimehrotra89", mobile: "+911234567890",
        country: "india", sponsorUsername: "ravimehrotra",
        sponsorName: "ravi mehrotra", address: "The Mall",
        city: "Kanpur", state: "UP", postal: "208001", enable2FA: false
      },
      "india":"IN"
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getProfile().subscribe((res) => profile = res);
    service.countryFlag().subscribe((res) => country = res);

    // Trigger the login function
    component.getProfile();

    // Now we can check to make sure the emitted value is correct
    expect(profile.hasError).toBe(false);
    expect(profile.user.avatar).toBe("");
    expect(profile.user.first_name).toBe("ravi89");
    expect(profile.user.last_name).toBe("mehrotra89");
    expect(profile.user.name).toBe("ravi89 mehrotra89");
    expect(profile.user.email).toBe("ravi89@allies.co.in");
    expect(profile.user.username).toBe("ravimehrotra89");
    expect(profile.user.mobile).toBe("+911234567890");
    expect(profile.user.country).toBe("india");
    expect(profile.user.sponsorUsername).toBe("ravimehrotra");
    expect(profile.user.sponsorName).toBe("ravi mehrotra");
    expect(profile.user.address).toBe("The Mall");
    expect(profile.user.city).toBe("Kanpur");
    expect(profile.user.state).toBe("UP");
    expect(profile.user.postal).toBe("208001");
    expect(profile.user.enable2FA).toBe(false);
  }));
});
