import _ from 'lodash';

import AppConfig from '../config/app-config';

import CompensationHandler from '../handler/compensation.handler';

class CompensationController {

    getCompensationAction = async( req, res ) => {

        try{

            res.json({ message: "Compensation Plan Record Fetched", data: (await CompensationHandler.getCompensationPlan( req.params.compensationID )).getRecord })

        } catch ( err ) {

            res.boom.notFound('No record found');

        }

    }

    disableCompensationAction = async(  req, res ) => {

        try{

            await CompensationHandler.disableCompensationPlan( eq.params.compensationID );

            res.json({ message: "Compensation Disabled" });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }

    createNewCompensationAction = async(  req, res ) => {

        try{

            res.json({ message: "New Compensation created", data: ( await CompensationHandler.createNewCompensation( req.body ) ).getRecord });

        } catch ( err ) {

            res.boom.preconditionFailed( err.toString() );

        }

    }

    listActiveCompensationAction = async(  req, res ) => {
        try{

            let list = await CompensationHandler.listActiveCompensation( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getRecord );

            });

            res.json({ message: "Active Compensation list fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }

    listAllCompensationAction = async(  req, res ) => {
        try{

            let list = await CompensationHandler.listAllCompensation( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getAdminRecord );

            });

            res.json({ message: "Compensation list fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }

}


export default new CompensationController();
