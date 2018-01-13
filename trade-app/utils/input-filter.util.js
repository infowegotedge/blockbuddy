import _ from 'lodash';

import AppConfig from '../config/app-config';

const InputFilter = {

    sanitiseTotal: function ( total ) {

        total = parseFloat( total );

        if ( !_.isFinite( total ) || total < 0 )  {
            throw new Error("Invalid total value");
        }

        return total;
    },

    sanitiseInteger: function ( total ) {

        total = parseInt( total );

        if ( !_.isFinite( total ) || total < 0 )  {
            throw new Error("Invalid integer value");
        }

        return total;
    },

    sanitiseRealNumber: function ( total ) {

        total = parseFloat( total );

        if ( !_.isFinite( total ) || total < 0 )  {
            throw new Error("Invalid double value");
        }

        return total;
    },

    sanitiseLedgerLogPayload: function( payload ) {

        let _self = this;

        if ( _self.validatePayload( payload ) ) {

            payload.total = _self.sanitiseTotal( payload.total );

            if (
                !_.isString( payload.to ) || _.isEmpty( payload.to ) || _.trim( payload.to ) == "" ||
                !_.isString( payload.from ) || _.isEmpty( payload.from ) || _.trim( payload.from ) == "" ||
                !_.isString( payload.note ) || _.isEmpty( payload.note ) || _.trim( payload.note ) == "" ||
                ( payload.to == payload.from )
            ) {
                throw new Error( "Invalid log params" );
            }

            return payload;

        }

    },

    sanitiseTransactionType: function ( transactionType ) {

        if ( _.isNull( transactionType ) ||
            _.isUndefined( transactionType ) ||
            !_.isString( transactionType ) ||
            _.isEmpty( transactionType ) ||
            _.trim(transactionType) == "" ||
            !_.includes( AppConfig.transactionType , transactionType ) )  {
            throw new Error("Invalid transactionType");
        }

        return transactionType;

    },

    validatePayload: function ( payload ) {

        if ( !_.isObject( payload ) || _.isEmpty( payload )  )  {

            throw new Error("Invalid payload");

        }

        return true;
    },

    sanitiseTraderID: function ( traderID ) {

        if (  _.isNull( traderID ) ||
            _.isUndefined( traderID ) ||
            !_.isString( traderID ) ||
            _.isEmpty( traderID ) ||
            _.trim(traderID) == "" ||
            !( /^TRADER-*/.test( traderID ) ) )  {
            throw new Error("Invalid traderID");
        }

        return traderID;
    },

    sanitiseOfferID: function ( offerID ) {

        if (  _.isNull( offerID ) ||
            _.isUndefined( offerID ) ||
            !_.isString( offerID ) ||
            _.isEmpty( offerID ) ||
            _.trim(offerID) == "" ||
            !( /^OFFER-*/.test( offerID ) ) )  {
            throw new Error("Invalid offerID");
        }

        return offerID;
    },

    sanitiseCompanyID: function ( companyID ) {

        if (  _.isNull( companyID ) ||
            _.isUndefined( companyID ) ||
            !_.isString( companyID ) ||
            _.isEmpty( companyID ) ||
            _.trim(companyID) == "" ||
            !( /^COMPANY-*/.test( companyID ) ) )  {
            throw new Error("Invalid companyID");
        }

        return companyID;
    },

    sanitiseTraderUserName: function ( userName ) {

        if ( _.isNull( userName ) ||
            _.isUndefined( userName ) ||
            !_.isString( userName ) ||
            _.isEmpty( userName ) ||
            _.trim(userName) == "" )  {
            throw new Error("Invalid userName");
        }

        return (userName).toLowerCase();
    },

    sanitiseCompanyCode: function ( companyCode ) {

        if ( _.isNull( companyCode ) ||
            _.isUndefined( companyCode ) ||
            !_.isString( companyCode ) ||
            _.isEmpty( companyCode ) ||
            _.trim(companyCode) == "" )  {
            throw new Error("Invalid companyCode");
        }

        return (companyCode).toUpperCase();
    },

    sanitiseExchangeFilterKeyword: function ( keyword ) {

        if ( _.isNull( keyword ) ||
            _.isUndefined( keyword ) ||
            !_.isString( keyword ) ||
            _.isEmpty( keyword ) ||
            _.trim(keyword) == "" )  {
            throw new Error("Invalid filter keyword");
        }

        return (keyword).toUpperCase();
    },

    sanitiseListParams: function ( page, limit ) {

        if (
            _.isNull( page ) || _.isUndefined( page ) ||
            _.isNull( limit ) || _.isUndefined( limit )) {
            throw new Error("Invalid query params");
        }

        page = parseInt( page );
        limit = parseInt( limit );

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        if (!_.isFinite(page) ||
            !_.isFinite(limit) ||
            limit > 100 ||
            limit <= 0 ||
            page <= 0) {
            throw new Error("Invalid query params");
        }

        return {
            page,
            limit,
            offset
        };

    },

}


export default InputFilter;