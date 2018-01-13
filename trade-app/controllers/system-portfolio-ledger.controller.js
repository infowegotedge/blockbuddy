import _ from 'lodash';

import SystemPortfolioLedgerHandler from '../handler/system-portfolio-ledger.handler';

import CompanyHandler from '../handler/company.handler';
import TraderHandler from '../handler/trader.handler';
import ProductSaleTraderPortfolio from '../transaction/product-sale.trader-portfolio';

const postgres = require('../models').postgres;

class SystemPortfolioLedgerControllor {
    

    //====== Routes Action ========================================================

    listSystemShareLedgerAction = async ( req, res ) => {

        try {

            let list = await SystemPortfolioLedgerHandler.listSystemPortfolioLedger( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item );

            });

            res.json({
                message: "System Portfolio Ledger list",
                data: _data,
                count: list.count,
                currentPage: (( req.query.page ) ? 1 : req.query.page)
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }

    }
    
    
    manualAllotmentOfCoinsAction = async ( req, res ) => {
        
        try {

            let companyObj = await CompanyHandler.getCompanyInfo( req.body.companyCode );
            let traderObj = await TraderHandler.getTraderInfoByUserName( req.body.userName );
            let total = parseInt( req.body.total );

            await ProductSaleTraderPortfolio.addSharesToTraderPortfolioOnProductSale( traderObj, companyObj, total, "MANUAL_ALLOTMENT" );
            
            res.json({
                message: "Manual Allotment of Coins complete"
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }
        
        
    }


    manualMigrationOfCoinsAction = async ( req, res ) => {

        try {

            let companyObj = await CompanyHandler.getCompanyInfoByName( req.body.company );
            let traderObj = await TraderHandler.getTraderInfoByUserName( req.body.username );
            let total = parseInt( req.body.shares );

            await ProductSaleTraderPortfolio.addSharesToTraderPortfolioOnProductSale( traderObj, companyObj, total, "MANUAL_ALLOTMENT" );

            res.json({
                message: "Manual Allotment of Coins complete"
            })


        } catch (err) {
            res.boom.badRequest(err.toString());
        }


    }

}


export default new SystemPortfolioLedgerControllor();
