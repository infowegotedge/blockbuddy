import _ from "lodash";

const postgres = require('../models').postgres;
const sequelize = require('../models/postgres/index').sequelize;

class ExchangeCoinReportController {

    getPast100RecordsByCompanyCodeAction = async ( req, res ) => {

        try{

            let list = await postgres.ExchangeLog.listPast100RecordsByCompanyCode( req.query.companyCode );

            let meta = await postgres.ExchangeLog.find({
                where: {
                    companyCode: req.query.companyCode
                },
                attributes: [
                    [sequelize.fn('MIN', sequelize.col('unitPrice')), "minimum"],
                    [sequelize.fn('MAX', sequelize.col('unitPrice')), "maximum"],
                    [sequelize.fn('AVG', sequelize.col('unitPrice')), "average"]
                ]
            });

            meta = meta.dataValues;

            let _data = [];

            _.forEach( list.rows , function( item ) {

                let record = item.getRecord;

                _data.push( record );

            });

            res.json({
                message: "Recent exchange report",
                data: _data,
                stats: meta,
                currentPage: (( req.query.page ) ?  req.query.page : 1 ),
                count: list.count
            });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
        
    }

    getRecordsByKeywordAndCompanyCodeAction = async ( req, res ) => {

        try{

            res.json({
                message: "Custom exchange report",
                data: await postgres.ExchangeAggregationLog.search( 
                    req.query.companyCode,
                    req.query.filterKeyword,
                    req.query.page,
                    req.query.limit 
                )
            });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }

    }
    
}


export default new ExchangeCoinReportController();
