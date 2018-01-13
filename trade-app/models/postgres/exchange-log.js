import AppConfig from '../../config/app-config'

import InputFilter from '../../utils/input-filter.util';

const uuidv4 = require('uuid/v4');

module.exports = function(sequelize, DataTypes) {

    var ExchangeLog = sequelize.define('ExchangeLog', {

        exchangeLogID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'ID must be unique.'
            },
            primaryKey: true
        },

        offerID: {
            type: DataTypes.STRING,
            allowNull: false
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

        unitPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },

        numberOfShares: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
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
                    exchangeLogID: this.exchangeLogID,
                    companyCode: this.companyCode,
                    companyName: this.companyName,
                    unitPrice: this.unitPrice,
                    numberOfShares: this.numberOfShares,
                    updatedAt: this.updatedAt
                }
            },

            getAdminRecord() {
                return {
                    exchangeLogID: this.exchangeLogID,
                    offerID: this.offerID,
                    companyCode: this.companyCode,
                    companyName: this.companyName,
                    unitPrice: this.unitPrice,
                    numberOfShares: this.numberOfShares,
                    updatedAt: this.updatedAt
                }
            }

        }

    });



    //CLASS LEVEL METHODS -----------------------------------------------

    /**
     * Create a new exchange log for a company when a trade offer is accept and closed
     * @param payload {Object}
     * @param transaction {Object} optional transaction object
     * @returns {{log: {}}}
     */
    ExchangeLog.createLog = async function (payload, transaction = null) {

        InputFilter.validatePayload( payload );

        return await ExchangeLog.create(
            {
                exchangeLogID: AppConfig.tableKey.ExchangeLog + uuidv4(),
                offerID: payload.offerID,
                companyID: payload.companyID,
                companyCode: payload.companyCode,
                companyName: payload.companyName,
                unitPrice: InputFilter.sanitiseRealNumber(payload.unitPrice),
                numberOfShares: InputFilter.sanitiseInteger(payload.numberOfShares)
            },
            {transaction}
        );

    };

    /**
     * List stock report sorted from latest to old data
     * @param transaction {Object} optional transaction object
     * @returns {{count: Integer, rows: []}}
     */
    ExchangeLog.listPast100Records = async function (transaction = null) {

        let query = {
            limit: AppConfig.defaultListSize,
            order: [['updatedAt', 'ASC']],
            transaction
        };

        return await ExchangeLog.findAndCount( query );

    };


    /**
     * List stock report records filter by company code and sorted from latest to old data
     * @param companyCode
     * @param transaction {Object} optional transaction object
     * @returns {{count: Integer, rows: []}}
     */
    ExchangeLog.listPast100RecordsByCompanyCode = async function (companyCode, transaction = null) {

        companyCode = InputFilter.sanitiseCompanyCode( companyCode );

        let query = {
            where: {
                companyCode
            },
            limit: AppConfig.defaultListSize,
            order: [['updatedAt', 'ASC']],
            transaction
        };

        return await ExchangeLog.findAndCount( query );

    };


    /**
     * List Stock Price report by company code and filtered by start and end timestamp
     * @param companyCode {String} ISO String
     * @param startTimeStamp {String} ISO String
     * @param endTimeStamp {String} ISO String
     * @param page {Number} optional Page Number
     * @param limit {Number} optional Page Number
     * @param transaction {Object} optional transaction object
     * @returns {{count: Integer, rows: []}}
     */
    ExchangeLog.listRecordsByDateRangeAndCompanyCode = async function (companyCode, startTimeStamp, endTimeStamp, page = 1, limit = AppConfig.defaultListSize, transaction = null) {

        companyCode = InputFilter.sanitiseCompanyCode( companyCode );

        //Seems to get sanitising job done :-)
        startTimeStamp = InputFilter.sanitiseCompanyCode( startTimeStamp );
        endTimeStamp = InputFilter.sanitiseCompanyCode( endTimeStamp );

        let params = InputFilter.sanitiseListParams( page, limit );

        page = params.page;
        limit = params.limit;
        let offset = params.offset;

        if ( !moment(startTimeStamp).isValid() || !moment(endTimeStamp).isValid() ) {
            throw new Error("Invalid ISO format");
        }

        let query = {
            where: {
                companyCode,
                createdAt: {
                    $gte: startTimeStamp,
                    $lte: endTimeStamp
                }
            },
            offset,
            limit,
            order: [['updatedAt', 'ASC']],
            transaction
        };

        return await ExchangeLog.findAndCount( query );

    };


    return ExchangeLog;
};