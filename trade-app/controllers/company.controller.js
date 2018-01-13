import _ from 'lodash';

import AppConfig from '../config/app-config';

import CompanyHandler from '../handler/company.handler'

import CompanyLaunchTransaction from '../transaction/company-launch';

class CompanyController {

    createCompanyAction = async(req, res) => {

        try {

            res.json({
                message: "Company created successfully",
                data: await CompanyHandler.createCompany(req.body)
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }

    }

    getCompanyInfoAction = async(req, res) => {

        try {

            res.json({
                message: "Company info",
                data: await CompanyHandler.getCompanyInfo(req.params.companyCode)
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }

    }

    updateCompanyAction = async(req, res) => {

        try {

            await CompanyHandler.updateCompany(req.params.companyCode, req.body);

            res.json({
                message: "Company updated successfully"
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }

    }

    disableCompanyAction = async(req, res) => {

        try {

            await CompanyHandler.disableCompany(req.params.companyCode);

            res.json({
                message: "Company disabled successfully"
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }

    }

    enableCompanyAction = async(req, res) => {

        try {

            await CompanyHandler.enableCompany(req.params.companyCode);

            res.json({
                message: "Company enabled successfully"
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }

    }

    listAllCompanyAction = async(req, res) => {

        try {

            let list = await CompanyHandler.listAllCompany( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getRecord );

            });

            res.json({
                message: "Company list generated",
                data: _data,
                count: list.count,
                currentPage: (( req.query.page ) ? 1 : req.query.page)
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }

    }

    listActiveCompany = async(req, res) => {

        try {

            let list = await CompanyHandler.listActiveCompany( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getRecord );

            });

            res.json({
                message: "Company list generated",
                data: _data,
                count: list.count,
                currentPage: (( req.query.page ) ? 1 : req.query.page)
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }

    }

}


export default new CompanyController();
