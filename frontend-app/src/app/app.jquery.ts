import { Injectable } from '@angular/core';
import * as jQuery from 'jquery';

@Injectable()
export class JQueryWork {

  get hideDOMElement(): boolean {
    jQuery(".sidebar,footer,.topbar").addClass('hidden');
    jQuery('.main-content').css("marginLeft", "0px");
    return true;
  }

  formSubmit(payza, orderId, subscriptionItem): boolean {
    jQuery('#payza-form input[name="ap_merchant"]').val(payza.apMerchant);
    jQuery('#payza-form input[name="ap_purchasetype"]').val(payza.apPurchasetype);
    jQuery('#payza-form input[name="ap_itemname"]').val(payza.apItemname);
    jQuery('#payza-form input[name="ap_amount"]').val(payza.apAmount);
    jQuery('#payza-form input[name="ap_currency"]').val(payza.apCurrency);
    jQuery('#payza-form input[name="ap_quantity"]').val(1);
    jQuery('#payza-form input[name="ap_itemcode"]').val(payza.apItemcode);
    jQuery('#payza-form input[name="ap_description"]').val(payza.apDescription);
    jQuery('#payza-form input[name="ap_returnurl"]').val(payza.apReturnurl + '&order_id=' + orderId);
    jQuery('#payza-form input[name="ap_cancelurl"]').val(payza.apCancelurl + '&order_id=' + orderId);
    jQuery('#payza-form input[name="ap_taxamount"]').val(payza.apTaxamount);
    jQuery('#payza-form input[name="ap_additionalcharges"]').val(payza.apAdditionalcharges);
    jQuery('#payza-form input[name="ap_shippingcharges"]').val(payza.apShippingcharges);
    jQuery('#payza-form input[name="ap_testmode"]').val(payza.apTestmode);
    jQuery('#payza-form input[name="ap_alerturl"]').val(payza.apAlerturl);
    jQuery('#payza-form input[name="apc_1"]').val(orderId);
    if (subscriptionItem.subscription === 1) {
      jQuery('#payza-form input[name="ap_timeunit"]').val(subscriptionItem.timeunit);
      jQuery('#payza-form input[name="ap_periodlength"]').val(subscriptionItem.periodlength);
      jQuery('#payza-form input[name="ap_periodcount"]').val(subscriptionItem.periodcount);
      jQuery('#payza-form input[name="ap_setupamount"]').val(subscriptionItem.setupamount);
    }
    setTimeout(function() { jQuery("#payza-form").submit(); }, 1 );
    return true;
  }
}
