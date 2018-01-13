import {postgres} from '../../../models/index';

import moment from 'moment';

describe('ExchangeAggregationLog Model Test Suite', async() => {

    beforeAll( async() => {

        let testPayload = {
            companyCode: "test company",
            companyName: "Test",
            companyShortDescription: "ABcd sadcfa afwep;goujdlvkhsld asd ahd ashd as"
        };

        let company = await postgres.Company.createCompany( testPayload );

    });


    describe('Test model function : createLog', async() => {

        test('CASE: payload -> undefined', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.createLog();

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid payload");

            }

        });

        test('CASE: payload -> null', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.createLog(null);

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid payload");

            }

        });

        test('CASE: payload -> {}', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.createLog({});

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid payload");

            }

        });

        test('CASE: payload -> ""', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.createLog("");

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid payload");

            }

        });

        test('CASE: payload -> invalid companyID', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.createLog({
                    companyID: "asAsasasa",
                    companyCode: "Allies",
                    companyName: "Allies Interactive",
                    aggregationType: "15MIN",
                    average: "3213123",
                    minimum: "3213123",
                    maximum: "3213123"
                });

            } catch( err ) {

                expect( err.toString() ).toBe('SequelizeForeignKeyConstraintError: insert or update on table \"ExchangeAggregationLogs\" violates foreign key constraint \"ExchangeAggregationLogs_companyID_fkey\"');

            }

        });

        test('CASE: payload -> invalid average', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.createLog({
                    companyID: "asAsasasa",
                    companyCode: "Allies",
                    companyName: "Allies Interactive",
                    aggregationType: "15MIN",
                    average: "-3213123",
                    minimum: "3213123",
                    maximum: "3213123"
                });

            } catch( err ) {

                expect( err.toString() ).toBe('Error: Invalid double value');

            }

        });

        test('CASE: payload -> invalid minimum', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.createLog({
                    companyID: "asAsasasa",
                    companyCode: "Allies",
                    companyName: "Allies Interactive",
                    aggregationType: "15MIN",
                    average: "3213123",
                    minimum: "asdfasd",
                    maximum: "3213123"
                });

            } catch( err ) {

                expect( err.toString() ).toBe('Error: Invalid double value');

            }

        });

        test('CASE: payload -> invalid maximum', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.createLog({
                    companyID: "asAsasasa",
                    companyCode: "Allies",
                    companyName: "Allies Interactive",
                    aggregationType: "15MIN",
                    average: "3213123",
                    minimum: "12313",
                    maximum: "-3213123"
                });

            } catch( err ) {

                expect( err.toString() ).toBe('Error: Invalid double value');

            }

        });

        test('CASE: payload -> invalid aggregationType', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.createLog({
                    companyID: "asAsasasa",
                    companyCode: "Allies",
                    companyName: "Allies Interactive",
                    aggregationType: "15MIN1",
                    average: "3213123",
                    minimum: "12313",
                    maximum: "3213123"
                });

            } catch( err ) {

                expect( err.toString() ).toBe('SequelizeDatabaseError: invalid input value for enum \"enum_ExchangeAggregationLogs_aggregationType\": \"15MIN1\"');

            }

        });

        test('CASE: payload -> valid payload', async() => {

            let company = await postgres.Company.getByCode( "TEST-COMPANY" );

            let log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123,
                trendData: { rows: [
                    {unitPrice: 11, updateAt: "2017-11-11 11:21:12T0:00"},
                    {unitPrice: 121, updateAt: "2017-12-11 11:21:12T0:00"}
                ]}
            });

            expect( log.exchangeAggregationLogID ).toMatch(/^EXCH_AGG_LOG.*/);
            expect( log.companyID ).toMatch(/^COMPANY-.*/);

            expect( log.companyCode ).toBeDefined();
            expect( log.companyName ).toBeDefined();
            expect( log.aggregationType ).toBe("15MIN");

            expect( log.average ).toBe(32.13123);
            expect( log.minimum ).toBe(12313);
            expect( log.maximum ).toBe(3213.123);

            expect( log.trendData ).toMatchObject(
                { rows: [
                    {unitPrice: 11, updateAt: "2017-11-11 11:21:12T0:00"},
                    {unitPrice: 121, updateAt: "2017-12-11 11:21:12T0:00"}
                ]}
            );

            expect( log.date ).toBeDefined();
            expect( log.month ).toBeDefined();
            expect( log.year ).toBeDefined();

            expect( log.updatedAt ).toBeDefined();
            expect( log.createdAt ).toBeDefined();


            let deleted = await postgres.ExchangeAggregationLog.destroy({
                where: {
                    exchangeAggregationLogID: log.exchangeAggregationLogID
                }
            });

        });

    });


    describe('Test model function : search', async() => {

        beforeAll( async() => {

            let company = await postgres.Company.getByCode( "TEST-COMPANY" );

            let log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });

            log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });

            log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });

            log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });
            log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });

            log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });

            log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });
            log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });

            log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });

            log = await postgres.ExchangeAggregationLog.createLog({
                companyID: company.companyID,
                companyCode: company.companyCode,
                companyName: company.companyName,
                aggregationType: "15MIN",
                average: 32.13123,
                minimum: 12313,
                maximum: 3213.123
            });

        });

        test('CASE: companyCode -> undefined', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.search();

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid companyCode");

            }

        });

        test('CASE: companyCode -> ""', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.search("");

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid companyCode");

            }

        });

        test('CASE: companyCode -> null', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.search(null);

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid companyCode");

            }

        });

        test('CASE: companyCode -> valid | filterKeyword -> "" ', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.search("TEST-COMPANY", "");

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid filter keyword");

            }

        });

        test('CASE: companyCode -> valid | filterKeyword -> "15MIN12" ', async() => {

            try{

                let log = await postgres.ExchangeAggregationLog.search("TEST-COMPANY", "15MIN12");

            } catch( err ) {

                expect( err.toString() ).toBe("Error: Invalid aggregation type");

            }

        });

        test('CASE: companyCode -> valid | filterKeyword -> valid', async() => {

            let log = await postgres.ExchangeAggregationLog.search("TEST-COMPANY", "1DAY");

            expect( log.rows[0].exchangeAggregationLogID ).toMatch(/^EXCH_AGG_LOG.*/);

            expect( log.rows[0].companyCode ).toBeDefined();
            expect( log.rows[0].companyName ).toBeDefined();
            expect( log.rows[0].aggregationType ).toBeDefined();

            expect( log.rows[0].average ).toBeDefined();
            expect( log.rows[0].trendData ).toBeDefined();
            expect( log.rows[0].minimum ).toBeDefined();
            expect( log.rows[0].maximum ).toBeDefined();

            expect( log.rows[0].updatedAt ).toBeDefined();

            expect( log.count ).toBeDefined();
            expect( log.rows ).toBeDefined();

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