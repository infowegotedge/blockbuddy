
export class Constants {
  public static get PAGINATION_SIZE(): number { return 25; };
  public static get MAX_PAGE_SIZE(): number { return 5; };
  public static get WITHDRAWAL_BALANCE_ERROR(): string { return "You don't have enough balance to withdrawal."; }
  public static get TRANSFER_BALANCE_ERROR(): string { return "You don't have enough balance to trasnfer."; }
  public static get PASSWORD_PATTER(): string { return "(?=.*[a-zA-Z])(?=.*[0-9]).+"; }
  public static get USERNAME_PATTER(): string { return "^[a-z0-9\-\_]+$"; }
  public static get NAME_PATTER(): string { return "^[a-zA-Z]+$"; }
  public static get EMAIL_PATTER(): string { return "^[a-z][a-zA-Z0-9_]*(\.\+[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?"; }
  public static get NUMBER_PATTER(): string { return "^([0-9]*).([0-9]*)$"; }
  public static get NUMBER_PATTER_WITHOUT_DECIMAL(): string { return "^([0-9]*)$"; }
  // public static get AFFILIATE_URL(): string { return 'http://192.168.1.111:4200/#/signup?ref='; }
  public static get AFFILIATE_URL(): string { return 'https://app.blockbuddy.com/#/signup?ref='; }
  // public static get ADDRESS_VALIDATION_PATTERN(): string { return "^[a-zA-Z0-9\_\-]{6,}$"; }
  // public static get STATE_VALIDATION_PATTERN(): string { return "^[a-zA-Z]{1}([a-zA-Z0-9]\s\_\-){1,}$"; }
  // public static get CITY_VALIDATION_PATTERN(): string { return "^[a-zA-Z]{1}[a-zA-Z\s\_\- _]{1,}$"; }
  // public static get POSTAL_VALIDATION_PATTERN(): string { return "^[0-9a-z\sA-Z\_\-]{4,}$"; }





  // Messages & Notifications
  public static get NO_BINARY_FOUND(): string { return 'No Binary Network Found.'; }
  public static get NO_UNILEVEL_FOUND(): string { return 'No Uni-Level Network Found.'; }
  public static get NO_TRANSACTION_FOUND(): string { return 'No Transactions Found.'; }
  public static get NO_MESSAGES_FOUND(): string { return 'No Messages Found.'; }
  public static get NO_DIRECTS_FOUND(): string { return 'No Members Found.'; }
  public static get NO_COMMISSION_FOUND(): string { return 'No Commissions Found.'; }
  public static get NO_CHART_DATA_FOUND(): string { return 'No Exchange / Trading Data Found.'; }
  public static get NO_PRODUCT_FOUND(): string { return 'No Products Found.'; }
  public static get NO_COMPANY_FOUND(): string { return 'No Company Details Found.'; }

}