import TraderTestSuit from './trader';

import QualificationTestSuit from './qualification';

import CompensationPlanTestSuit from './compensation-plan';

import QualificationCompensationTestSuit from './qualification-compensation';

import CompanyControllerTestSuit from './company';

import VirtualCurrencyTestSuit from './virtual-currency';

import ProductControllerTestSuit from './product';

import TraderWalletHandler from '../handler/trader-wallet.handler';

import SystemWalletLedgerHandler from '../handler/system-wallet-ledger.handler';

import TraderWalletLedgerHandler from '../handler/trader-wallet-ledger.handler';

import CompanyHandler from '../handler/company.handler';

import CurrencyHandler from '../handler/currency.handler';

import TraderHandler from '../handler/trader.handler';

import ProductSaleTraderWallet from '../transaction/product-sale.trader-wallet';

import TraderPortfolioHandler from '../handler/trader-portfolio.handler';

import SystemPortfolioLedgerHandler from '../handler/system-portfolio-ledger.handler';

import TraderPortfolioLedgerHandler from '../handler/trader-portfolio-ledger.handler';

import ProductSaleTraderPortfolio from '../transaction/product-sale.trader-portfolio';

import TraderQualificationHandler from '../handler/trader-qualification.handler';

import QualificationHandler from '../handler/qualification.handler';

import ProductSale from '../transaction/product-sale';

import ShareTradeSellOffer from '../transaction/share-trade.sell-offer';

import CoinTransfer from '../transaction/coin-transfer.transaction';


async function test() {

    // //Create Qualification
    // let qualifications = await QualificationTestSuit.createQualification();
    // console.log(">>>> qualifications", qualifications );
    //
    // // Create Compensation Plans
    // let compensationPlans = await CompensationPlanTestSuit.createCompensationPlan();
    // console.log(">>>> compensationPlans", compensationPlans );
    //
    // // Create Qualification Compensation
    // let qualificationCompensation = await QualificationCompensationTestSuit.createQualificationCompensation();
    // console.log(">>>> qualificationCompensation", qualificationCompensation );
    //
    // // Create Virtual Currency
    // let virtualCurrency = await VirtualCurrencyTestSuit.createVirtualCurrency();
    // console.log(">>>> virtualCurrency",virtualCurrency );
    //
    // // Create Company
    // let companyList = await CompanyControllerTestSuit.createCompany();
    // console.log(">>>> companyList", companyList );
    //
    // // Create Product
    // let productList = await ProductControllerTestSuit.createProduct();
    // console.log(">>>> productList", productList );
    // //
    // // Create Users
    // console.log(">>>>", await TraderTestSuit.createTraders() );
    // //
    // // Create Admin
    // console.log(">>>>", await TraderTestSuit.createAdmin() );
    //
    // //Test wallet
    //console.log(await TraderWalletHandler.getTraderWallet( "TRADER-FqzuSXLv5x7JfFEwLNfMpDqWDXGWt1Rg" ));
    //console.log(await TraderWalletHandler.getTraderWallet( "TRADER-ia8DO5Aigc8ryXqIv5ktYrgmJyFXSrxq" ));

    //console.log(await TraderWalletHandler.getTraderWalletByCurrencyID( "TRADER-FqzuSXLv5x7JfFEwLNfMpDqWDXGWt1Rg1", "CURRENCY-bVU7XgLPsppWocDO2rk6uoNvhtUOTN3v" ));
    //console.log(await TraderWalletHandler.getTraderWalletByCurrencyID( "TRADER-ia8DO5Aigc8ryXqIv5ktYrgmJyFXSrxq", "CURRENCY-bVU7XgLPsppWocDO2rk6uoNvhtUOTN3v" ));

    //console.log(await TraderWalletHandler.createNewTraderWallet( "TRADER-1HxWdELYaVb3Z4CIazkNpkgajNly90r7", {currencyID: "CURRENCY-ZkSW2cGrvhB1KsfGAm43IQ8bVZEyvPLB", currencyCode: "BKN", currencyName: "Block Notes"}, "500.12" ));
    //console.log(await TraderWalletHandler.createNewTraderWallet( "TRADER-ri6CqHByWhTAHb6vrMCmIyNwtB1h0xEO", {currencyID: "CURRENCY-ZkSW2cGrvhB1KsfGAm43IQ8bVZEyvPLB", currencyCode: "BKN", currencyName: "Block Notes"}, "50.12" ));

    //console.log(await TraderWalletHandler.updateTraderWallet( "TRADER-mg2q0V75WF4k2E7XunQVpnfdTHzKnZCn", "CURRENCY-ZkSW2cGrvhB1KsfGAm43IQ8bVZEyvPLB", "964435435.5674974"));

    //console.log(await TraderWalletHandler.addCurrencyToTraderWallet( "TRADER-sVef38PVDLOwSUj8XWsit72iFTyzyy2p",{currencyID: "CURRENCY-vgdb5OMzZxGOv1sxBBSlFtkxrWBm4yzG", currencyCode: "BV", currencyName: "Business Volume"}, "100.12"));
    //console.log(await TraderWalletHandler.addCurrencyToTraderWallet( "TRADER-sVef38PVDLOwSUj8XWsit72iFTyzyy2p",{currencyID: "CURRENCY-ZkSW2cGrvhB1KsfGAm43IQ8bVZEyvPLB", currencyCode: "BKN", currencyName: "Block Notes"}, "100.12"));

    //console.log(await TraderWalletHandler.deductCurrencyToTraderWallet( "TRADER-sVef38PVDLOwSUj8XWsit72iFTyzyy2p",{currencyID: "CURRENCY-vgdb5OMzZxGOv1sxBBSlFtkxrWBm4yzG", currencyCode: "BV", currencyName: "Business Volume"}, "10"));
    //console.log(await TraderWalletHandler.deductCurrencyToTraderWallet( "TRADER-sVef38PVDLOwSUj8XWsit72iFTyzyy2p",{currencyID: "CURRENCY-ZkSW2cGrvhB1KsfGAm43IQ8bVZEyvPLB", currencyCode: "BKN", currencyName: "Block Notes"}, 0.2));

    
    // //Test System Wallet Ledger
    // console.log(await SystemWalletLedgerHandler.createNewSystemWalletLedger({
    //     shareTrade: "adsasd111",
    //     amount: "NasaN",
    //     from: "SYSTEM",
    //     to: "rahul",
    //     currencyID: "CURRENCY-vgdb5OMzZxGOv1sxBBSlFtkxrWBm4yzG",
    //     transferType: "DEBIT",
    //     type: "PRODUCT",
    //     subType: "PURCHASE",
    //     note: "await TraderWalletHandler.deductCurrencyToTraderWallet",
    //     privateNote: "await TraderWalletHandler.deductCurrencyToTraderWallet"
    // }));
    // console.log( await SystemWalletLedgerHandler.listAllSystemWalletLedger() );

    // //Test Trader Wallet Ledger
    // console.log(await TraderWalletLedgerHandler.createNewTraderWalletLedger({
    //     shareTrade: "adsasd111",
    //     amount: 46.45,
    //     from: "SYSTEM",
    //     to: "rahul",
    //     currencyID: "CURRENCY-vgdb5OMzZxGOv1sxBBSlFtkxrWBm4yzG",
    //     transferType: "DEBIT",
    //     type: "PRODUCT",
    //     subType: "PURCHASE",
    //     note: "await TraderWalletHandler.deductCurrencyToTraderWallet",
    //     privateNote: "await TraderWalletHandler.deductCurrencyToTraderWallet"
    // }));
    
    // addCurrencyToTraderWalletOnProductSale
    // let traderObj = await TraderHandler.getTraderInfoByUserName( "test5" );
    // let currencyObj = await CurrencyHandler.getCurrencyInfoByCode("BKN");
    // let amount = 50;
    // let productSaleID = 125;
    // console.log(await ProductSaleTraderWallet.addCurrencyToTraderWalletOnProductSale( traderObj, currencyObj, amount, productSaleID ));

    // //Test portfolio
    //  let traderObj = await TraderHandler.getTraderInfoByUserName( "test1" );
    //  let traderObj2 = await TraderHandler.getTraderInfoByUserName( "test2" );
    // // //console.log( await TraderPortfolioHandler.getTraderPortfolio( traderObj.traderID ) );
    // //
    // let companyObj = await CompanyHandler.getCompanyInfo("VANGUARD");
    // //console.log( await TraderPortfolioHandler.createTraderPortfolio( "TRADER-2MiIhKHKH7M7Dd5bSE47vkmXXWu0ukZz", companyObj, "200.26" ) );
    // //console.log( await TraderPortfolioHandler.updateTraderPortfolio( "TRADER-2MiIhKHKH7M7Dd5bSE47vkmXXWu0ukZz", "COMPANY-Jx4fGc34K03rBVdZYwL2dAlTj6at1HJ1", "300.26" ) );
    //
    // //console.log( await TraderPortfolioHandler.addSharesToTraderPortfolio( traderObj.traderID, companyObj, 100 ) );
    // //console.log( await TraderPortfolioHandler.addSharesToTraderPortfolio( traderObj2.traderID, companyObj, 100 ) );
    //
    //
    //
    // await CoinTransfer.transferCoins( traderObj, traderObj2, companyObj, 90 );


    //console.log( await TraderPortfolioHandler.addSharesToTraderPortfolio( traderObj.traderID, companyObj, 10.25 ) );

    //console.log( await TraderPortfolioHandler.deductSharesFromTraderPortfolio( traderObj.traderID, companyObj, 2 ) );
    
    // console.log( await SystemPortfolioLedgerHandler.createSystemPortfolioLedger({
    //     shareTrade: "adsasd111",
    //     total: 46.45,
    //     from: "SYSTEM",
    //     to: "rahul",
    //     companyID: companyObj.companyID,
    //     transferType: "DEBIT",
    //     type: "PRODUCT",
    //     subType: "PURCHASE",
    //     note: "await TraderWalletHandler.deductCurrencyToTraderWallet",
    //     privateNote: "await TraderWalletHandler.deductCurrencyToTraderWallet"
    // }));
    
    // console.log( await TraderPortfolioLedgerHandler.createTraderPortfolioLedger({
    //     total: "500",
    //     from: "SYSTEM",
    //     to: "rahul",
    //     companyID: companyObj.companyID,
    //     transferType: "DEBIT",
    //     type: "PRODUCT",
    //     subType: "PURCHASE",
    //     note: "await TraderWalletHandler.deductCurrencyToTraderWallet",
    //     privateNote: "await TraderWalletHandler.deductCurrencyToTraderWallet"
    // }));
    
    // let traderObj = await TraderHandler.getTraderInfoByUserName( "test11" );
    // // // let companyObj = await CompanyHandler.getCompanyInfo("TENTANIUM");
    // // //
    // // // console.log( await ProductSaleTraderPortfolio.addSharesToTraderPortfolioOnProductSale( traderObj, companyObj, 100, "1111" ) );
    // //
    // let qualification = await QualificationHandler.getQualificationByCode( "FREE" );
    // //
    // //
    // console.log( await TraderQualificationHandler.updateTraderQualification({
    //     qualificationID: qualification.qualificationID,
    //     qualificationCode: qualification.qualificationCode,
    //     qualificationName: qualification.qualificationName,
    //     traderID: traderObj.traderID
    // }));
    
    //Test Product Sales
    // console.log( await ProductSale.processProductSaleAfterPGResponse({
    //     userName: "test1",
    //     sponsorUserName: "test11",
    //     productSku: "STATIC-BKN-199-TEST",
    //     orderTotal: 199,
    //     orderID: "#faf1212",
    //     gatewayResponse: "asd asdas fsadf sdf asdf asdf asdf sdf sd"
    // }));
    //
    // console.log( await ProductSale.processProductSaleAfterPGResponse({
    //     userName: "test1",
    //     sponsorUserName: "test11",
    //     productSku: "STATIC-BKN-199-TEST",
    //     orderTotal: 199,
    //     orderID: "#faf1212",
    //     gatewayResponse: "asd asdas fsadf sdf asdf asdf asdf sdf sd"
    // }));
    //
    // console.log( await ProductSale.processProductSaleAfterPGResponse({
    //     userName: "test2",
    //     sponsorUserName: "test12",
    //     productSku: "STATIC-BKN-199-TEST",
    //     orderTotal: 199,
    //     orderID: "#faf1212",
    //     gatewayResponse: "asd asdas fsadf sdf asdf asdf asdf sdf sd"
    // }));
    //
    // console.log( await ProductSale.processProductSaleAfterPGResponse({
    //     userName: "test3",
    //     sponsorUserName: "test13",
    //     productSku: "STATIC-BKN-199-TEST",
    //     orderTotal: 199,
    //     orderID: "#faf1212",
    //     gatewayResponse: "asd asdas fsadf sdf asdf asdf asdf sdf sd"
    // }));
    //
    //
    // console.log( await ProductSale.processProductSaleAfterPGResponse({
    //     userName: "blockbuddy",
    //     sponsorUserName: "test11",
    //     productSku: "STATIC-BKN-199-TEST",
    //     orderTotal: 199,
    //     orderID: "#faf1212",
    //     gatewayResponse: "asd asdas fsadf sdf asdf asdf asdf sdf sd"
    // }));
    //
    //
    // console.log( await ProductSale.processProductSaleAfterPGResponse({
    //     userName: "blockbuddy",
    //     sponsorUserName: "test11",
    //     productSku: "STATIC-BKN-199-TEST",
    //     orderTotal: 199,
    //     orderID: "#faf1212",
    //     gatewayResponse: "asd asdas fsadf sdf asdf asdf asdf sdf sd"
    // }));
    //
    //
    // console.log( await ProductSale.processProductSaleAfterPGResponse({
    //     userName: "blockbuddy",
    //     sponsorUserName: "test11",
    //     productSku: "STATIC-BKN-199-TEST",
    //     orderTotal: 199,
    //     orderID: "#faf1212",
    //     gatewayResponse: "asd asdas fsadf sdf asdf asdf asdf sdf sd"
    // }));
    //
    //
    // console.log( await ProductSale.processProductSaleAfterPGResponse({
    //     userName: "blockbuddy",
    //     sponsorUserName: "test11",
    //     productSku: "STATIC-BKN-199-TEST",
    //     orderTotal: 199,
    //     orderID: "#faf1212",
    //     gatewayResponse: "asd asdas fsadf sdf asdf asdf asdf sdf sd"
    // }));

    //Test sell share
    // let traderObj = await TraderHandler.getTraderInfoByUserName( "test1" );
    // console.log( await ShareTradeSellOffer.createSellOffer( traderObj.traderID,  ) );

    //
    // let companyObj = await CompanyHandler.getCompanyInfo("SITV-WARRANT");
    // let traderObj1 = await TraderHandler.getTraderInfoByUserName( "rucryptotrading" );
    // let total1 = 1136600;
    // console.log(">>>>", await ProductSaleTraderPortfolio.addSharesToTraderPortfolioOnProductSale( traderObj1, companyObj, total1, "MANUAL_PRODUCT_SALES" ) );
    //
    //
    // let traderObj2 = await TraderHandler.getTraderInfoByUserName( "liberation1970" );
    // let total2 = 1136600;
    // console.log(">>>>", await ProductSaleTraderPortfolio.addSharesToTraderPortfolioOnProductSale( traderObj2, companyObj, total2, "MANUAL_PRODUCT_SALES" ) );

}



module.exports = test;