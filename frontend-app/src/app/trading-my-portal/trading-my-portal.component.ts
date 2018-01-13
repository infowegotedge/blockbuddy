import { Component, OnInit } from '@angular/core';
import { BBService } from '../bb.service';

@Component({
  selector: 'app-trading-my-portal',
  templateUrl: './trading-my-portal.component.html',
  styleUrls: ['./trading-my-portal.component.css']
})
export class TradingMyPortalComponent implements OnInit {

  companies: any = [];
  showExtraField: boolean;
  showGraphs: boolean;

  constructor(private bbService: BBService) { }

  getCompanies() {
    this.bbService.getCompanies()
    .subscribe((res) => {
      this.companies = res.data || [];
      this.showGraphs = true;
    });
  }

  ngOnInit() {
    this.showGraphs = false;
    this.showExtraField = true;
    this.getCompanies();
  }
}
