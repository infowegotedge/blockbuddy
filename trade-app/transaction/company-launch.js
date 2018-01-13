// import AppConfig from '../config/app-config';
//
// import _ from "lodash";
//
// import CompanyController from '../controllers/company.controller';
//
// import TraderController from '../controllers/trader.controller';
//
// import TraderPortfolioControllor from '../controllers/trader-portfolio.controller';
//
// import SystemPortfolioLedgerControllor from '../controllers/system-portfolio-ledger.controller';
//
// import TraderPortfolioLedgerControllor from '../controllers/trader-portfolio-ledger.controller';
//
// const sequelize = require('../models').postgres.sequelize;
//
// const uuidv4 = require('uuid/v4');
//
// class CompanyLaunch {
//
//     _performTransfer =  async ( companyCode, transaction ) => {
//
//         /** Strategy
//          * 1. Is company active
//          * 2. Can company owner trader
//          * 3. Modify the role for company owner to COMPANY OWNER
//          * 4. Create & Transfer shares from System to COMPANY OWNER portfolio
//          * 5. Approve and Update Company
//          */
//
//         /** 1. Is Company active **/
//         let company = await CompanyController.getCompanyCompleteInfo( companyCode, transaction );
//         if ( !company.isActive ) {
//             throw new Error( "Company inactive, cannot proceed" );
//         }
//
//         /** 2. Can Company Owner Trader **/
//         if ( _.isEmpty(company.createdBy) || _.isNull( company.createdBy ) ) {
//             throw new Error( "Company owner missing, cannot proceed" );
//         }
//         let companyOwner = await TraderController.getTraderInfo( company.createdBy, transaction );
//         if ( !companyOwner.canTrade ) {
//             throw new Error( "Company owner can't trade" );
//         }
//
//         /** 3. Modify the role for company owner to COMPANY OWNER **/
//         let updateOwnerRole = await TraderController.updateTraderRole( companyOwner.traderID, "COMPANY-OWNER", transaction );
//
//         /** NOTES **/
//         var notes = "System credit of " + company.initialShareOffering + " shares, against Company Launch [ " + company.companyName +" ] to user " + companyOwner.fullName + " ( " + companyOwner.userName + " ) ";
//
//         /** 4. Create & Transfer shares from System to COMPANY OWNER portfolio **/
//         let payload = {
//             companyID: company.companyID,
//             notes,
//             privateNotes: notes,
//             total: company.initialShareOffering
//         };
//
//         payload.from = "SYSTEM";
//         payload.to = companyOwner.traderID;
//         payload.transferType = "DEBIT";
//         let systemPortfolioLedger = await SystemPortfolioLedgerControllor.createSystemPortfolioLedger( payload, transaction);
//
//         payload.from = systemPortfolioLedger.systemPortfolioLedgerID;
//         payload.to = companyOwner.traderID;
//         payload.transferType = "CREDIT";
//         let traderPortfolioLedgerControllor = await TraderPortfolioLedgerControllor.createTraderPortfolioLedger( payload, transaction );
//
//         let traderPortfolio = await TraderPortfolioControllor.addSharesToTraderPortfolio(
//             companyOwner.traderID,
//             company.companyID,
//             company.initialShareOffering,
//             company.companyCode,
//             company.companyName,
//             transaction
//         );
//
//         /** 5. Approve and Update Company **/
//         let updatedCompany = await CompanyController.approveCompany( companyCode, transaction );
//
//         return traderPortfolio;
//     }
//
//     approveCompanyAndSharesToCompanyOwnerAccount = ( companyCode ) => {
//
//         let _self = this;
//
//         return sequelize.transaction(function (t) {
//
//             return _self._performTransfer( companyCode , t);
//
//         }).then( ( results ) => {
//             //Inform notification service
//             return {
//                 message: "Company Launch complete",
//                 isError: true
//             }
//         }).catch( ( err ) => {
//             throw err;
//         });
//
//     }
//
// }
//
//
// export default new CompanyLaunch();
