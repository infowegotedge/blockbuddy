import { Router } from 'express';

import TraderController from './controllers/trader.controller';

import CompanyController from './controllers/company.controller';

import StockReportController from './controllers/stock-report.controller';

import OfferController from './controllers/offer.controller';

import ProductController from "./controllers/product.controller";

import QualificationController from "./controllers/qualification.controller";

import CompensationController from './controllers/compensation.controller';

import QualificationCompensationController from './controllers/qualification-compensation.controller';

import CurrencyController from './controllers/currency.controller';

import SystemPortfolioLedgerControllor from './controllers/system-portfolio-ledger.controller';

import SystemWalletLedgerController from './controllers/system-wallet-ledger.controller';

import ProductSaleController from './controllers/product-sale.controller';

import ExchangeCoinReportController from './controllers/exchange-coin-report.controller';

import AppConfig from './config/app-config';

import Auth from './middleware/authenticate'; 

import errorHandler from './middleware/error-handler'

const routes = new Router();

//*********** ---------------------- Trader Routes ------------------------------------------ ************//
//routes.get( '/admin/auth', TraderController.getAdminAuthTokenAction ); //Get Auth Token for admin
//*********** ---------------------- Trader Routes ------------------------------------------ ************//


//*********** ---------------------- Offer Routes ------------------------------------------ ************//
routes.get( '/offers/', Auth.authenticateUser, OfferController.listAvailableOfferAction );//Get Available Offers
routes.get( '/offers/closed', Auth.authenticateUser, OfferController.listClosedAvailableOfferAction );//Get Available Offers
routes.get( '/offers/company/:companyCode/:type', Auth.authenticateUser, OfferController.listAvailableOfferByTypeAndCompanyAction );//Get Available Offers
//*********** ---------------------- Offer Routes ------------------------------------------ ************//


//*********** ---------------------- Stock Price Routes ------------------------------------------ ************//
routes.get( '/stock-price/:companyCode', Auth.authenticateUser, StockReportController.listStockReportByCompanyCode );// Get Stock Price Report of by company code
routes.get( '/stock-price', Auth.authenticateUser, StockReportController.listStockReport  ); //Get Stock Price Report of All Companies
//*********** ---------------------- Stock Price Routes ------------------------------------------ ************//

/**
 * Trader Routes
 */
routes.get( '/trader/auth', Auth.authenticateAdminApp, TraderController.getAuthTokenAction ); //Get Auth Token for Trading for Authentication

routes.get( '/trader/me', Auth.authenticateUser, TraderController.getInfoAction ); // Get Trader Info
routes.get( '/trader/wallet', Auth.authenticateUser, TraderController.getWalletAction ); // Get Trader Account Ledger
routes.get( '/trader/portfolio', Auth.authenticateUser, TraderController.getPortfolioAction ); // Get Trader Company Ledger
routes.get( '/trader/portfolio/:companyCode', Auth.authenticateUser, TraderController.getPortfolioByCompanyCodeAction ); // Get Trader Company Ledger
routes.get( '/trader/ledger/portfolio', Auth.authenticateUser, TraderController.getPortfolioLedgerAction ); // Get Trader Share Ledger
routes.get( '/trader/ledger/wallet', Auth.authenticateUser, TraderController.getWalletLedgerAction ); // Get Trader Wallet Ledger

routes.post( '/trader/sell-offer', Auth.authenticateUser, TraderController.createSellOfferAction ); // Create a sell offer
routes.post( '/trader/sell-accept', Auth.authenticateUser, TraderController.acceptSellOfferAction ); // Accept a sell offer
routes.post( '/trader/bid-offer', Auth.authenticateUser, TraderController.createBidOfferAction ); // Create a bid offer
routes.post( '/trader/bid-accept', Auth.authenticateUser, TraderController.acceptBidOfferAction ); // Accept a bid offer

routes.post( '/trader/create', Auth.authenticateAdminApp, TraderController.createTraderAccountAction ); //create Trader
routes.get( '/trader/list', Auth.authenticateAdmin, TraderController.listAllTradersAction ); //List all Traders with pagination
routes.put( '/trader/:traderID',Auth.authenticateAdmin, TraderController.updateTraderAction );//Update trader
routes.delete( '/trader/:traderID',Auth.authenticateAdmin, TraderController.disableTraderAction );//Disable trader


/**
 * Product Routes
 */
routes.get( '/product/list/', Auth.authenticateAdmin, ProductController.listProductsAction ); //Get List of Active Inactive Products
routes.get( '/product/list/static', Auth.authenticateUser, ProductController.listStaticProductsAction );// Get list of all static product
routes.get( '/product/list/subscription', Auth.authenticateUser, ProductController.listSubscriptionProductsAction );// Get list of all subscription product

routes.get( '/product/:sku', ProductController.getProductInfoAction );// Get product info
routes.post( '/product', Auth.authenticateAdmin, ProductController.createNewProductAction );// Create new product
routes.put( '/product', Auth.authenticateAdmin, ProductController.updateProductAction );// Update product
routes.delete( '/product/:sku', Auth.authenticateAdmin, ProductController.disableProductAction );// Disable product


/**
 * Qualification Routes
 */
routes.get( '/qualification/:code', Auth.authenticateUser, QualificationController.getQualificationAction  );// Get qualification info by code
routes.get( '/qualification/list',  Auth.authenticateUser, QualificationController.listActiveQualificationsAction );// Get list of all active qualification

routes.get( '/qualification/list/all', Auth.authenticateAdmin, QualificationController.listQualificationAction );// Get list of all active qualification
routes.post( '/qualification', Auth.authenticateAdmin, QualificationController.createNewQualificationAction );// Create qualification
routes.put( '/qualification/:code', Auth.authenticateAdmin, QualificationController.updateQualificationAction );// Update qualification
routes.delete( '/qualification/:code', Auth.authenticateAdmin, QualificationController.disableQualificationAction );// Disable qualification buy


/**
 * Compensation Routes
 */
routes.get( '/compensation/:compensationID', Auth.authenticateAdmin, CompensationController.getCompensationAction );// Get compensation by id
routes.delete( '/compensation/:compensationID', Auth.authenticateAdmin, CompensationController.disableCompensationAction );// disable compensation by id
routes.post( '/compensation', Auth.authenticateAdmin, CompensationController.createNewCompensationAction );// disable compensation by id
routes.get( '/compensation', Auth.authenticateAdmin, CompensationController.listAllCompensationAction );// disable compensation by id


/**
 * Qualification Compensation Routes
 */
routes.post( '/qualification-compensation', Auth.authenticateAdmin, QualificationCompensationController.createNewQualificationCompensationAction ); // create qualification compensation


/**
 * Currency
 */
routes.get( '/currency/list', Auth.authenticateUser, CurrencyController.listCurrenciesAction  ); //List all active currency
routes.get( '/currency/:code', Auth.authenticateUser, CurrencyController.getCurrencyInfoByCodeAction  ); //List currency info by code

routes.post( '/currency/', Auth.authenticateAdmin, CurrencyController.createNewCurrencyAction ); //Create new currency
routes.put( '/currency/:code', Auth.authenticateAdmin, CurrencyController.updateCurrencyAction ); //Update currency

/**
 * Company
 */
routes.get( '/company/:companyCode', Auth.authenticateUser, CompanyController.getCompanyInfoAction );//Get Company info by code
routes.get( '/company',  Auth.authenticateUser, CompanyController.listActiveCompany ); //list Active Companies

routes.get( '/company-all',  Auth.authenticateAdmin, CompanyController.listAllCompanyAction ); //list ActiveCompanies
routes.post( '/company', Auth.authenticateAdmin, CompanyController.createCompanyAction ); //Create Company
routes.put( '/company/:companyCode',Auth.authenticateAdmin, CompanyController.updateCompanyAction );//Update Company
routes.put( '/company/enable/:companyCode', Auth.authenticateAdmin,CompanyController.enableCompanyAction );//Enable Company
routes.delete( '/company/:companyCode',Auth.authenticateAdmin, CompanyController.disableCompanyAction );//Disable Company


/**
 * System or Admin Backend
 */
routes.get( '/system/ledger/portfolio', Auth.authenticateAdmin, SystemPortfolioLedgerControllor.listSystemShareLedgerAction  );//List Portfolio Ledger for Admin
routes.get( '/system/ledger/wallet', Auth.authenticateAdmin, SystemWalletLedgerController.listAllSystemWalletLedgerAction  );//List Wallet Ledger for Admin


/**
 * Product Sale Routes
 */
routes.get( '/product/sale/processed', Auth.authenticateAdmin, ProductSaleController.listProcessedProductSaleAction  );//List proccessed sales record
routes.get( '/product/sale/unprocessed', Auth.authenticateAdmin, ProductSaleController.listUnprocessedProductSaleAction  );//List unproccessed sales record

routes.post( '/product/sale/create', Auth.authenticateAdminApp, ProductSaleController.createProductSaleAction  );//Create new sales record



/**
 * Manual Wallet and Portfolio Route Update
 */
routes.post( '/system/manual-portfolio-allotment', Auth.authenticateAdmin, SystemPortfolioLedgerControllor.manualAllotmentOfCoinsAction  );//Manual Allotment of Coins
routes.post( '/system/manual-wallet-allotment',Auth.authenticateAdmin, SystemWalletLedgerController.manualAllotmentOfCurrencyAction  );//Manual Allotment of Currency


/**
 * Manual Wallet and Portfolio Route Update
 */
routes.post( '/trader/coin-transfer', Auth.authenticateUser, TraderController.transferCoinsAction  );//Manual Allotment of Coins by users


/**
 * Migrate Balance of old users
 */
routes.post( '/migrate/balance', Auth.authenticateAdminApp, SystemPortfolioLedgerControllor.manualMigrationOfCoinsAction  );//Manual Allotment of Coins



/**
 * Exchange Coin Report
 */
routes.get( '/report/exchange/coin/recent', Auth.authenticateUser, ExchangeCoinReportController.getPast100RecordsByCompanyCodeAction  );//
routes.get( '/report/exchange/coin/custom', Auth.authenticateUser, ExchangeCoinReportController.getRecordsByKeywordAndCompanyCodeAction  );//





routes.use(errorHandler);




export default routes;

