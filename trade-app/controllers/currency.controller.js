import _ from 'lodash';

import AppConfig from '../config/app-config';

import CurrencyHandler from '../handler/currency.handler';

class CurrencyController {
    
    getCurrencyInfoByCodeAction = async(  req, res ) => {

        try{

            res.json({ message: "Currency Record Fetched", data: (await CurrencyHandler.getCurrencyInfoByCode( req.params.code )).getRecord })

        } catch ( err ) {

            res.boom.notFound('No record found');

        }

    }

    updateCurrencyAction = async( req, res ) => {

        try{

            await CurrencyHandler.updateCurrency( req.params.code , req.body );

            res.json({ message: "Currency Updated" });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }

    createNewCurrencyAction = async(  req, res ) => {

        try{

            res.json({ message: "New Currency created", data: (await CurrencyHandler.createNewCurrency( req.body )).getRecord });

        } catch ( err ) {

            res.boom.preconditionFailed( err.toString() );

        }

    }

    listCurrenciesAction = async(  req, res ) => {
        try{

            let list = await CurrencyHandler.listCurrencies( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getRecord );

            });

            res.json({ message: "Currencies list fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }


}


export default new CurrencyController();
