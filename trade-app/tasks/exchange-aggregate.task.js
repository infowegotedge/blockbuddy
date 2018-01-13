import cron from 'node-cron';

import ExchangeAggregateTaskHandler from './handler/exchange-aggregate.task-handler';

const postgres = require('../models').postgres;

cron.schedule( process.env.NODE_TRADE_TASK_EXCHANGE_AGGREGATION_15MIN_REPORT , async() => {
    console.log("START OF TASK [ EXCHANGE_AGGREGATION_15MIN_REPORT ]=======================================");

    let companyList = await postgres.Company.listAllActive();

    for ( let i = 0; i < companyList.count ; i++ ) {

        let exchangeAggregateTaskHandlerObj = new ExchangeAggregateTaskHandler();

        await exchangeAggregateTaskHandlerObj.processExchangeLog( "15MIN", companyList.rows[i] );

    }

    console.log("END OF TASK [ EXCHANGE_AGGREGATION_15MIN_REPORT ]=========================================");
});



cron.schedule( process.env.NODE_TRADE_TASK_EXCHANGE_AGGREGATION_60MIN_REPORT , async() => {
    console.log("START OF TASK [ EXCHANGE_AGGREGATION_60MIN_REPORT ]=======================================");

    let companyList = await postgres.Company.listAllActive();

    for ( let i = 0; i < companyList.count ; i++ ) {

        let exchangeAggregateTaskHandlerObj = new ExchangeAggregateTaskHandler();

        await exchangeAggregateTaskHandlerObj.processExchangeLog( "60MIN", companyList.rows[i]  );

    }

    console.log("END OF TASK [ EXCHANGE_AGGREGATION_60MIN_REPORT ]=========================================");
});


cron.schedule( process.env.NODE_TRADE_TASK_EXCHANGE_AGGREGATION_1DAY_REPORT , async() => {
    console.log("START OF TASK [ EXCHANGE_AGGREGATION_1DAY_REPORT ]=======================================");

    let companyList = await postgres.Company.listAllActive();

    for ( let i = 0; i < companyList.count ; i++ ) {

        let exchangeAggregateTaskHandlerObj = new ExchangeAggregateTaskHandler();

        await exchangeAggregateTaskHandlerObj.processExchangeLog( "1DAY", companyList.rows[i]  );

    }

    console.log("END OF TASK [ EXCHANGE_AGGREGATION_1DAY_REPORT ]=========================================");
});


cron.schedule( process.env.NODE_TRADE_TASK_EXCHANGE_AGGREGATION_2DAY_REPORT , async() => {
    console.log("START OF TASK [ EXCHANGE_AGGREGATION_2DAY_REPORT ]=======================================");

    let companyList = await postgres.Company.listAllActive();

    for ( let i = 0; i < companyList.count ; i++ ) {

        let exchangeAggregateTaskHandlerObj = new ExchangeAggregateTaskHandler();

        await exchangeAggregateTaskHandlerObj.processExchangeLog( "2DAY", companyList.rows[i]  );

    }

    console.log("END OF TASK [ EXCHANGE_AGGREGATION_2DAY_REPORT ]=========================================");
});


cron.schedule( process.env.NODE_TRADE_TASK_EXCHANGE_AGGREGATION_3DAY_REPORT , async() => {
    console.log("START OF TASK [ EXCHANGE_AGGREGATION_3DAY_REPORT ]=======================================");

    let companyList = await postgres.Company.listAllActive();

    for ( let i = 0; i < companyList.count ; i++ ) {

        let exchangeAggregateTaskHandlerObj = new ExchangeAggregateTaskHandler();

        await exchangeAggregateTaskHandlerObj.processExchangeLog( "3DAY", companyList.rows[i]  );

    }

    console.log("END OF TASK [ EXCHANGE_AGGREGATION_3DAY_REPORT ]=========================================");
});


cron.schedule( process.env.NODE_TRADE_TASK_EXCHANGE_AGGREGATION_1WEEK_REPORT , async() => {
    console.log("START OF TASK [ EXCHANGE_AGGREGATION_1WEEK_REPORT ]=======================================");

    let companyList = await postgres.Company.listAllActive();

    for ( let i = 0; i < companyList.count ; i++ ) {

        let exchangeAggregateTaskHandlerObj = new ExchangeAggregateTaskHandler();

        await exchangeAggregateTaskHandlerObj.processExchangeLog( "1WEEK", companyList.rows[i]  );

    }

    console.log("END OF TASK [ EXCHANGE_AGGREGATION_1WEEK_REPORT ]=========================================");
});

cron.schedule( process.env.NODE_TRADE_TASK_EXCHANGE_AGGREGATION_1MONTH_REPORT , async() => {
    console.log("START OF TASK [ EXCHANGE_AGGREGATION_1MONTH_REPORT ]=======================================");

    let companyList = await postgres.Company.listAllActive();

    for ( let i = 0; i < companyList.count ; i++ ) {

        let exchangeAggregateTaskHandlerObj = new ExchangeAggregateTaskHandler();

        await exchangeAggregateTaskHandlerObj.processExchangeLog( "1MONTH", companyList.rows[i]  );

    }

    console.log("END OF TASK [ EXCHANGE_AGGREGATION_1MONTH_REPORT ]=========================================");
});