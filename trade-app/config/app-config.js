import path from 'path';

var env = process.env.NODE_ENV || 'development';

// Default configuations applied to all environments
const defaultConfig = {
    
    env,
    
    offerTypes: [ "SELL-SHARE", "BUY-SHARE", "ACCEPT-SELL-SHARE", "ACCEPT-BUY-SHARE" ],

    transactionType: [ "DEBIT", "CREDIT" ],

    ledgerType: ["SHARE-TRADING", "PRODUCT", "COMMISSION", "REVENUE", "TRANSFER"],
    ledgerSubType: ["SELL-SHARE", "ACCEPT-SELL-SHARE", "ACCEPT-BUY-SHARE", "BUY-SHARE", "PURCHASE", "DIRECT-SALES", "BINARY-BONUS", "MATCHING-BONUS", "COINS", "CURRENCY"],

    exchangedCommodity: [ "SHARE", "BKN" ],

    version: require('../package.json').version,

    root: path.normalize(__dirname + '/../'),

    traderRoles : [ "TRADER", "ADMIN"],
    
    internalTransferBknDeductionType: ["FIXED", "PERCENTAGE"],
    
    withdrawalDeductionType: ["FIXED", "PERCENTAGE"],

    tableKey: {
        ExchangeAggregationLog: "EXCH_AGG_LOG-",
        ExchangeLog: "EXCH_LOG-"
    },

    aggregationType: ["15MIN", "60MIN", "1DAY", '2DAY', '3DAY', "1WEEK", "1MONTH"],
    
    //Table Primary Keys
    companyID: "COMPANY-",
    bknToEuroConversionRateIDType: "BKNtoEURO-",
    internalTransferBknDeductionRate: "INTtoEURO-",
    offerID: "OFFER-",
    withdrawalDeductionRateID: "WTHRATE-",
    traderWalletLedgerID: "WALLET_LEDGER-",
    traderWalletID: "WALLET-",
    stockReportID: "STOCK_REPORT-",
    traderPortfolioLedgerID: "PORTFOLIO_LEDGER-",
    traderPortfolioID: "PORTFOLIO-",
    traderID: "TRADER-",
    systemWalletLedgerID: "SYS_WALLET_LEDGER-",
    systemPortfolioLedgerID: "SYS_PORTFOLIO_LEDGER-",
    currencyID: "CURRENCY-",
    qualificationID: "QUALIFICATION-",
    compensationID: "COMPENSATION-",
    qualificationCompensationID: "QUALIFICATION_COMPENSATION-",
    traderQualificationID: "TRADER_QUALIFICATION-",
    traderQualificationMigrationID: "TRADER_QUALIFICATION_MIGRATION-",
    productID: "PRODUCT-",
    productSaleID: "PRODUCT_SALE-",

    bonusType: ["FIXED", "PERCENTAGE"],
    bonusBase: ["BV", "PURCHASE"],

    canAcceptItsOwnSellOffer: false,
    canAcceptItsOwnBidOffer: true,
    
    productType: ["STATIC", "SUBSCRIPTION"],
    
    freeQualificationLevelCode: "FREE",

    defaultListSize: 30,


    //ENVIRONMENT CONFIG

    appPort: process.env.NODE_TRADE_APP_SERVER_PORT,

    apiPrefix: process.env.NODE_TRADE_APP_SERVER_API_PATH , // Could be /api/resource or /api/v2/resource

    redis: {
        "host": process.env.NODE_TRADE_APP_REDIS_HOST,
        "port": process.env.NODE_TRADE_APP_REDIS_PORT,
        "password": process.env.NODE_TRADE_APP_REDIS_PASSWORD,
        "expiryTTL": process.env.NODE_TRADE_APP_REDIS_EXP_TTL
    },

    postgres: require(__dirname + '/postgres.json')[env],

    mongo: {
        uri: process.env.NODE_TRADE_APP_MONGO_URI
    },

    adminAppSecret: process.env.NODE_TRADE_APP_SERVER_ADMIN_APP_SECRET,

    adminPassword: process.env.NODE_TRADE_APP_SERVER_ADMIN_PASSWORD
    
};

// Recursively merge configurations
export default defaultConfig;
