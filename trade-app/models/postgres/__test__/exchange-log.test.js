import {postgres} from '../../../models/index';

import moment from 'moment';

import faker from 'faker';

describe('ExchangeLog Model Test Suite', async() => {

    beforeAll( async() => {

        let testPayload = {
            companyCode: "test company",
            companyName: "Test",
            companyShortDescription: "ABcd sadcfa afwep;goujdlvkhsld asd ahd ashd as"
        };

        let company = await postgres.Company.createCompany( testPayload );

        testPayload.companyCode =  "test company1";
        company = await postgres.Company.createCompany( testPayload );

    });


    describe('Test model function : createLog', async() => {

        test('CASE: payload -> undefined', async() => {

            try{

                let log = await postgres.ExchangeLog.createLog();

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid payload");

            }

        });

        test('CASE: payload -> null', async() => {

            try{

                let log = await postgres.ExchangeLog.createLog(null);

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid payload");

            }

        });

        test('CASE: payload -> {}', async() => {

            try{

                let log = await postgres.ExchangeLog.createLog({});

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid payload");

            }

        });

        test('CASE: payload -> ""', async() => {

            try{

                let log = await postgres.ExchangeLog.createLog("");

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid payload");

            }

        });

        test('CASE: payload -> invalid companyID', async() => {

            try{

                let log = await postgres.ExchangeLog.createLog({offerID: "OFFER_ADAS-12121", companyID: "asAsasasa", companyCode: "Allies", companyName: "Allies Interactive", unitPrice: "3213123", numberOfShares: 1213112});

            } catch( err ) {

                expect( err.toString() ).toBe('SequelizeForeignKeyConstraintError: insert or update on table \"ExchangeLogs\" violates foreign key constraint \"ExchangeLogs_companyID_fkey\"');

            }

        });

        test('CASE: payload -> invalid unitPrice', async() => {

            try{

                let log = await postgres.ExchangeLog.createLog({offerID: "OFFER_ADAS-12121", companyID: "asAsasasa", companyCode: "Allies", companyName: "Allies Interactive", unitPrice: "-3213123", numberOfShares: 1213112});

            } catch( err ) {

                expect( err.toString() ).toBe('Error: Invalid double value');

            }

        });

        test('CASE: payload -> invalid numberOfShares', async() => {

            try{

                let log = await postgres.ExchangeLog.createLog({offerID: "OFFER_ADAS-12121", companyID: "asAsasasa", companyCode: "Allies", companyName: "Allies Interactive", unitPrice: 213.123, numberOfShares: "asdf"});

            } catch( err ) {

                expect( err.toString() ).toBe('Error: Invalid integer value');

            }

        });

        test('CASE: payload -> valid payload', async() => {

            let company = await postgres.Company.getByCode( "TEST-COMPANY" );

            let log = await postgres.ExchangeLog.createLog({
                offerID: "OFFER-1123123dscvasxc2121",
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                unitPrice: 213.123,
                numberOfShares: "120.36as"
            });

            expect( log.exchangeLogID ).toMatch(/^EXCH_LOG-.*/);
            expect( log.offerID ).toMatch(/^OFFER-.*/);
            expect( log.companyID ).toMatch(/^COMPANY-.*/);

            expect( log.companyCode ).toBeDefined();
            expect( log.companyName ).toBeDefined();
            expect( log.unitPrice ).toBeDefined();
            expect( log.numberOfShares ).toBeDefined();
            expect( log.updatedAt ).toBeDefined();
            expect( log.createdAt ).toBeDefined();

        });

    });

    describe('Test model function : listPast100Records', async() => {

        beforeAll( async() => {

            let company = await postgres.Company.getByCode( "TEST-COMPANY" );

            let log = await postgres.ExchangeLog.createLog({
                offerID: "OFFER-RAHuLuL1123123adfasdf23111",
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                unitPrice: 21312.123,
                numberOfShares: "121"
            });

            log = await postgres.ExchangeLog.createLog({
                offerID: "OFFER-RAHuL11231231111%55dscv443asxc2121",
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                unitPrice: 1231313,
                numberOfShares: 395.5
            });

        });

        test('CASE: list past record', async() => {

            let list = await postgres.ExchangeLog.listPast100Records();

            expect( list.rows[0].exchangeLogID ).toMatch(/^EXCH_LOG-.*/);
            expect( list.rows[0].offerID ).toMatch(/^OFFER-.*/);
            expect( list.rows[0].companyID ).toMatch(/^COMPANY-.*/);

            expect( list.rows[0].companyCode ).toBeDefined();
            expect( list.rows[0].companyName ).toBeDefined();
            expect( list.rows[0].unitPrice ).toBeDefined();
            expect( list.rows[0].numberOfShares ).toBeDefined();
            expect( list.rows[0].updatedAt ).toBeDefined();
            expect( list.rows[0].createdAt ).toBeDefined();

            expect( list.count ).toBeDefined();
            expect( list.rows ).toBeDefined();

        });


        afterAll( async() => {

            let deleted = await postgres.ExchangeLog.destroy({
                where: {
                    offerID: {
                        $like: 'OFFER-RAHuL%'
                    }
                }
            });

        });

    });

    describe('Test model function : listRecordsByDateRangeAndCompanyCode', async() => {

        beforeAll( async() => {

            let company = await postgres.Company.getByCode( "TEST-COMPANY" );

            let log = await postgres.ExchangeLog.createLog({
                offerID: "OFFER-RAHuLuL1123123adfasdf23111",
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                unitPrice: 21312.123,
                numberOfShares: "121"
            });

            log = await postgres.ExchangeLog.createLog({
                offerID: "OFFER-RAHuL11231231111%55dscv443asxc2121",
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                unitPrice: 1231313,
                numberOfShares: 395.5
            });

            log = await postgres.ExchangeLog.createLog({
                offerID: "OFFER-RAHuL11231231111%11155dscv443asxc2121",
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                unitPrice: 1231313,
                numberOfShares: 395.5
            });

        });

        test('CASE: companyCode -> valid | startTimeStamp -> invalid | endTimeStamp -> invalid', async() => {

            try {

                let list = await postgres.ExchangeLog.listRecordsByDateRangeAndCompanyCode("TEST-COMPANY",  "Disco", "Dancer" );

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid ISO format");

            }

        });



        test('CASE: empty response', async() => {

            let list = await postgres.ExchangeLog.listRecordsByDateRangeAndCompanyCode("TEST-COMPANY",   moment().subtract(20, 'm').toISOString(),  moment().subtract(10, 'm').toISOString());

            expect( list.count ).toBeDefined();
            expect( list.count ).toBe(0);
            expect( list.rows ).toBeDefined();
            expect( list.rows ).toHaveLength(0);

        });


        test('CASE: list past record', async() => {

            let list = await postgres.ExchangeLog.listRecordsByDateRangeAndCompanyCode("TEST-COMPANY",   moment().subtract(10, 'm').toISOString(), moment().toISOString() );

            expect( list.rows[0].exchangeLogID ).toMatch(/^EXCH_LOG-.*/);
            expect( list.rows[0].offerID ).toMatch(/^OFFER-.*/);
            expect( list.rows[0].companyID ).toMatch(/^COMPANY-.*/);

            expect( list.rows[0].companyCode ).toBeDefined();
            expect( list.rows[0].companyName ).toBeDefined();
            expect( list.rows[0].unitPrice ).toBeDefined();
            expect( list.rows[0].numberOfShares ).toBeDefined();
            expect( list.rows[0].updatedAt ).toBeDefined();
            expect( list.rows[0].createdAt ).toBeDefined();

            expect( list.count ).toBeDefined();
            expect( list.rows ).toBeDefined();

        });


        afterAll( async() => {

            let deleted = await postgres.ExchangeLog.destroy({
                where: {
                    offerID: {
                        $like: 'OFFER-RAHuL%'
                    }
                }
            });

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