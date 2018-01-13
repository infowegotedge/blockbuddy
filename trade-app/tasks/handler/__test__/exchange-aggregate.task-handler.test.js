import {postgres} from '../../../models/index';

import moment from 'moment';

import faker from 'faker';

import ExchangeAggregateTaskHandler from '../exchange-aggregate.task-handler';

/**
 * Run this task manually. After entry into the DB, manually set createdAt timestamp and run following task
 */

let company = null;

describe.skip('Exchange Aggregation Task Handler Model Test Suite', async() => {

    beforeAll( async() => {

        let testPayload = {
            companyCode: "test company",
            companyName: "Test",
            companyShortDescription: "ABcd sadcfa afwep;goujdlvkhsld asd ahd ashd as"
        };

        company = await postgres.Company.createCompany( testPayload );
        //company = await postgres.Company.getByCode( "TEST-COMPANY" );

        for ( let i = 0 ; i < 15; i ++ ) {
            let log = await postgres.ExchangeLog.createLog({
                offerID: "OFFER-" + faker.finance.bitcoinAddress(),
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                unitPrice: faker.random.number(),
                numberOfShares: faker.random.number()
            });
        }

    });


    describe('Test model function : processExchangeLog', async() => {

        test('CASE: aggregationType -> 15MIN | companyCode -> valid company code', async() => {

            let obj = new ExchangeAggregateTaskHandler( );

            let process = await obj.processExchangeLog( '15MIN', company );

        });

        test('CASE: aggregationType -> 60MIN | companyCode -> valid company code', async() => {

            let obj = new ExchangeAggregateTaskHandler();

            let process = await obj.processExchangeLog( '60MIN', company );

        });

        test('CASE: aggregationType -> 1DAY | companyCode -> valid company code', async() => {

            let obj = new ExchangeAggregateTaskHandler( );

            let process = await obj.processExchangeLog( '1DAY', company );

        });

        test('CASE: aggregationType -> 2DAY | companyCode -> valid company code', async() => {

            let obj = new ExchangeAggregateTaskHandler( );

            let process = await obj.processExchangeLog( '2DAY', company );

        });

        test('CASE: aggregationType -> 3DAY | companyCode -> valid company code', async() => {

            let obj = new ExchangeAggregateTaskHandler( );

            let process = await obj.processExchangeLog( '3DAY', company );

        });

        test('CASE: aggregationType -> 1WEEK | companyCode -> valid company code', async() => {

            let obj = new ExchangeAggregateTaskHandler( );

            let process = await obj.processExchangeLog( '1WEEK', company );

        });

        test('CASE: aggregationType -> 1MONTH | companyCode -> valid company code', async() => {

            let obj = new ExchangeAggregateTaskHandler( );

            let process = await obj.processExchangeLog( '1MONTH', company );

        });

    });

    afterAll( async() => {

        let deletedCompany = await postgres.Company.destroy({
            where: {
                companyCode: {
                    $like: 'TEST-COMPANY%'
                }
            }
        });

    });

});