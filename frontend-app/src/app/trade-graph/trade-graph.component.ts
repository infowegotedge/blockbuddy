import { Component, OnInit, Input } from '@angular/core';
import { BBService } from '../bb.service';
import { Constants } from '../app.constants';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

@Component({
  selector: 'app-trade-graph',
  templateUrl: './trade-graph.component.html',
  styleUrls: ['./trade-graph.component.css']
})
export class TradeGraphComponent implements OnInit {

  showLoader: boolean;
  noChartDataFound: string;
  private lineChart: AmChart;
  private shares: any = {};
  private monthArr: any = [];
  stats: any = {};
  liveValue: number;
  diffPercent: number;
  gainLoss: number;
  heightGain: number;

  @Input() idIndex: number;
  @Input() company: any;
  @Input() showExtraField: boolean;
  @Input() regenerate: string;
  @Input() height: string;

  constructor(private bbService: BBService, private AmCharts: AmChartsService) {
    this.monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  getCompanyShares(companyCode) {
    this.shares = { totalShares: 0 };
    this.bbService.getCompanyShares(companyCode)
    .subscribe((res) => {
      let shares = res.data || [];
      if ( shares.length > 0 ) {
        this.shares = shares[0];
      }
    });
  }

  private _loadGraph(recordSet) {
    let res        = recordSet;
    let defaultVal = { 'minimum': 0, 'maximum': 0, 'average': 0 };
    this.stats     = (res.stats ? res.stats : defaultVal);
    let graphData  = (res.data && res.data ? res.data : []);
    let value      = 0;
    let data       = {};
    let data1      = [];
    let graphs     = [];
    let valueAxis  = [];

    this.liveValue   = (graphData.length > 0 ? graphData[graphData.length - 1].unitPrice : 0);
    let diffPercent  = (graphData.length >= 2 ? graphData[graphData.length - 2].unitPrice : 0);
    this.diffPercent = ( diffPercent > 0 ? ( ( ( this.liveValue - diffPercent ) * 100 ) / diffPercent ) : 0);

    if (this.diffPercent > 0) {
      this.gainLoss = 1;
    } else if (this.diffPercent < 0) {
      this.gainLoss = 2;
      this.diffPercent = this.diffPercent * -1;
    } else {
      this.gainLoss = -1;
      this.diffPercent = 0;
    }

    for (let idx in graphData) {
      if (!data[graphData[idx].companyCode]) {
        let id     = 'v' + (value + 1);
        let valueT = 'value' + (value > 0 ? value : '')

        data[graphData[idx].companyCode] = valueT;
        graphs.push({
          'id': id,
          'title': graphData[idx].companyCode,
          'valueField': valueT,
          'bullet': 'round',
          'bulletBorderAlpha': 1,
          'bulletSize': 5,
          'lineThickness': 2,
          'useLineColorForBulletBorder': true,
          'bulletBorderThickness': 1,
          'hideBulletsCount': 30,
          'fillAlphas': 0.3,
          'fillColorsField': 'lineColor',
          'balloonText': '<span style="font-size:13px;"><b>[[value]]</b>: </span>'
        });

        value = value + 1;
      }
    }

    for (let idx of graphData) {
      let date  = new Date(idx.updatedAt);
      let dataV = {
        'date': this.monthArr[date.getMonth()] + '-' + date.getDate() + '\n\r' + date.getHours() + ':' + date.getMinutes()
      };

      dataV[data[idx.companyCode]] = idx.unitPrice || idx.average;
      data1.push(dataV);
    }

    this.noChartDataFound = null;
    if (data1.length === 0) {
      let date  = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '15:00', '15:30', '16:00', '16:30', '17:00'];
      for (let idx of date) {
        data1.push({'date': idx, 'value': 0});
      }
      this.noChartDataFound = Constants.NO_CHART_DATA_FOUND;
    }

    let chartData = {
      'type': 'serial',
      'dataProvider': data1,
      'graphs': graphs,
      'categoryField': 'date',
      'categoryAxis': {
        'title': 'Timeline'
      },
      'dataDateFormat': 'HH:NN',
      'chartCursor': {
        'enabled': true,
        'categoryBalloonDateFormat': 'YYY-MM-DD JJ:NN'
      },
      'chartScrollbar': {
        'enabled': false
      },
      'trendLines': [],
      'guides': [],
      'valueAxes': [{
        'id': 'values-axis',
        'title': 'Unit Price In BKN'
      }],
      'allLabels': [],
      'balloon': {},
      'legend': {
        'enabled': false
      }
    };

    this.lineChart = this.AmCharts.makeChart('line-chart-' + this.idIndex, chartData);
    this.showLoader = false;
  }

  generateGraph(companyCode) {
    this.showLoader = true;
    this.bbService.stockPriceGraphExchangeData(companyCode)
    .subscribe((res) => {
      this._loadGraph(res);
    });
  }

  generateGraphFilterWise(companyCode, filterDay) {
    this.showLoader = true;
    this.bbService.stockPriceGraphExchangeDataCustom(companyCode, filterDay)
    .subscribe((res) => {
      this._loadGraph(res);
    });
  }

  ngOnInit() {
    this.heightGain = (this.height ? parseInt(this.height) : 0);

    switch (this.regenerate) {
      case '1DAY':
      case '2DAY':
      case '3DAY':
      case '1WEEK':
      case '1MONTH':
        this.generateGraphFilterWise(this.company.companyCode, this.regenerate);
        break;
      default:
        this.generateGraph(this.company.companyCode);
        break;
    }

    this.getCompanyShares(this.company.companyCode);
  }

  ngOnDestroy() {
    if (this.lineChart) {
      this.AmCharts.destroyChart(this.lineChart);
    }
  }
}
