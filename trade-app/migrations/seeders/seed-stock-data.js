import StockReportController from '../../controllers/stock-report.controller';

var faker = require("faker");
var moment = require('moment');

function generateRandomNumber() {
    var min = 0.001,
        max = 3,
        highlightedNumber = (Math.random() * (max - min) + min).toFixed(3);

    return highlightedNumber;
}

async function generatePayload( m, company ) {
    
    let mm = moment(m);
    return await StockReportController.seedStockReport({
        companyCode: company.companyCode,
        companyID: company.companyID,
        unitPrice: generateRandomNumber(),
        timestamp: mm.toISOString(),
        day: mm.format('dddd'),
        completeDate: mm.format('DD-MM-YYYY'),
        date: mm.format('DD'),
        month: mm.format('MMMM'),
        monthNumber: mm.format('MM'),
        year: mm.format('YYYY'),
        HH: mm.format('HH'),
        mm: mm.format('mm'),
        ss: mm.format('ss')
    });
}


async function generateStockData( companyList ) {

    console.log( ">>>", companyList[0]  );

    let m = '2017-09-07 12:23';
    await generatePayload( m, companyList[0] );

    m = '2017-09-07 13:23';
    await generatePayload( m, companyList[0] );
    m = '2017-09-07 13:00';
    await generatePayload( m, companyList[0] );
    m = '2017-09-07 14:01';
    await generatePayload( m, companyList[1] );
    m = '2017-09-07 15:20';
    await generatePayload( m, companyList[0] );
    m = '2017-09-07 15:21';
    await generatePayload( m, companyList[1] );
    m = '2017-09-07 15:22';
    await generatePayload( m, companyList[1] );
    m = '2017-09-07 15:23';
    await generatePayload( m, companyList[1] );
    m = '2017-09-07 15:24';
    await generatePayload( m, companyList[1] );
    m = '2017-09-07 15:25';
    await generatePayload( m, companyList[3] );
    m = '2017-09-07 16:26';
    await generatePayload( m, companyList[2] );
    m = '2017-09-07 16:27';
    await generatePayload( m, companyList[2] );
    m = '2017-09-07 16:28';
    await generatePayload( m, companyList[1] );
    m = '2017-09-07 16:29';
    await generatePayload( m, companyList[0] );
    m = '2017-09-07 16:30';
    await generatePayload( m, companyList[0] );
    m = '2017-09-07 16:31';
    await generatePayload( m, companyList[3] );
    m = '2017-09-07 16:32';
    await generatePayload( m, companyList[3] );
    m = '2017-09-07 17:33';
    await generatePayload( m, companyList[2] );
    m = '2017-09-07 17:33';
    await generatePayload( m, companyList[3] );
    m = '2017-09-07 17:34';
    await generatePayload( m, companyList[3] );
    m = '2017-09-07 17:35';
    await generatePayload( m, companyList[3] );
    m = '2017-09-07 20:36';
    await generatePayload( m, companyList[2] );
    m = '2017-09-07 21:37';
    await generatePayload( m, companyList[2] );
    m = '2017-09-07 21:38';
    await generatePayload( m, companyList[2] );
    m = '2017-09-07 21:39';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 08:40';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 08:55';
    await generatePayload( m, companyList[0] );
    m = '2017-09-08 09:22';
    await generatePayload( m, companyList[0] );
    m = '2017-09-08 09:23';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 09:23';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 10:24';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 11:25';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 11:26';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 11:27';
    await generatePayload( m, companyList[3] );
    m = '2017-09-08 11:27';
    await generatePayload( m, companyList[4] );
    m = '2017-09-08 11:28';
    await generatePayload( m, companyList[4] );
    m = '2017-09-08 12:29';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 12:30';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 12:31';
    await generatePayload( m, companyList[0] );
    m = '2017-09-08 14:03';
    await generatePayload( m, companyList[0] );
    m = '2017-09-08 14:05';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 14:06';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 14:07';
    await generatePayload( m, companyList[0] );
    m = '2017-09-08 15:08';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 16:09';
    await generatePayload( m, companyList[3] );
    m = '2017-09-08 16:21';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 17:22';
    await generatePayload( m, companyList[0] );
    m = '2017-09-08 18:23';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 18:24';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 18:24';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 18:25';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 18:26';
    await generatePayload( m, companyList[3] );
    m = '2017-09-08 18:27';
    await generatePayload( m, companyList[3] );
    m = '2017-09-08 18:28';
    await generatePayload( m, companyList[0] );
    m = '2017-09-08 18:29';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 18:30';
    await generatePayload( m, companyList[0] );
    m = '2017-09-08 18:31';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 18:32';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 18:33';
    await generatePayload( m, companyList[0] );
    m = '2017-09-08 19:34';
    await generatePayload( m, companyList[2] );
    m = '2017-09-08 19:35';
    await generatePayload( m, companyList[1] );
    m = '2017-09-08 19:36';
    await generatePayload( m, companyList[4] );
    m = '2017-09-08 19:37';
    await generatePayload( m, companyList[4] );
}



module.exports = generateStockData;