import { Component, OnInit, OnDestroy } from '@angular/core';
import { BBService } from '../bb.service';
import { Constants } from 'app/app.constants';
// import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { combineAll } from 'rxjs/operator/combineAll';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  noCompanyMessage: string;
  companies: any = [];
  chartPie: any = {};
  products: any = {};
  productsMessage: string;
  shares: any = {};
  totalCompanies: number;
  companyMaxSize: number;
  perPageItem: number;
  currentPage: number;
  blendedProfile: any = {};

  constructor(
    private bbService: BBService,
    // private AmCharts: AmChartsService,
  ) {
    this.companyMaxSize = Constants.MAX_PAGE_SIZE;
    this.perPageItem    = Constants.PAGINATION_SIZE;
  }

  getCompanies(page) {
    let pageNumber = (page || 1);

    this.bbService.getCompanies()
    .subscribe((res) => {
      if (!res.isError) {
        this.companies = res.data || [];
        this.totalCompanies = res.count;
        this.currentPage = page;
        if (this.companies.length === 0) {
          this.noCompanyMessage = Constants.NO_COMPANY_FOUND;
        } else if (this.companies.length > 0) {
          this.companies.forEach((item) => {
            this.shares[item.companyCode] = {};
            this.getShare(item.companyCode);
          })
        }
      } else {
        this.noCompanyMessage = Constants.NO_COMPANY_FOUND;
      }
    })
  }

  stockPrice(companyCode) {
    this.bbService.stockPriceGraphExchangeData(companyCode)
    .subscribe((res) => {
      if (!res.isError) {
        let shares = res.data || [];
        let len    = shares.length;

        this.shares[companyCode]['stats'] = (res.stats ? res.stats : {});
        if (shares && len > 0) {
          let liveData   = ((len > 0) ? shares[len - 1].unitPrice : 0);
          let prevData   = ((len > 2) ? shares[len - 2].unitPrice : 0);
          let profitLoss = ( liveData - prevData );
          let diffData   = 0;
          let gainLoss   = 0;

          diffData = ((prevData > 0) ? ( ( ( liveData - prevData ) * 100 ) / prevData ) : 0);
          if (diffData > 0) {
            gainLoss = 1;
          } else if (diffData < 0) {
            gainLoss = 2;
            diffData = (diffData * -1);
          } else {
            gainLoss = -1;
            diffData = 0;
          }

          this.shares[companyCode]['liveData']   = liveData;
          this.shares[companyCode]['prevData']   = prevData;
          this.shares[companyCode]['gainLoss']   = gainLoss;
          this.shares[companyCode]['diffData']   = diffData;
          this.shares[companyCode]['profitLoss'] = profitLoss;
        }
      }
    })
  }

  getShare(companyCode) {
    this.bbService.getCompanyShares(companyCode)
    .subscribe((res) => {
      if (!res.isError) {
        let shares = res.data || [];
        if ( shares.length > 0 ) {
          this.shares[companyCode] = shares[0];
          this.stockPrice(companyCode);
        }
      }
    });
  }

  getProductsPurchase() {
    this.bbService.getShares()
    .subscribe((res) => {
      this.products = res.data || [];
      this.productsMessage = null;
      // let len = this.products.length;
      // let data = [];
      // let sumOfPurchase = 0;
      // let labels = false;
      // let colors = ['#FFAE2A', '#FF4718', '#D1B52A', '#45A4E8', '#00C664', '#c73331'];

      // if (res.data.length === 0) {
      //   this.productsMessage = Constants.NO_CHART_DATA_FOUND;
      // }

      // for (let idx = 0; idx < len; idx++) {
      //   let pushData = {'product': this.products[idx].record.companyName, 'value': parseFloat(this.products[idx].record.totalShares)};
      //   if (colors[idx]) {
      //     pushData['color'] = colors[idx];
      //   }
      //   this.blendedProfile[this.products[idx].record.companyCode] = this.products[idx].blendedProfile.averageUnitPrice;
      //   data.push(pushData);
      //   sumOfPurchase = sumOfPurchase + parseFloat(this.products[idx].record.totalShares);
      // }

      // let chartData = {
      //   'type': 'pie',
      //   'theme': 'light',
      //   'innerRadius': '0%',
      //   'radius': '50%',
      //   'dataProvider': data,
      //   'titleField': 'product',
      //   'valueField': 'value',
      //   'labelsEnabled': labels,
      //   'responsive': {
      //     'enabled': true
      //   },
      //   'allLabels': [],
      //   'outlineAlpha': 0.4,
      //   'depth3D': 25,
      //   'angle': 45,
      //   'colorField': 'color'
      // };

      // if (sumOfPurchase) {
      //   labels = true;
      //   chartData['labelsEnabled'] = true;
      //   chartData['balloonText'] = '<b>[[title]]</b><br/><span style="font-size:14px"><b>[[value]]</b> ([[percents]]%)</span>';
      //   chartData['balloon'] = {
      //     'drop': false,
      //     'adjustBorderColor': true,
      //     'color': '#000',
      //     'fontSize': 12
      //   };

      //   chartData['legend'] = {
      //     'horizontalGap': 10,
      //     'maxColumns': 1,
      //     'position': 'right',
      //     'markerSize': 10
      //   };
      // } else {
      //   chartData['legend']  = false;
      //   chartData['balloon'] = false;
      //   chartData['balloonText'] = '';

      //   data.push({'product': ' ', 'value': 1});
      // }

      // this.chartPie = this.AmCharts.makeChart('pie-chart', chartData);
    });
  }

  ngOnInit() {
    this.noCompanyMessage = null;
    this.getCompanies(null);
    this.getProductsPurchase();
  }

  ngOnDestroy() {
    // if (this.chartPie) {
    //   this.AmCharts.destroyChart(this.chartPie);
    // }
  }
}
