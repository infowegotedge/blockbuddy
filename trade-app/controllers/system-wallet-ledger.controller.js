import _ from 'lodash';

import SystemWalletLedgerHandler from  '../handler/system-wallet-ledger.handler';

import ProductSaleTraderWallet from "../transaction/product-sale.trader-wallet";

import TraderHandler from '../handler/trader.handler';

import CurrencyHandler from "../handler/currency.handler";

class SystemWalletLedgerController {


    listAllSystemWalletLedgerAction = async ( req, res ) => {

        try{

            let list = await SystemWalletLedgerHandler.listAllSystemWalletLedger(  req.query.page, req.query.limit  );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item );

            });

            res.json({
                message: "System Wallet Ledger list fetched",
                data: _data,
                count: list.count,
                currentPage: (( req.query.page ) ? 1 : req.query.page)
            });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }


    manualAllotmentOfCurrencyAction = async ( req, res ) => {

        try {

            let currencyObj = await CurrencyHandler.getCurrencyInfoByCode( req.body.currencyCode );
            let traderObj = await TraderHandler.getTraderInfoByUserName( req.body.userName );
            let total = parseFloat( req.body.total );

            await ProductSaleTraderWallet.addCurrencyToTraderWalletOnProductSale( traderObj, currencyObj, total, "MANUAL_ALLOTMENT" );

            res.json({
                message: "Manual Allotment of Wallet complete"
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }


    }

}


export default new SystemWalletLedgerController();
