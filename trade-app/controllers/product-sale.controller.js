import _ from 'lodash';

import AppConfig from '../config/app-config';

//import ProductSaleHandler from '../handler/product-sale.handler'
import ProductSaleTransaction from '../transaction/product-sale'

class ProductSaleController {

    createProductSaleAction = async(  req, res ) => {

        try{

            res.json({ message: "New record created", data: ( await ProductSaleTransaction.processProductSaleAfterPGResponse( req.body ))});

        } catch ( err ) {

            res.boom.preconditionFailed( err.toString() );

        }

    }
    
    listUnprocessedProductSaleAction = async(  req, res ) => {
        try{

            let list = await ProductSaleHandler.listUnprocessedProductSale( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getRecord );

            });

            res.json({ message: "Unprocessed product sale list fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }


    listProcessedProductSaleAction = async(  req, res ) => {
        try{

            let list = await ProductSaleHandler.listProcessedProductSale( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getRecord );

            });

            res.json({ message: "Processed product sale list fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }


}


export default new ProductSaleController();
