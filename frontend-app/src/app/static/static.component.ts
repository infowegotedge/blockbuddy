import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { BBService } from '../bb.service';
import { Constants } from '../app.constants';

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: ['./static.component.css']
})
export class StaticComponent implements OnInit {
  contentType: string;
  products: any;
  productsSubscription: any;
  productsSubscription1: any;
  totalProducts: number;
  currentPage: number;
  coinName: string;

  @ViewChild('bknToPurchaseModal') public bknToPurchaseModal: ModalDirective;
  constructor(private bbService: BBService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(
      params => this.contentType = params.get('contentType')
    );
  }

  getProducts(page) {
    let query = {'page': (page || 1)};

    this.bbService.getProductsStatic(query)
    .subscribe((res) => {
      this.products      = res.data || [];
      this.totalProducts = res.totalRows;
      this.currentPage   = res.currentPage;
    });
  }

  getProductsSubscription(page) {
    let query = {'page': (page || 1)};

    this.bbService.getProductsSubscription(query)
    .subscribe((res) => {
      this.productsSubscription = res.data || [];

      let notProducts = ['SUB-EM-999', 'SUB-EM-399', 'SUB-EM-199'];
      let productMeta = this.productsSubscription;
      let products    = [];
      for(let product of productMeta) {
        if(notProducts.indexOf(product.productSku) == -1) {
          let additional = [];
          for(let idx of product.productMeta.additional) {
            additional.push(idx);
          }

          let idx1 = 5 - product.productMeta.additional.length;
          for(let idx = 0; idx < idx1; idx++) {
            additional.push('N / A');
          }

          products.push({
            "productName": product.productName,
            "sellingPrice": product.sellingPrice,
            "productSku": product.productSku,
            "additional": additional
          });
        }
      }

      this.productsSubscription1 = products;
      this.totalProducts         = res.totalRows;
      this.currentPage           = res.currentPage;
    });
  }

  showModal(modalType) {
    this.coinName = modalType;
    this.bknToPurchaseModal.show();
  }

  hideModal(): void {
    this.bknToPurchaseModal.hide();
  }

  ngOnInit() {
    this.getProducts(null);
    this.getProductsSubscription(null);
  }
}
