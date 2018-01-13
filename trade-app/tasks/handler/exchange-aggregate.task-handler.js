const postgres = require('../../models').postgres;

const sequelize = require('../../models/postgres/index').sequelize;

import moment from 'moment';

class ExchangeAggregateTaskHandler {

    _processExchnageLogFor15MinCycle = async ( aggregationType, companyPayload ) => {

        let query = {
            where: {
                companyCode: companyPayload.companyCode
            },
            attributes: [
                [sequelize.fn('MIN', sequelize.col('unitPrice')), "minimum"],
                [sequelize.fn('MAX', sequelize.col('unitPrice')), "maximum"],
                [sequelize.fn('AVG', sequelize.col('unitPrice')), "average"]
            ]
        };

        query.where.createdAt = {
            $gte: moment().subtract(15, 'm').toISOString(),
            $lte: moment().toISOString()
        };

        let summary = await postgres.ExchangeLog.find( query );

        summary = summary.dataValues;

        if ( summary.average || summary.minimum || summary.maximum ) {

            let newLog = await postgres.ExchangeAggregationLog.createLog({
                companyID: companyPayload.companyID,
                companyCode:  companyPayload.companyCode,
                companyName: companyPayload.companyName,
                aggregationType,
                average: summary.average,
                minimum: summary.minimum,
                maximum: summary.maximum
            });

            console.log("LOG :: Stock Aggregation for Company [" + companyPayload.companyCode +"] with Aggregation Timeline of " + aggregationType + ". Record ID : " + newLog.exchangeAggregationLogID);

        } else {

            console.log("LOG :: Stock Aggregation for Company [" + companyPayload.companyCode +"] with Aggregation Timeline of " + aggregationType + " is skipped due to absence of data");

        }

    }


    _processExchnageLogForDifferentCycles = async ( referenceCycleType, cycleType, companyPayload ) => {

        let cycleTypeParam = '';

        let aggregationType = cycleType;

        switch( cycleType ) {
            case "60MIN":
                cycleTypeParam = moment().subtract(60, 'm').toISOString();
                break;
            case "1DAY":
                cycleTypeParam = moment().subtract(1, 'd').toISOString();
                break;
            case "2DAY":
                cycleTypeParam = moment().subtract(2, 'd').toISOString();
                break;
            case "3DAY":
                cycleTypeParam = moment().subtract(3, 'd').toISOString();
                break;
            case "1WEEK":
                cycleTypeParam = moment().subtract(1, 'w').toISOString();
                break;
            case "1MONTH":
                cycleTypeParam = moment().subtract(1, 'M').toISOString();
                break;
        }

        let query = {
            where: {
                companyCode: companyPayload.companyCode,
                aggregationType: referenceCycleType
            },
            attributes: [
                [sequelize.fn('MIN', sequelize.col('average')), "minimum"],
                [sequelize.fn('MAX', sequelize.col('average')), "maximum"],
                [sequelize.fn('AVG', sequelize.col('average')), "average"]
            ]
        };

        query.where.createdAt = {
            $gte: cycleTypeParam,
            $lte: moment().toISOString()
        };

        let summary = await postgres.ExchangeAggregationLog.find( query );

        summary = summary.dataValues;

        if ( summary.average || summary.minimum || summary.maximum ) {

            //Populate trend data as well
            query.attributes = [
                'average',
                'updatedAt'
            ];
            query.order = [['updatedAt', 'DESC']];

            let list = await postgres.ExchangeAggregationLog.findAll( query );

            let rows = [];
            for ( let i = 0; i < list.length; i++  ) {

                rows.push( { unitPrice: list[i].average, updatedAt: list[i].updatedAt } );

            }

            let newLog = await postgres.ExchangeAggregationLog.createLog({
                companyID: companyPayload.companyID,
                companyCode:  companyPayload.companyCode,
                companyName: companyPayload.companyName,
                aggregationType: cycleType,
                average: summary.average,
                minimum: summary.minimum,
                maximum: summary.maximum,
                trendData: { rows }
            });

            console.log("LOG :: Stock Aggregation for Company [" + companyPayload.companyCode +"] with Aggregation Timeline of " + aggregationType + ". Record ID : " + newLog.exchangeAggregationLogID);

        } else {

            console.log("LOG :: Stock Aggregation for Company [" + companyPayload.companyCode +"] with Aggregation Timeline of " + aggregationType + " is skipped due to absence of data");

        }

    }

    processExchangeLog = async ( aggregationType, companyPayload ) => {

        let _self = this;

        if ( aggregationType == '15MIN' ) {

            _self._processExchnageLogFor15MinCycle( aggregationType, companyPayload );

        }

        if ( aggregationType == '60MIN' ) {

            _self._processExchnageLogForDifferentCycles( "15MIN", aggregationType, companyPayload );

        }

        if ( aggregationType == '1DAY' ) {

            _self._processExchnageLogForDifferentCycles( "60MIN", aggregationType, companyPayload );

        }

        if ( aggregationType == '2DAY' ) {

            _self._processExchnageLogForDifferentCycles( "60MIN", aggregationType, companyPayload );

        }

        if ( aggregationType == '3DAY' ) {

            _self._processExchnageLogForDifferentCycles( "60MIN", aggregationType, companyPayload );

        }

        if ( aggregationType == '1WEEK' ) {

            _self._processExchnageLogForDifferentCycles( "1DAY", aggregationType, companyPayload );

        }

        if ( aggregationType == '1MONTH' ) {

            _self._processExchnageLogForDifferentCycles( "1DAY", aggregationType, companyPayload );

        }

    }

}


export default ExchangeAggregateTaskHandler;