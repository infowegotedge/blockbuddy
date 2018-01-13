import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class CompanyHandler {
    
    getCompanyInfo = async(companyCode, transaction = null) => {

        let company = await postgres.Company.findOne( { where: {companyCode}, transaction , order: [['updatedAt', 'DESC']]} );

        if (_.isNull(company) ) {
            throw new Error("Company not found");
        }

        return company;
    }

    getCompanyInfoByName = async(companyName, transaction = null) => {

        let company = await postgres.Company.findOne( { where: {companyName}, transaction , order: [['updatedAt', 'DESC']]} );

        if (_.isNull(company) ) {
            throw new Error("Company not found");
        }

        return company;
    }
    
    getCompanyAllInfo = async(companyCode, transaction = null) => {

        let company = await postgres.Company.findOne( { where: {companyCode}, transaction, order: [['updatedAt', 'DESC']] } );

        if (_.isNull(company) ) {
            throw new Error("Company not found");
        }

        return company;
    }

    createCompany = async( payload, transaction = null) => {

        let company = await postgres.Company.create({
            companyID: AppConfig.companyID + randomstring.generate(),
            companyCode: payload.companyCode,
            companyName: payload.companyName,
            companyShortDescription: payload.companyShortDescription,
            companyLongDescription: payload.companyLongDescription,
            companyAddress: payload.companyAddress,
            companyURL: payload.companyURL,
            companyEmail: payload.companyEmail,
            companyContactNumber: payload.companyContactNumber,
            companyMeta: payload.companyMeta,
            isActive: payload.isActive,
            isApproved: payload.isApproved
        }, { transaction });

        return company;
        
    }

    updateCompany = async(companyCode, payload, transaction = null) => {
        return await postgres.Company.update(
            {
                companyName: payload.companyName,
                companyShortDescription: payload.companyShortDescription,
                companyLongDescription: payload.companyLongDescription,
                companyAddress: payload.companyAddress,
                companyURL: payload.companyURL,
                companyEmail: payload.companyEmail,
                companyContactNumber: payload.companyContactNumber,
                companyMeta: payload.companyMeta
            },
            {
                where: {
                    companyCode
                },
                transaction
            }
        );
    }

    disableCompany = async(companyCode, transaction = null) => {
        return await postgres.Company.update(
            {
                isActive: false
            },
            {
                where: {
                    companyCode
                },
                transaction
            }
        );
    }

    enableCompany = async(companyCode, transaction = null) => {
        return await postgres.Company.update(
            {
                isActive: true
            },
            {
                where: {
                    companyCode
                },
                transaction
            }
        );
    }
    

    listAllCompany = async(page = 1, limit = AppConfig.defaultListSize,  transaction = null) => {
        
        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        let query = {
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        };

        return await postgres.Company.findAndCount( query );
    }
    
    listActiveCompany = async(page = 1, limit = AppConfig.defaultListSize,  transaction = null) => {
        
        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        let query = {
            where: {
                isActive: true
            },
            offset,
            limit,
            transaction,
            order: [['updatedAt', 'DESC']]
        };

        return await postgres.Company.findAndCount( query );
    }
    
}


export default new CompanyHandler();
