import AppConfig from '../../config/app-config'

import InputFilter from '../../utils/input-filter.util';

import moment from 'moment';

import _ from "lodash";

const uuidv4 = require('uuid/v4');

module.exports = function(sequelize, DataTypes) {

    var ExchangeAggregationLog = sequelize.define('ExchangeAggregationLog', {

        exchangeAggregationLogID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'ID must be unique.'
            },
            primaryKey: true
        },

        companyID: {
            type: DataTypes.STRING,
            allowNull: false
        },

        companyCode: {
            type: DataTypes.STRING,
            allowNull: false
        },

        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        aggregationType: {
            type: DataTypes.ENUM,
            values: AppConfig.aggregationType
        },

        average: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },

        minimum: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },

        maximum: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },

        trendData: {
            type: DataTypes.JSON
        },

        date: {
            type: DataTypes.STRING,
            allowNull: false
        },

        month: {
            type: DataTypes.STRING,
            allowNull: false
        },

        year: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        },
        hooks: {

        },

        getterMethods: {

            getRecord() {
                return {
                    exchangeAggregationLogID: this.exchangeAggregationLogID,
                    companyCode: this.companyCode,
                    companyName: this.companyName,
                    aggregationType: this.aggregationType,
                    average: this.average,
                    minimum: this.minimum,
                    maximum: this.maximum,
                    trendData: this.trendData,
                    updatedAt: this.updatedAt
                }
            },

            getAdminRecord() {
                return {
                    exchangeAggregationLogID: this.exchangeAggregationLogID,
                    companyCode: this.companyCode,
                    companyName: this.companyName,
                    aggregationType: this.aggregationType,
                    average: this.average,
                    minimum: this.minimum,
                    maximum: this.maximum,
                    trendData: this.trendData,
                    updatedAt: this.updatedAt
                }
            }

        }

    });



    //CLASS LEVEL METHODS -----------------------------------------------

    /**
     * Create aggregation report, classified on the basis of aggregationType
     * Its a task driven function
     * @param payload {Object} Log Payload
     * @param transaction {Object} optional transaction object
     * @returns {{log:{}}}
     */
    ExchangeAggregationLog.createLog = async function (payload, transaction = null) {

        InputFilter.validatePayload( payload );

        let isoStr = moment().toISOString();

        return await ExchangeAggregationLog.create(
            {
                exchangeAggregationLogID: AppConfig.tableKey.ExchangeAggregationLog + uuidv4(),
                companyID: payload.companyID,
                companyCode:  InputFilter.sanitiseCompanyCode(payload.companyCode),
                companyName: payload.companyName,
                aggregationType: payload.aggregationType,
                average: InputFilter.sanitiseRealNumber(payload.average),
                minimum: InputFilter.sanitiseRealNumber(payload.minimum),
                maximum: InputFilter.sanitiseRealNumber(payload.maximum),
                trendData: payload.trendData,
                date:  moment( isoStr ).format('YYYY-MM-DD'),
                month: moment( isoStr ).format('MMMM'),
                year:  moment( isoStr ).format('YYYY')
            },
            {transaction}
        );

    };


    /**
     * Search for a stock reports based on search keywords and company code
     * Its a task driven function
     *
     * @param companyCode {String} Company Code
     * @param filterKeyword="15MIN", "60MIN", "1DAY", '2DAY', '3DAY', "1WEEK", "1MONTH" {String=} Search Filter
     * @param page {Number} optional Page Number
     * @param limit {Number} optional Page Number
     * @param transaction {Object} optional transaction object
     * @returns {{count: Integer, rows: []}}
     */
    ExchangeAggregationLog.search = async function ( companyCode, filterKeyword, page = 1, limit = AppConfig.defaultListSize, transaction = null) {

        companyCode = InputFilter.sanitiseCompanyCode( companyCode );

        filterKeyword = InputFilter.sanitiseExchangeFilterKeyword( filterKeyword );

        let params = InputFilter.sanitiseListParams( page, limit );

        page = params.page;
        limit = params.limit;
        let offset = params.offset;

        if ( _.indexOf(AppConfig.aggregationType, filterKeyword) < 0 ) {
            throw new Error("Invalid aggregation type");
        }

        let query = {
            where: {
                companyCode
            },
            offset,
            limit,
            attribute:[
                "companyCode",
                "companyName",
                "aggregationType",
                "trendData",
                "average",
                "minimum",
                "maximum",
                "updatedAt"
            ],
            order: [['updatedAt', 'ASC']],
            transaction
        };

        //When Keyword is 1DAY -> Through out data for filtered by 15MIN, from startTimeStamp (Now - 1day) to endTimeStamp(Now)
        if ( filterKeyword == "1DAY" ) {
            query.where.aggregationType = "60MIN";
            query.where.createdAt = {
                $lte: moment().toISOString(),
                $gte: moment().subtract(1, 'd').toISOString()
            };
        }

        //When Keyword is 2DAY -> Through out data for filtered by 60MIN, from startTimeStamp (Now - 2day) to endTimeStamp(Now)
        if ( filterKeyword == "2DAY" ) {
            query.where.aggregationType = "60MIN";
            query.where.createdAt = {
                $lte: moment().toISOString(),
                $gte: moment().subtract(2, 'd').toISOString()
            };
        }

        //When Keyword is 3DAY -> Through out data for filtered by 60MIN, from startTimeStamp (Now - 3day) to endTimeStamp(Now)
        if ( filterKeyword == "3DAY" ) {
            query.where.aggregationType = "60MIN";
            query.where.createdAt = {
                $lte: moment().toISOString(),
                $gte: moment().subtract(3, 'd').toISOString()
            };
        }

        //When Keyword is 1WEEK -> Through out data for filtered by 1DAY, from startTimeStamp (Now - 6day) to endTimeStamp(Now)
        if ( filterKeyword == "1WEEK" ) {
            query.where.aggregationType = "1DAY";
            query.where.createdAt = {
                $lte: moment().toISOString(),
                $gte: moment().subtract(7, 'd').toISOString()
            };
        }

        //When Keyword is 1MONTH -> Through out data for filtered by 1DAY, for current month & for current year
        if ( filterKeyword == "1MONTH" ) {
            let isoStr = moment().toISOString();
            query.where.aggregationType = "1DAY";
            query.where.month = moment( isoStr ).format('MMMM');
            query.where.year = moment( isoStr ).format('YYYY');
        }

        //@TODO Custom Interval

        return await ExchangeAggregationLog.findAndCount( query );

    };




    return ExchangeAggregationLog;
};