import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

const uuidv4 = require('uuid/v4');

class CBSController {
    
   getCentralBankRecord = async( centralLedgerID ) => {

       let centralBankLedger =  await postgres.CentralBankLedger.findOne({ where: { centralLedgerID } });

       if ( _.isNull( centralBankLedger ) || _.isEmpty( centralBankLedger ) ) {
           throw new Error( "Record not found" );
       }

       return centralBankLedger;
   }
    
   createCBSRecord = async( payload, transaction = null ) => {

       let centralBank = await postgres.CBSLedger.create({
           mode: payload.mode,
           exchangedCommodity: payload.exchangedCommodity,
           total: payload.total,
           notes: payload.notes
       },{transaction});

       return centralBank;
   }


    listCBSRecord  = async( page = 1, limit = AppConfig.defaultListSize ) => {
       let offset = 0;

       if ( page > 1 ) {
           offset = (page - 1) * limit;
       }

       return await postgres.CBSLedger.findAll({ offset, limit });
   }
    
    //====== Routes Action ========================================================

    listCBSRecordAction = async ( req, res ) => {

        try{

            res.status(201).json({
                message: "CBS Record list",
                data: await this.listCBSRecord( req.query.page,  req.query.limit )
            })

        } catch ( err ) {
            res.boom.badRequest( err.toString() );
        }

    }

}


export default new CBSController();
