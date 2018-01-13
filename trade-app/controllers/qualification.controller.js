import _ from 'lodash';

import AppConfig from '../config/app-config';

import QualificationHandler from '../handler/qualification.handler'

class QualificationController {

    getQualificationAction = async(  req, res ) => {

        try{

            res.json({ message: "Qualification Fetched", data: (await QualificationHandler.getQualification( req.params.code )).getRecord })

        } catch ( err ) {

            res.boom.notFound('No record found');

        }

    }

    updateQualificationAction = async(  req, res ) => {

        try{

            await QualificationHandler.updateQualification( req.params.code , req.body );
            res.json({ message: "Qualification updated" });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }
    
    disableQualificationAction = async(  req, res ) => {

        try{

            await QualificationHandler.disableQualificationByCode( req.params.code );
            res.json({ message: "Qualification Disabled" });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }

    createNewQualificationAction = async(  req, res ) => {

        try{

            res.json({ message: "New Qualification created", data: ( await QualificationHandler.createNewQualification( req.body ) ).getRecord });

        } catch ( err ) {

            res.boom.preconditionFailed( err.toString() );

        }

    }

    listActiveQualificationsAction = async(  req, res ) => {
        try{

            let list = await QualificationHandler.listActiveQualifications( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows, function( item ) {

                _data.push( item.getRecord );

            });

            res.json({ message: "Active Qualifications fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }

    listQualificationAction = async(  req, res ) => {
        try{

            let list = await QualificationHandler.listAllQualification( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getAdminRecord );

            });

            res.json({ message: "Qualifications fetched", data: _data , count: list.count, currentPage: (( req.query.page ) ? 1 : req.query.page) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }
    
    
}


export default new QualificationController();
