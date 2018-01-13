import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class StockReportController {
    
    createStockReport = async ( companyCode, companyID, unitPrice, transaction = null ) => {

        return await postgres.StockReport.create(
            {
                stockReportID: AppConfig.stockReportID + randomstring.generate(),
                companyCode,
                companyID,
                unitPrice,
                timestamp: moment().toISOString(),
                day: moment().format('dddd'),
                completeDate: moment().format('DD-MM-YYYY'),
                date: moment().format('DD'),
                month: moment().format('MMMM'),
                monthNumber: moment().format('MM'),
                year: moment().format('YYYY'),
                HH: moment().format('HH'),
                mm: moment().format('mm'),
                ss: moment().format('ss')
            },
            {transaction}
        );
    }
    
    getStockReport = async (page = 1, limit = AppConfig.defaultListSize, transaction = null ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }
        
        return await postgres.StockReport.findAll({ offset, limit , transaction, order: [['updatedAt', 'DESC']] });
        
    }

    getStockReportByCompanyCode = async ( companyCode, page = 1, limit = AppConfig.defaultListSize, transaction = null ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        return await postgres.StockReport.findAll({ where: { companyCode }, offset, limit , order: [['updatedAt', 'DESC']], transaction });

    }

    seedStockReport = async ( payload, transaction = null ) => {

        return await postgres.StockReport.create(
            {
                stockReportID: AppConfig.stockReportID + randomstring.generate(),
                companyCode: payload.companyCode,
                companyID: payload.companyID,
                unitPrice: payload.unitPrice,
                timestamp: payload.timestamp,
                day: payload.day,
                completeDate: payload.completeDate,
                date: payload.date,
                month: payload.month,
                monthNumber: payload.monthNumber,
                year: payload.year,
                HH: payload.HH,
                mm: payload.mm,
                ss: payload.ss
            },
            {transaction}
        );

    }


    //Routes ----------------------------------------------------------------------

    listStockReport = async( req, res ) => {

        try{

            res.json({ message: "Global Stock Report", data : await this.getStockReport( req.query.page, req.query.limit ) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }

    listStockReportByCompanyCode = async( req, res ) => {

        try{

            res.json({ message: "Stock Report", data : await this.getStockReportByCompanyCode( req.params.companyCode, req.query.page, req.query.limit ) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }

}


export default new StockReportController();
