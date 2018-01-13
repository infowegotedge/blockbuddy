/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Http, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { LocalStorageService } from 'ngx-webstorage';
import { WindowRef } from './app.windows';
import { BBService } from './bb.service';

describe('BBService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        LocalStorageService,
        WindowRef,
        BBService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });


  it('should ...', inject([BBService], (service: BBService) => {
    expect(service).toBeTruthy();
  }));


  it('should userRole is false ...', inject([BBService], (service: BBService) => {
    let role = service.getRole();
    expect(role).toBeFalsy();
  }));


  it('should isLoggedIn is false ...', inject([BBService], (service: BBService) => {
    let isLoggedIn = service.isLoggedIn();
    expect(isLoggedIn).toBeFalsy();
  }));


  it('should Log In ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      token: "asdfasdf-asdfasf-sadfsaf-24234o2jsdf2",
      role: 'user'
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.login("ravimehrotra", "mehr4842otra").subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.token).toBe(mockBody.token);
      expect(res.role).toBe(mockBody.role);
    })
  }));


  it('should LogIn As User ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      token: "asdfasdf-asdfasf-sadfsaf-24234o2jsdf2",
      role: 'user'
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.loginAsUser({username: 'ravimehrotra'}).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.token).toBe(mockBody.token);
      expect(res.role).toBe(mockBody.role);
    })
  }));


  it('should Register User ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Saved Successfully."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      sponsorid: 'bb',
      username: 'ravi',
      password: 'mehro131af',
      email: 'ravi@allies.co.in',
      fname: 'ravi',
      lname: 'mehrotra',
      country: 'India',
      mobile: '+911234567890'
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.register(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    })
  }));


  it('should Add User ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Saved Successfully."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      sponsorid: 'ravi',
      username: 'ravimehrotra',
      password: 'mehro131af',
      email: 'ravi@allies.co.in',
      fname: 'ravi',
      lname: 'mehrotra',
      country: 'India',
      mobile: '+911234567890'
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.addUser(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    })
  }));


  it('should Get Profile ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      user: {
        avatar: "", first_name: "ravi89", last_name: "mehrotra89",
        name: "ravi89 mehrotra89", email: "ravi89@allies.co.in",
        username: "ravimehrotra89", mobile: "+911234567890",
        country: "india", sponsorUsername: "ravimehrotra",
        sponsorName: "ravi mehrotra", address: "The Mall",
        city: "Kanpur", state: "UP", postal: "208001", enable2FA: false
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getProfile().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.user.avatar).toBe("");
      expect(res.user.first_name).toBe("ravi89");
      expect(res.user.last_name).toBe("mehrotra89");
      expect(res.user.name).toBe("ravi89 mehrotra89");
      expect(res.user.email).toBe("ravi89@allies.co.in");
      expect(res.user.username).toBe("ravimehrotra89");
      expect(res.user.mobile).toBe("+911234567890");
      expect(res.user.country).toBe("india");
      expect(res.user.sponsorUsername).toBe("ravimehrotra");
      expect(res.user.sponsorName).toBe("ravi mehrotra");
      expect(res.user.address).toBe("The Mall");
      expect(res.user.city).toBe("Kanpur");
      expect(res.user.state).toBe("UP");
      expect(res.user.postal).toBe("208001");
      expect(res.user.enable2FA).toBe(false);
    })
  }));


  it('should Update Profile ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "User update"
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      email: "ravi89@allies.co.in",
      fname: "ravi89",
      lname: "mehrotra89",
      country: "india",
      mobile: "+911111111111",
      address: "xxxxxxxxxxxxxxxxxxxxx",
      city: "Kanpur",
      state: "CXCXCXCXCXCXCX",
      postal: 111111
    };

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.updateProfile(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Update Wallet ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "User BTC Address Update."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      btcaddress: "1A56svALNtXPrXGt3fvwUVQPhnsUGAe1EQ"
    };

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.updateWallet(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Create BTC Address ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "BTC address is already exists."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      btcaddress: "1A56svALNtXPrXGt3fvwUVQPhnsUGAe1OZ"
    };

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.createBtcAddress(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Get BTC Address ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      btcAddress: "1A56svALNtXPrXGt3fvwUVQPhnsUGAe1EQ",
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.btcAddress().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.btcAddress).toBe(mockBody.btcAddress);
    });
  }));


  it('should Get BTC Info ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      btcWallet: {
        btcAddress: "1A56svALNtXPrXGt3fvwUVQPhnsUGAe1EQ",
        btcAmount: 0
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.btcInfo().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.btcWallet.btcAddress).toBe(mockBody.btcWallet.btcAddress);
      expect(res.btcWallet.btcAmount).toBe(mockBody.btcWallet.btcAmount);
    });
  }));


  it('should Get USD Info ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      wallet: {
        amount: 0
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.usdInfo().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.wallet.amount).toBe(mockBody.wallet.amount);
    });
  }));


  it('should Get Campaign List ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      campaigns: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 25
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getCampaignList().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.campaigns.length).toBe(0);
      expect(res.totalRows).toBe(0);
      expect(res.currentPage).toBe(1);
      expect(res.perPage).toBe(25);
    });
  }));


  it('should Get Banner Campaign List ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      banners: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 25
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getBannerCampaigns().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.banners.length).toBe(0);
      expect(res.totalRows).toBe(0);
      expect(res.currentPage).toBe(1);
      expect(res.perPage).toBe(25);
    });
  }));


  it('should Get Banner List ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      bannerLink: [{
        name: "Banner One 125 x 125",
        imageUrl: "",
        description: "",
        width: 125,
        height: 125,
      }]
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getBannerList().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.bannerLink.length).toBe(1);
      expect(res.bannerLink[0].name).toBe("Banner One 125 x 125");
      expect(res.bannerLink[0].imageUrl).toBe("");
      expect(res.bannerLink[0].description).toBe("");
      expect(res.bannerLink[0].width).toBe(125);
      expect(res.bannerLink[0].height).toBe(125);
    });
  }));


  it('should Get Referral Links ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      link: [{
        id: 2,
        name: "Target One",
        url: "",
        description: "",
        default: false
      }]
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getReferralLinks().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.link.length).toBe(1);
      expect(res.link[0].id).toBe(2);
      expect(res.link[0].name).toBe("Target One");
      expect(res.link[0].url).toBe("");
      expect(res.link[0].description).toBe("");
      expect(res.link[0].default).toBe(false);
    });
  }));



  it('should Make Default Referral Link ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Referer link is created"
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      name: "Taget Four",
      viewurl: "http://localhost:8089/target4.html"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.makeDefaultReferral(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));



  it('should Create Campaign ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Campaign created"
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      name: "Campaign Holi 1",
      viewurl: "http://localhost:8089/campaign/target1.html"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.createCampaign(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Create Banner ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      banner: {
        bannerId: "5f9413f0-5d7b-11e7-a9e3-bd160c97ad85",
        campaignId: 3
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      name: "Campaign Holi 1",
      image: "http://localhost:8089/banner/image3.jpg"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.createBanner(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.banner.bannerId).toBe(mockBody.banner.bannerId);
      expect(res.banner.campaignId).toBe(mockBody.banner.campaignId);
    });
  }));


  it('should My Directs ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      directs: [{
        email: "mohd.raza+id109@allies.co.in",
        country: "india",
        mobile: "+919936868137",
        create_at: "2017-06-08T04:57:47.771Z",
        position: "L",
        userid: "5938d94bb625cb0856e3004f",
        name: "ravi109 mehrotra109",
        totalMembers: 6,
        totalPurchasePV: 0
      }]
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getMyDirects(1).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.directs.length).toBe(1);
      expect(res.directs[0].email).toBe(mockBody.directs[0].email);
      expect(res.directs[0].country).toBe(mockBody.directs[0].country);
      expect(res.directs[0].mobile).toBe(mockBody.directs[0].mobile);
      expect(res.directs[0].create_at).toBe(mockBody.directs[0].create_at);
      expect(res.directs[0].position).toBe(mockBody.directs[0].position);
      expect(res.directs[0].userid).toBe(mockBody.directs[0].userid);
      expect(res.directs[0].name).toBe(mockBody.directs[0].name);
      expect(res.directs[0].totalMembers).toBe(mockBody.directs[0].totalMembers);
      expect(res.directs[0].totalPurchasePV).toBe(mockBody.directs[0].totalPurchasePV);
    });
  }));


  it('should Current Rates ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      unit: "BTC",
      currentRates: {
        price_btc: 0.00027,
        price_usd: 0.38688286499999996
      },
      pool: {
        btcRates: 0.00027,
        usdRates: 0.38688286499999996
      },
      machine: {
        btcRates: 0.00027,
        usdRates: 0.38688286499999996
      },
      rack: {
        btcRates: 0.00027,
        usdRates: 0.38688286499999996
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getCurrentRates().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.unit).toBe(mockBody.unit);
      expect(res.currentRates.price_btc).toBe(mockBody.currentRates.price_btc);
      expect(res.currentRates.price_usd).toBe(mockBody.currentRates.price_usd);
      expect(res.pool.btcRates).toBe(mockBody.pool.btcRates);
      expect(res.pool.usdRates).toBe(mockBody.pool.usdRates);
      expect(res.machine.btcRates).toBe(mockBody.machine.btcRates);
      expect(res.machine.usdRates).toBe(mockBody.machine.usdRates);
      expect(res.rack.btcRates).toBe(mockBody.rack.btcRates);
      expect(res.rack.usdRates).toBe(mockBody.rack.usdRates);
    });
  }));


  it('should Purchase Power ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      totalPower: {
        coin: "BTC",
        miningPower: 0
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getPurchasedPower().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.totalPower.coin).toBe(mockBody.totalPower.coin);
      expect(res.totalPower.miningPower).toBe(mockBody.totalPower.miningPower);
    });
  }));


  it('should Total Income ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      totalIncome: {
        coin: "BTC",
        totalUSD: 0,
        totalBTC: 0
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getTotalIncome().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.totalIncome.coin).toBe(mockBody.totalIncome.coin);
      expect(res.totalIncome.totalUSD).toBe(mockBody.totalIncome.totalUSD);
      expect(res.totalIncome.totalBTC).toBe(mockBody.totalIncome.totalBTC);
    });
  }));


  it('should Latest Signups ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      latestSignup: [{
        fname: "ravi1498050713396",
        lname: "mehrotra1498050713396",
        country: "india",
        username: "ravimehrotra1498050713396"
      }]
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getLatestSignups().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.latestSignup.length).toBe(1);
      expect(res.latestSignup[0].fname).toBe(mockBody.latestSignup[0].fname);
      expect(res.latestSignup[0].lname).toBe(mockBody.latestSignup[0].lname);
      expect(res.latestSignup[0].country).toBe(mockBody.latestSignup[0].country);
      expect(res.latestSignup[0].username).toBe(mockBody.latestSignup[0].username);
    });
  }));


  it('should Get Packages ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      package: {
        pool: { name: "Pool", price: 100, precent: 8, power: 3, pv: 1 },
        machine: { name: "Machine", price: 1000, precent: 10, power: 30, pv: 11 },
        rack: { name: "Rack", price: 10000, precent: 12, power: 3000, pv: 110 }
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getPackages().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.package.pool.name).toBe(mockBody.package.pool.name);
      expect(res.package.pool.price).toBe(mockBody.package.pool.price);
      expect(res.package.pool.precent).toBe(mockBody.package.pool.precent);
      expect(res.package.pool.power).toBe(mockBody.package.pool.power);
      expect(res.package.pool.pv).toBe(mockBody.package.pool.pv);

      expect(res.package.machine.name).toBe(mockBody.package.machine.name);
      expect(res.package.machine.price).toBe(mockBody.package.machine.price);
      expect(res.package.machine.precent).toBe(mockBody.package.machine.precent);
      expect(res.package.machine.power).toBe(mockBody.package.machine.power);
      expect(res.package.machine.pv).toBe(mockBody.package.machine.pv);

      expect(res.package.rack.name).toBe(mockBody.package.rack.name);
      expect(res.package.rack.price).toBe(mockBody.package.rack.price);
      expect(res.package.rack.precent).toBe(mockBody.package.rack.precent);
      expect(res.package.rack.power).toBe(mockBody.package.rack.power);
      expect(res.package.rack.pv).toBe(mockBody.package.rack.pv);
    });
  }));


  it('should Get Virtual Tree ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      treeview: {
        username: "ravimehrotra89",
        name: "ravi89 mehrotra89",
        doj: "2017-05-20T06:46:31.614Z",
        sponsor: "590962bb77891b0d4ffe6773",
        itemName: "",
        leftPV: 0,
        rightPV: 0,
        leftCount: 0,
        rightCount: 0,
        totalDirects: 14,
        virtualPair: 0
      }
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getVirtualTree().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.treeview.username).toBe(mockBody.treeview.username);
      expect(res.treeview.name).toBe(mockBody.treeview.name);
      expect(res.treeview.doj).toBe(mockBody.treeview.doj);
      expect(res.treeview.sponsor).toBe(mockBody.treeview.sponsor);
      expect(res.treeview.itemName).toBe(mockBody.treeview.itemName);
      expect(res.treeview.leftPV).toBe(mockBody.treeview.leftPV);
      expect(res.treeview.rightPV).toBe(mockBody.treeview.rightPV);
      expect(res.treeview.leftCount).toBe(mockBody.treeview.leftCount);
      expect(res.treeview.rightCount).toBe(mockBody.treeview.rightCount);
      expect(res.treeview.totalDirects).toBe(mockBody.treeview.totalDirects);
      expect(res.treeview.virtualPair).toBe(mockBody.treeview.virtualPair);
    });
  }));


  it('should Get Purchase Token ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      token: "7bf5afc0-5d82-11e7-a9e3-bd160c97ad85"
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getPurchaseToken().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.token).toBe(mockBody.token);
    });
  }));


  it('should Get Purchase Order ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      purchase: "59562e8a0c2620100947dcf5",
      order: "59562e8b0c2620100947dcf7",
      message: "Puchaser successfully but sponsor not get commission"
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      name: "Machine",
      token: "7bf5afc0-5d82-11e7-a9e3-bd160c97ad85",
      quantity: 1,
      price: 1000
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.processOrder(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.purchase).toBe(mockBody.purchase);
      expect(res.order).toBe(mockBody.order);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Forget Password ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Password reset link has been sent to your email Id. Please check."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      email: "ravi1@allies.co.in"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.forgotPassword(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Reset Password ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Password changed successfully."
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      token: "a416ca40-5d85-11e7-8a4e-bdfbc6907e7d",
      password: "ravissasdf",
      confirmpassword: "ravissasdf"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.resetPassword(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));



  it('should Reset Password ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Change Password"
    };
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postData = {
      oldpassword: "ravissasdf",
      password: "a416ca40",
      confirmpassword: "a416ca40"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.changePassword(postData).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  // it('should Visit Banner ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   const mockBody     = {
  //     hasError: false,
  //     message: "success"
  //   };
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
  //   const postData = {
  //     id: "92ca1d80-3091-11e7-892a-45ea7e5cc9c4",
  //     username: "ravimehrotra5"
  //   }

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.visitBanner(postData).subscribe(res => {
  //     expect(res.hasError).toBe(false);
  //     expect(res.message).toBe(mockBody.message);
  //   });
  // }));


  it('should Country Info ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {hasError: false}
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getCountryInfo().subscribe(res => {
      expect(res.hasError).toBe(false);
    });
  }));


  it('should Country Flags ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {hasError: false}
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.countryFlag().subscribe(res => {
      expect(res.hasError).toBe(false);
    });
  }));


  it('should Campaign Reports ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      campaigns: [{
        id: 1,
        name: "Campaign Title",
        totalview: 0,
        totalsignup: 0
      }]
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.campaignReports(1).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.campaigns.length).toBe(1);
      expect(res.campaigns[0].id).toBe(mockBody.campaigns[0].id);
      expect(res.campaigns[0].name).toBe(mockBody.campaigns[0].name);
      expect(res.campaigns[0].totalview).toBe(mockBody.campaigns[0].totalview);
      expect(res.campaigns[0].totalsignup).toBe(mockBody.campaigns[0].totalsignup);
    });
  }));


  it('should Banner Reports ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      campaigns: [{
        id: 1,
        name: "target 83",
        totalview: 0,
        totalsignup: 0
      },
      {
        id: 2,
        name: "Banner Create One",
        totalview: 0,
        totalsignup: 0
      }]
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.bannerReports(1).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.campaigns.length).toBe(2);
      expect(res.campaigns[0].id).toBe(mockBody.campaigns[0].id);
      expect(res.campaigns[0].name).toBe(mockBody.campaigns[0].name);
      expect(res.campaigns[0].totalview).toBe(mockBody.campaigns[0].totalview);
      expect(res.campaigns[0].totalsignup).toBe(mockBody.campaigns[0].totalsignup);
      expect(res.campaigns[1].id).toBe(mockBody.campaigns[1].id);
      expect(res.campaigns[1].name).toBe(mockBody.campaigns[1].name);
      expect(res.campaigns[1].totalview).toBe(mockBody.campaigns[1].totalview);
      expect(res.campaigns[1].totalsignup).toBe(mockBody.campaigns[1].totalsignup);
    });
  }));


  it('should My Team ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      users: [{
        level: 1,
        sponsor: "ravimehrotra",
        country: "india",
        joinat: "2017-06-09T07:17:45.184Z",
        name: "ravi109 mehrotra109",
        username: "ravimehrotra109"
      }]
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.myTeam(1).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.users.length).toBe(1);
      expect(res.users[0].level).toBe(mockBody.users[0].level);
      expect(res.users[0].sponsor).toBe(mockBody.users[0].sponsor);
      expect(res.users[0].country).toBe(mockBody.users[0].country);
      expect(res.users[0].joinat).toBe(mockBody.users[0].joinat);
      expect(res.users[0].name).toBe(mockBody.users[0].name);
      expect(res.users[0].username).toBe(mockBody.users[0].username);
    });
  }));


  it('should My Network ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      users: [{},{},{},{},{},{}]
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.myNetwork('ravimehrotra').subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.users.length).toBe(6);
    });
  }));


  it('should Get Affiliation Token ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      token: "442b4320-5d8c-11e7-8a4e-bdfbc6907e7d"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getAffiliateToken().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.token).toBe(mockBody.token);
    });
  }));


  it('should Pay Affiliation Fees ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      affiliates: {
        invoiceNumber: 2017063000036,
        name: "ravi89 mehrotra89",
        email: "ravi89@allies.co.in",
        fee: 1,
        status: "PENDING",
        paid: 101,
        description: "Affiliate Fee",
        created_at: "2017-06-30T12:07:11.731Z",
        btc_address: "1Lm2BMbBZYJ6QLFSg68gUcBF3ieWdLnAwr"
      },
      message: "Affiliate save successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      amount: 100,
      paymethod: "bitcoin",
      token: "442b4320-5d8c-11e7-8a4e-bdfbc6907e7d"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.payAffiliateFees(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
      expect(res.affiliates.invoiceNumber).toBe(mockBody.affiliates.invoiceNumber);
      expect(res.affiliates.name).toBe(mockBody.affiliates.name);
      expect(res.affiliates.email).toBe(mockBody.affiliates.email);
      expect(res.affiliates.fee).toBe(mockBody.affiliates.fee);
      expect(res.affiliates.status).toBe(mockBody.affiliates.status);
      expect(res.affiliates.paid).toBe(mockBody.affiliates.paid);
      expect(res.affiliates.description).toBe(mockBody.affiliates.description);
      expect(res.affiliates.created_at).toBe(mockBody.affiliates.created_at);
      expect(res.affiliates.btc_address).toBe(mockBody.affiliates.btc_address);
    });
  }));


  it('should Affiliation Status ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      affiliates: {
        status: "PENDING",
        startDate: "-",
        endDate: "-",
        active: "N",
        amount: 100,
        invoiceNo: 2017063000036
      },
      message: "Affiliate save successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.affiliateStatus().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.affiliates.status).toBe(mockBody.affiliates.status);
      expect(res.affiliates.startDate).toBe(mockBody.affiliates.startDate);
      expect(res.affiliates.endDate).toBe(mockBody.affiliates.endDate);
      expect(res.affiliates.active).toBe(mockBody.affiliates.active);
      expect(res.affiliates.amount).toBe(mockBody.affiliates.amount);
      expect(res.affiliates.invoiceNo).toBe(mockBody.affiliates.invoiceNo);
    });
  }));


  it('should Sponsor Info ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      sponsor: {
        username: "ravimehrotra49",
        name: "ravi49 mehrotra49"
      }
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      sponsor: "ravimehrotra49"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.sponsorInfo(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.sponsor.username).toBe(mockBody.sponsor.username);
      expect(res.sponsor.name).toBe(mockBody.sponsor.name);
    });
  }));


  it('should Verify Email ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Email Verified"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      verify_token: "0448c750-4c07-11e7-98b5-732def4376e5"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.verifyEmail(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Send Email ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Message is created successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      subject: "Welcome",
      message: "Welcome to Our Site.",
      sent_to: [
        "5909638377891b0d4ffe677f",
        "5909630e77891b0d4ffe6779"
      ]
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.sendMail(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Tree Placement ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      position: "BOTH"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getTreePlacement().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.position).toBe(mockBody.position);
    });
  }));


  it('should Change Tree Placement ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Position is save successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      position: "BOTH"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.changeTreePlacement(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Inbox Message ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      messages: [{
        id: "59492560cf6faa4c84bdfc61",
        subject: "Hello From Sponsor",
        message: "<p>Hello,</p><p><br></p><p>How R U?</p><p>I am Your Sponsor??</p><p><br></p><p>Thanks</p>",
        fromUserName: "ravi mehrotra",
        formUserEmail: "ravi@allies.co.in",
        createdAt: "2017-06-20T13:38:40.650Z"
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.inboxMessage(1).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.messages.length).toBe(1);
      expect(res.messages[0].id).toBe(mockBody.messages[0].id);
      expect(res.messages[0].subject).toBe(mockBody.messages[0].subject);
      expect(res.messages[0].message).toBe(mockBody.messages[0].message);
      expect(res.messages[0].fromUserName).toBe(mockBody.messages[0].fromUserName);
      expect(res.messages[0].formUserEmail).toBe(mockBody.messages[0].formUserEmail);
      expect(res.messages[0].createdAt).toBe(mockBody.messages[0].createdAt);
      expect(res.totalRows).toBe(1);
      expect(res.currentPage).toBe(1);
      expect(res.perPage).toBe(25);
    });
  }));


  it('should Outbox Message ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      messages: [{
        id: "59564593d3b86725a88a6cfe",
        subject: "Welcome",
        message: "Welcome to Our Site.",
        toUserName: "ravi4 mehrotra4,ravi2 mehrotra2",
        toUserEmail: "ravi4@allies.co.in,ravi2@allies.co.in",
        createdAt: "2017-06-30T12:35:31.674Z",
        showMore: false
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.outboxMessage(1).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.messages.length).toBe(1);
      expect(res.messages[0].id).toBe(mockBody.messages[0].id);
      expect(res.messages[0].subject).toBe(mockBody.messages[0].subject);
      expect(res.messages[0].message).toBe(mockBody.messages[0].message);
      expect(res.messages[0].toUserName).toBe(mockBody.messages[0].toUserName);
      expect(res.messages[0].toUserEmail).toBe(mockBody.messages[0].toUserEmail);
      expect(res.messages[0].createdAt).toBe(mockBody.messages[0].createdAt);
      expect(res.messages[0].showMore).toBe(mockBody.messages[0].showMore);
      expect(res.totalRows).toBe(1);
      expect(res.currentPage).toBe(1);
      expect(res.perPage).toBe(25);
    });
  }));


  it('should Invoice Update ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Invoice updated successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      invoiceId: 2017051700012,
      hash: "2310406bdc689d2d16b302978706816a5db156d207b9084ec03b6b194c730908"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.invoiceUpdate(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Manage OTP ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      twoFactor: {
        key: "c76bd120879d5704c04aad0cd287dbb58789f6590488b1d548186049003ee4c5bc774ee3eb1138d645f9f56fbad801c8",
        qrCode: "https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/ravimehrotra89%3A591fe64746abf912e28581b5%3Fsecret=JGCFXCGTIE335P3KZNCXC25TPSPAHCQE",
        code: "GOOGLE"
      }
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      verifyBy: 'GOOGLE'
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.manageOTP(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.twoFactor.key).toBe(mockBody.twoFactor.key);
      expect(res.twoFactor.qrCode).toBe(mockBody.twoFactor.qrCode);
      expect(res.twoFactor.code).toBe(mockBody.twoFactor.code);
    });
  }));


  it('should Verify 2FA ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Two factor enable successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      key: "8d4769bbc2637473cd03e33dcff08a4d1767ebb8f2ab4b33bdbc11e66b89e37c77a66a2f7e1dc9a457bf02d2d91c61e3",
      token: "538973",
      verifyBy: "GOOGLE"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.verify2FA(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should OTP Login ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      token: "47d86619024dcb99a4ca8e31e8d84300a3b175a136b62bf2ff4a72db52f44724",
      exipresIn: 3600
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      key: "5922bf60b10a032cc7159493",
      token_key: "975e4e1ee5e807a0c9005661264038ecc34bb96a754efd8744e44cad6e2d179e0e9a8d83a2a548ef7501cacae0c9d1db",
      token: "538973",
      verifyBy: "GOOGLE"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.otpLogin(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.token).toBe(mockBody.token);
      expect(res.exipresIn).toBe(mockBody.exipresIn);
    });
  }));


  it('should Forget OTP ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Please check your mail to recover your 'Two Factor Authentication'"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      key: "5922bf60b10a032cc7159493",
      token_key: "975e4e1ee5e807a0c9005661264038ecc34bb96a754efd8744e44cad6e2d179e0e9a8d83a2a548ef7501cacae0c9d1db",
      verifyBy: "GOOGLE"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.forgetOTP(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Send Disable OTP ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Message sent."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.sendDisableOTP().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Disable OTP ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Two factor authentication is disabled"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      token: 412390
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.disableOTP(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should LeaderBoard ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      last7days: [],
      last30Days: [],
      allUsers: []
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      token: 412390
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.leaderboard().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.last7days.length).toBe(0);
      expect(res.last30Days.length).toBe(0);
      expect(res.allUsers.length).toBe(0);
    });
  }));


  it('should Withdrawal Token ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      token: "34360460-5e1c-11e7-a633-23c7b4566231"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getWithdrawalToken().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.token).toBe(mockBody.token);
    });
  }));


  it('should Withdrawal ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Transaction is successfully completed. Please wait while your transaction will take effect."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      amount: 0.0006,
      token: "4a5fd610-4c0d-11e7-a5b8-6fcf4e12673c",
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.withdrawal(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Transfer Token ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      token: "34360460-5e1c-11e7-a633-23c7b4566231"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getTransferToken().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.token).toBe(mockBody.token);
    });
  }));


  it('should Transfer ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Transfer saved successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      amount: 0.0006,
      userid: 'ravimehrotra1',
      token: "4a5fd610-4c0d-11e7-a5b8-6fcf4e12673c",
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.transferAmount(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Transactions ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      transactions: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.transactions(1).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.transactions.length).toBe(0);
      expect(res.totalRows).toBe(0);
      expect(res.currentPage).toBe(1);
      expect(res.perPage).toBe(25);
    });
  }));


  it('should Admin Settings ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Setting is saved successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      cutOffValue: '20',
      affiliationFee: '1',
      affiliationAmount: '100',
      withdrawalFee: '0.002',
      transferFee: '0.0001',
      withdrawalAutoLimit: '0.005',
      withdrawalMinLimit: '0.0001',
      withdrawalMaxLimit: '0.05',
      transferPerUserDayLimit: '0.05',
      mailChimpKey: '49ea4b6f96bba025f779fbfad158ab9b-us15',
      mailChimpList: 'd855828ba1',
      mailChimpEmail: 'bb@gmail.com',
      mailChimpFromName: 'no reply'
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.adminSettings(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Admin Get Settings ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      settings: {
        cutOffValue: 20, affiliationFee: 1,
        affiliationAmount: 100, withdrawalFee: 0.002,
        withdrawalAutoLimit: 0.005, withdrawalMinLimit: 0.0001,
        withdrawalMaxLimit: 0.05, transferFee: 0.0001,
        transferPerUserDayLimit: 0.05, mailChimpKey: "sadf23423dsg234232rdsr2432-us15",
        mailChimpList: "sf2323dsaf", mailChimpEmail: "xxxxvsdfsm@gmail.com",
        mailChimpFromName: "no reply"
      }
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getSettings().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.settings.cutOffValue).toBe(mockBody.settings.cutOffValue);
      expect(res.settings.affiliationFee).toBe(mockBody.settings.affiliationFee);
      expect(res.settings.affiliationAmount).toBe(mockBody.settings.affiliationAmount);
      expect(res.settings.withdrawalAutoLimit).toBe(mockBody.settings.withdrawalAutoLimit);
      expect(res.settings.withdrawalMinLimit).toBe(mockBody.settings.withdrawalMinLimit);
      expect(res.settings.withdrawalMaxLimit).toBe(mockBody.settings.withdrawalMaxLimit);
      expect(res.settings.transferFee).toBe(mockBody.settings.transferFee);
      expect(res.settings.transferPerUserDayLimit).toBe(mockBody.settings.transferPerUserDayLimit);
      expect(res.settings.mailChimpKey).toBe(mockBody.settings.mailChimpKey);
      expect(res.settings.mailChimpList).toBe(mockBody.settings.mailChimpList);
      expect(res.settings.mailChimpEmail).toBe(mockBody.settings.mailChimpEmail);
      expect(res.settings.mailChimpFromName).toBe(mockBody.settings.mailChimpFromName);
    });
  }));


  it('should Admin Banner ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      banner: {
        bannerId: "sdf1l312-12312-435345-sdadasfasfsd",
        campaignId: 25
      }
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      name: "Banner 265 x 500",
      image: "http://192.1681.1.111:8089/image1.jpg",
      width: 265,
      height: 500
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.addBanner(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.banner.bannerId).toBe(mockBody.banner.bannerId);
      expect(res.banner.campaignId).toBe(mockBody.banner.campaignId);
    });
  }));


  it('should Update Admin Banner ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Banners is updated successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      name: "Banner 1 265 x 500",
      image: "http://192.1681.1.111:8089/image1.jpg",
      width: 265,
      height: 500
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.updateBanner(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Admin Get Banner ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      banners: [{
        _id: "595621f40c2620100947dcf3",
        name: "Banner Added 1",
        image: "http://localhost:8089/banner/image3.jpg",
        userid: "591fe64746abf912e28581b5",
        hashid: 3,
        hashstr: "5f9413f0-5d7b-11e7-a9e3-bd160c97ad85",
        created_at: "2017-06-30T10:03:32.400Z",
        markdeleted: 0
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.banners(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.banners.length).toBe(1);
      expect(res.banners[0]._id).toBe(mockBody.banners[0]._id);
      expect(res.banners[0].name).toBe(mockBody.banners[0].name);
      expect(res.banners[0].image).toBe(mockBody.banners[0].image);
      expect(res.banners[0].userid).toBe(mockBody.banners[0].userid);
      expect(res.banners[0].hashid).toBe(mockBody.banners[0].hashid);
      expect(res.banners[0].hashstr).toBe(mockBody.banners[0].hashstr);
      expect(res.banners[0].created_at).toBe(mockBody.banners[0].created_at);
      expect(res.banners[0].markdeleted).toBe(mockBody.banners[0].markdeleted);
      expect(res.totalRows).toBe(1);
      expect(res.currentPage).toBe(1);
      expect(res.perPage).toBe(25);
    });
  }));


  it('should Admin Campaign ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Campaign created"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      name: "campaign 1",
      viewurl: "http://192.1681.1.111:8089/campaign/target1.html",
      description: "Campaign One"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.addCampaign(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Admin Get Campaign ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      campaigns: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.campaigns(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.campaigns.length).toBe(0);
      expect(res.totalRows).toBe(0);
      expect(res.currentPage).toBe(1);
      expect(res.perPage).toBe(25);
    });
  }));


  it('should Admin Update Campaign ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Campaign is updated successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      name: "campaign one",
      viewurl: "http://192.1681.1.111:8089/campaign/target1.html",
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.updateCampaign(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Admin Get Withdrawal ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      withdrawals: [{
        _id: "592276f03955660dd61bfb63",
        amount_withdrawal: 0.0005,
        amount_fee: 0.001,
        amount: 0.0015,
        status: "PENDING",
        user_name: "ravi mehrotra",
        auto_withdraw: true,
        btc_address: "3J3YG4vp8g1v4NTTEeCX6H51AR1G26cc4k",
        userid: "590962bb77891b0d4ffe6773",
        created_at: "2017-05-22T05:28:16.668Z",
        timestamp: 1498889514802
      }],
      totalRows: 3,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getWithdrawals(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.totalRows).toBe(mockBody.totalRows);
      expect(res.currentPage).toBe(mockBody.currentPage);
      expect(res.perPage).toBe(mockBody.perPage);
      expect(res.withdrawals.length).toBe(1);
      expect(res.withdrawals[0]._id).toBe(mockBody.withdrawals[0]._id);
      expect(res.withdrawals[0].amount_withdrawal).toBe(mockBody.withdrawals[0].amount_withdrawal);
      expect(res.withdrawals[0].amount_fee).toBe(mockBody.withdrawals[0].amount_fee);
      expect(res.withdrawals[0].amount).toBe(mockBody.withdrawals[0].amount);
      expect(res.withdrawals[0].status).toBe(mockBody.withdrawals[0].status);
      expect(res.withdrawals[0].user_name).toBe(mockBody.withdrawals[0].user_name);
      expect(res.withdrawals[0].auto_withdraw).toBe(mockBody.withdrawals[0].auto_withdraw);
      expect(res.withdrawals[0].btc_address).toBe(mockBody.withdrawals[0].btc_address);
      expect(res.withdrawals[0].userid).toBe(mockBody.withdrawals[0].userid);
      expect(res.withdrawals[0].created_at).toBe(mockBody.withdrawals[0].created_at);
      expect(res.withdrawals[0].timestamp).toBe(mockBody.withdrawals[0].timestamp);
    });
  }));



  it('should Admin Get Transfer ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      transfers: [{
        created_at: "2017-05-20T12:55:25.118Z",
        amount_transfer: 0.0005,
        amount_fee: 0.01,
        amount: 0.0105,
        status: "COMPLETED",
        to_username: "ravimehrotra1",
        to_name: "ravi1 mehrotra1",
        from_username: "ravimehrotra",
        from_name: "ravi mehrotra"
      }],
      totalRows: 3,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getTransfers(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.totalRows).toBe(mockBody.totalRows);
      expect(res.currentPage).toBe(mockBody.currentPage);
      expect(res.perPage).toBe(mockBody.perPage);
      expect(res.transfers.length).toBe(1);
      expect(res.transfers[0].created_at).toBe(mockBody.transfers[0].created_at);
      expect(res.transfers[0].amount_transfer).toBe(mockBody.transfers[0].amount_transfer);
      expect(res.transfers[0].amount_fee).toBe(mockBody.transfers[0].amount_fee);
      expect(res.transfers[0].amount).toBe(mockBody.transfers[0].amount);
      expect(res.transfers[0].status).toBe(mockBody.transfers[0].status);
      expect(res.transfers[0].to_username).toBe(mockBody.transfers[0].to_username);
      expect(res.transfers[0].to_name).toBe(mockBody.transfers[0].to_name);
      expect(res.transfers[0].from_username).toBe(mockBody.transfers[0].from_username);
      expect(res.transfers[0].from_name).toBe(mockBody.transfers[0].from_name);
    });
  }));


  // it('should Admin Get Affiliation Fee ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
  //   const mockBody     = {
  //     hasError: false,
  //     affiliations: [{
  //       _id: "594a709c45d4033621eec0d9",
  //       userid: "594a709845d4033621eec0cc",
  //       user_name: "ravi1498050712303 mehrotra1498050712303",
  //       user_email: "ravi1498050712303@allies.co.in",
  //       fee: 1,
  //       paid: 101,
  //       pay_through: "bitcoin",
  //       currency: "USD",
  //       verified: false,
  //       from_btc_address: "1NzU61aW2cZmFXTjiC5iT34QVrJfSPZhv8",
  //       invoice_year: "2017",
  //       invoice_no: 2017062100035,
  //       invoice_status: "COMPLETED",
  //       status: "COMPLETED",
  //       active: "Y",
  //       description: "Affiliate Fee",
  //       verifyHash: "sadfasdfasjdlfasjdflasdjflsf",
  //       end_date: "2018-06-21T13:11:57.463Z",
  //       start_date: "2017-06-21T13:11:57.463Z",
  //       updated_at: "2017-06-21T13:11:56.926Z",
  //       created_at: "2017-06-21T13:11:56.926Z"
  //     }],
  //     totalRows: 3,
  //     currentPage: 1,
  //     perPage: 25
  //   }
  //   const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
  //   const postBody = {}

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(mockResponse));
  //   });

  //   service.getAffiliationFee(postBody).subscribe(res => {
  //     expect(res.hasError).toBe(false);
  //     expect(res.totalRows).toBe(mockBody.totalRows);
  //     expect(res.currentPage).toBe(mockBody.currentPage);
  //     expect(res.perPage).toBe(mockBody.perPage);
  //     expect(res.affiliations.length).toBe(1);
  //     expect(res.affiliations[0]._id).toBe(mockBody.affiliations[0]._id);
  //     expect(res.affiliations[0].userid).toBe(mockBody.affiliations[0].userid);
  //     expect(res.affiliations[0].user_name).toBe(mockBody.affiliations[0].user_name);
  //     expect(res.affiliations[0].user_email).toBe(mockBody.affiliations[0].user_email);
  //     expect(res.affiliations[0].fee).toBe(mockBody.affiliations[0].fee);
  //     expect(res.affiliations[0].paid).toBe(mockBody.affiliations[0].paid);
  //     expect(res.affiliations[0].pay_through).toBe(mockBody.affiliations[0].pay_through);
  //     expect(res.affiliations[0].currency).toBe(mockBody.affiliations[0].currency);
  //     expect(res.affiliations[0].verified).toBe(mockBody.affiliations[0].verified);
  //     expect(res.affiliations[0].from_btc_address).toBe(mockBody.affiliations[0].from_btc_address);
  //     expect(res.affiliations[0].invoice_year).toBe(mockBody.affiliations[0].invoice_year);
  //     expect(res.affiliations[0].invoice_no).toBe(mockBody.affiliations[0].invoice_no);
  //     expect(res.affiliations[0].invoice_status).toBe(mockBody.affiliations[0].invoice_status);
  //     expect(res.affiliations[0].status).toBe(mockBody.affiliations[0].status);
  //     expect(res.affiliations[0].active).toBe(mockBody.affiliations[0].active);
  //     expect(res.affiliations[0].description).toBe(mockBody.affiliations[0].description);
  //     expect(res.affiliations[0].verifyHash).toBe(mockBody.affiliations[0].verifyHash);
  //     expect(res.affiliations[0].end_date).toBe(mockBody.affiliations[0].end_date);
  //     expect(res.affiliations[0].start_date).toBe(mockBody.affiliations[0].start_date);
  //     expect(res.affiliations[0].updated_at).toBe(mockBody.affiliations[0].updated_at);
  //     expect(res.affiliations[0].created_at).toBe(mockBody.affiliations[0].created_at);
  //   });
  // }));


  it('should Admin Get Withdrawal Fee ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      withdrawals: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getWithdrawalFee(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.totalRows).toBe(mockBody.totalRows);
      expect(res.currentPage).toBe(mockBody.currentPage);
      expect(res.perPage).toBe(mockBody.perPage);
      expect(res.withdrawals.length).toBe(0);
    });
  }));


  it('should Admin Get Transfer Fee ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      transfers: [{
        created_at: "2017-05-20T12:55:25.118Z",
        amount_transfer: 0.0005,
        amount_fee: 0.01,
        amount: 0.0105,
        status: "COMPLETED",
        to_username: "ravimehrotra1",
        to_name: "ravi1 mehrotra1",
        from_username: "ravimehrotra",
        from_name: "ravi mehrotra"
      }],
      totalRows: 0,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getTransferFee(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.totalRows).toBe(mockBody.totalRows);
      expect(res.currentPage).toBe(mockBody.currentPage);
      expect(res.perPage).toBe(mockBody.perPage);
      expect(res.transfers.length).toBe(1);
      expect(res.transfers[0].created_at).toBe(mockBody.transfers[0].created_at);
      expect(res.transfers[0].amount_transfer).toBe(mockBody.transfers[0].amount_transfer);
      expect(res.transfers[0].amount_fee).toBe(mockBody.transfers[0].amount_fee);
      expect(res.transfers[0].amount).toBe(mockBody.transfers[0].amount);
      expect(res.transfers[0].status).toBe(mockBody.transfers[0].status);
      expect(res.transfers[0].to_username).toBe(mockBody.transfers[0].to_username);
      expect(res.transfers[0].to_name).toBe(mockBody.transfers[0].to_name);
      expect(res.transfers[0].from_username).toBe(mockBody.transfers[0].from_username);
      expect(res.transfers[0].from_name).toBe(mockBody.transfers[0].from_name);
    });
  }));


  it('should Admin Get Config Current Rates ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      rates: {
        rack: { price: 10000, precent: 12, power: 3000, pv: 110, persons: 1, machine: 5, powerCost: 0.05, profitCost: 1 },
        machine: { price: 1000, precent: 10, power: 30, pv: 11, persons: 1, machine: 1, powerCost: 0.01,   profitCost: 0.2 },
        pool: { price: 100, precent: 8, power: 3, pv: 1, persons: 10, machine: 1, powerCost: 0.001, profitCost: 0.02 }
      }
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getConfigCurrentRates().subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.rates.rack.price).toBe(mockBody.rates.rack.price);
      expect(res.rates.rack.precent).toBe(mockBody.rates.rack.precent);
      expect(res.rates.rack.power).toBe(mockBody.rates.rack.power);
      expect(res.rates.rack.pv).toBe(mockBody.rates.rack.pv);
      expect(res.rates.rack.persons).toBe(mockBody.rates.rack.persons);
      expect(res.rates.rack.machine).toBe(mockBody.rates.rack.machine);
      expect(res.rates.rack.powerCost).toBe(mockBody.rates.rack.powerCost);
      expect(res.rates.rack.profitCost).toBe(mockBody.rates.rack.profitCost);
      expect(res.rates.machine.price).toBe(mockBody.rates.machine.price);
      expect(res.rates.machine.precent).toBe(mockBody.rates.machine.precent);
      expect(res.rates.machine.power).toBe(mockBody.rates.machine.power);
      expect(res.rates.machine.pv).toBe(mockBody.rates.machine.pv);
      expect(res.rates.machine.persons).toBe(mockBody.rates.machine.persons);
      expect(res.rates.machine.machine).toBe(mockBody.rates.machine.machine);
      expect(res.rates.machine.powerCost).toBe(mockBody.rates.machine.powerCost);
      expect(res.rates.machine.profitCost).toBe(mockBody.rates.machine.profitCost);
      expect(res.rates.pool.price).toBe(mockBody.rates.pool.price);
      expect(res.rates.pool.precent).toBe(mockBody.rates.pool.precent);
      expect(res.rates.pool.power).toBe(mockBody.rates.pool.power);
      expect(res.rates.pool.pv).toBe(mockBody.rates.pool.pv);
      expect(res.rates.pool.persons).toBe(mockBody.rates.pool.persons);
      expect(res.rates.pool.machine).toBe(mockBody.rates.pool.machine);
      expect(res.rates.pool.powerCost).toBe(mockBody.rates.pool.powerCost);
      expect(res.rates.pool.profitCost).toBe(mockBody.rates.pool.profitCost);
    });
  }));


  it('should Admin Config Current Rates ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Rates saved successfully."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      poolPrice: '100',
      poolPercent: '8',
      poolPower: '3',
      poolPv: '1',
      poolPerson: '10',
      poolMachine: '1',
      poolPowerCost: '0.001',
      poolProfitCost: '0.02',
      machinePrice: '1000',
      machinePercent: '10',
      machinePower: '30',
      machinePv: '11',
      machinePerson: '1',
      machineMachine: '1',
      machinePowerCost: '0.01',
      machineProfitCost: '0.2',
      rackPrice: '10000',
      rackPercent: '12',
      rackPower: '100',
      rackPv: '110',
      rackPerson: '1',
      rackMachine: '5',
      rackPowerCost: '0.05',
      rackProfitCost: '1'
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.postConfigCurrentRates(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Admin User List ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      users: [{
        _id: "594a709945d4033621eec0d4",
        hashpass: "36bd845599f74a5cf8dcee0cc16cd780",
        fname: "ravi1498050713396",
        lname: "mehrotra1498050713396",
        email: "ravi1498050713396@allies.co.in",
        mobile: "+911234567890",
        sponsorid: "590962098293f70fcba92f8c",
        ip: "127.0.0.1",
        country: "india",
        username: "ravimehrotra1498050713396",
        sponsorname: "hash farm",
        sponsorusername: "bb",
        updated_at: "2017-06-21T13:11:53.403Z",
        unix_date: 1498050713403,
        verify_email: false,
        role: [
          "user",
          "transaction"
        ],
        created_at: "2017-06-21T13:11:53.403Z"
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getUsersList(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.users.length).toBe(1);
      expect(res.users[0]._id).toBe(mockBody.users[0]._id);
      expect(res.users[0].hashpass).toBe(mockBody.users[0].hashpass);
      expect(res.users[0].fname).toBe(mockBody.users[0].fname);
      expect(res.users[0].lname).toBe(mockBody.users[0].lname);
      expect(res.users[0].email).toBe(mockBody.users[0].email);
      expect(res.users[0].mobile).toBe(mockBody.users[0].mobile);
      expect(res.users[0].sponsorid).toBe(mockBody.users[0].sponsorid);
      expect(res.users[0].ip).toBe(mockBody.users[0].ip);
      expect(res.users[0].country).toBe(mockBody.users[0].country);
      expect(res.users[0].username).toBe(mockBody.users[0].username);
      expect(res.users[0].sponsorname).toBe(mockBody.users[0].sponsorname);
      expect(res.users[0].sponsorusername).toBe(mockBody.users[0].sponsorusername);
      expect(res.users[0].updated_at).toBe(mockBody.users[0].updated_at);
      expect(res.users[0].unix_date).toBe(mockBody.users[0].unix_date);
      expect(res.users[0].verify_email).toBe(mockBody.users[0].verify_email);
      expect(res.users[0].created_at).toBe(mockBody.users[0].created_at);
      expect(res.totalRows).toBe(mockBody.totalRows);
      expect(res.currentPage).toBe(mockBody.currentPage);
      expect(res.perPage).toBe(mockBody.perPage);
    });
  }));


  it('should Admin Update User ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "User update successfully"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      user_id: "594a709945d4033621eec0d4",
      password: "ravi12313",
      fname: "ravi1498050713396",
      lname: "mehrotra1498050713396",
      email: "ravi1498050713396@allies.co.in",
      mobile: "+911234567890",
      country: "india",
      state: "",
      postal: "",
      city: "",
      address: "",
      username: "ravimehrotra1498050713396"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.updateUser(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));



  it('should Admin Block User ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Updated user"
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      user_id: "594a709945d4033621eec0d4",
      block_user: 'Y'
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.blockUser(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));


  it('should Get Affilates List ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      affiliations: [{
        _id: "594a709c45d4033621eec0d9",
        userid: "594a709845d4033621eec0cc",
        user_name: "ravi1498050712303 mehrotra1498050712303",
        user_email: "ravi1498050712303@allies.co.in",
        fee: 1,
        paid: 101,
        pay_through: "bitcoin",
        currency: "USD",
        verified: false,
        from_btc_address: "1NzU61aW2cZmFXTjiC5iT34QVrJfSPZhv8",
        invoice_year: "2017",
        invoice_no: 2017062100035,
        invoice_status: "COMPLETED",
        status: "COMPLETED",
        active: "Y",
        description: "Affiliate Fee",
        verifyHash: "sadfasdfasjdlfasjdflasdjflsf",
        end_date: "2018-06-21T13:11:57.463Z",
        start_date: "2017-06-21T13:11:57.463Z",
        updated_at: "2017-06-21T13:11:56.926Z",
        created_at: "2017-06-21T13:11:56.926Z"
      }],
      totalRows: 3,
      currentPage: 1,
      perPage: 25
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {}

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.getAffiliates(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.totalRows).toBe(mockBody.totalRows);
      expect(res.currentPage).toBe(mockBody.currentPage);
      expect(res.perPage).toBe(mockBody.perPage);
      expect(res.affiliations.length).toBe(1);
      expect(res.affiliations[0]._id).toBe(mockBody.affiliations[0]._id);
      expect(res.affiliations[0].userid).toBe(mockBody.affiliations[0].userid);
      expect(res.affiliations[0].user_name).toBe(mockBody.affiliations[0].user_name);
      expect(res.affiliations[0].user_email).toBe(mockBody.affiliations[0].user_email);
      expect(res.affiliations[0].fee).toBe(mockBody.affiliations[0].fee);
      expect(res.affiliations[0].paid).toBe(mockBody.affiliations[0].paid);
      expect(res.affiliations[0].pay_through).toBe(mockBody.affiliations[0].pay_through);
      expect(res.affiliations[0].currency).toBe(mockBody.affiliations[0].currency);
      expect(res.affiliations[0].verified).toBe(mockBody.affiliations[0].verified);
      expect(res.affiliations[0].from_btc_address).toBe(mockBody.affiliations[0].from_btc_address);
      expect(res.affiliations[0].invoice_year).toBe(mockBody.affiliations[0].invoice_year);
      expect(res.affiliations[0].invoice_no).toBe(mockBody.affiliations[0].invoice_no);
      expect(res.affiliations[0].invoice_status).toBe(mockBody.affiliations[0].invoice_status);
      expect(res.affiliations[0].status).toBe(mockBody.affiliations[0].status);
      expect(res.affiliations[0].active).toBe(mockBody.affiliations[0].active);
      expect(res.affiliations[0].description).toBe(mockBody.affiliations[0].description);
      expect(res.affiliations[0].verifyHash).toBe(mockBody.affiliations[0].verifyHash);
      expect(res.affiliations[0].end_date).toBe(mockBody.affiliations[0].end_date);
      expect(res.affiliations[0].start_date).toBe(mockBody.affiliations[0].start_date);
      expect(res.affiliations[0].updated_at).toBe(mockBody.affiliations[0].updated_at);
      expect(res.affiliations[0].created_at).toBe(mockBody.affiliations[0].created_at);
    });
  }));


  it('should Get Affilates List ...', inject([BBService, XHRBackend], (service: BBService, mockBackend) => {
    const mockBody     = {
      hasError: false,
      message: "Affiliates updated."
    }
    const mockResponse = new ResponseOptions({body: JSON.stringify(mockBody)});
    const postBody = {
      id: "123uasfasdflasfj231313sd",
      status: "HOLD"
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(mockResponse));
    });

    service.updateAffiliateStatus(postBody).subscribe(res => {
      expect(res.hasError).toBe(false);
      expect(res.message).toBe(mockBody.message);
    });
  }));
});
