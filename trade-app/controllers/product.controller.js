import _ from 'lodash';

import AppConfig from '../config/app-config';

import ProductHandler from '../handler/product.handler';

class ProductController {

    getProductInfoAction = async( req, res ) => {

        try{

            res.json({ message: "Product Record Fetched", data: ( await ProductHandler.getProductInfo( req.params.sku ) ).getRecord })

        } catch ( err ) {

            res.boom.notFound('No record found');

        }

    }

    disableProductAction = async( req, res ) => {

        try{

            await ProductHandler.disableProduct( req.params.sku );

            res.json({ message: "Product Disabled" });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }
    
    updateProductAction = async( req, res ) => {

        try{

            await ProductHandler.updateProduct( req.params.sku , req.body );

            res.json({ message: "Product Updated" });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }

    createNewProductAction = async( req, res ) => {

        try{

            res.json({ message: "New Product created", data: (await ProductHandler.createNewProduct( req.body )).getRecord });

        } catch ( err ) {

            res.boom.preconditionFailed( err.toString() );

        }

    }

    listProductsAction = async(  req, res ) => {
        try{

            let list = await ProductHandler.listAllProducts( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getAdminRecord );

            });

            res.json({ message: "Products list fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }

    listStaticProductsAction = async( req, res ) => {
        try{

            let list = await ProductHandler.listStaticProducts( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getRecord );

            });

            res.json({ message: "Products list fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }


    listSubscriptionProductsAction = async( req, res ) => {
        try{

            let list = await ProductHandler.listSubscriptionProducts( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getRecord );

            });

            res.json({ message: "Products list fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }
}


export default new ProductController();
