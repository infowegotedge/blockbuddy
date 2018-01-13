var postgres = require('../models/index').postgres;

var Sequelize = require('sequelize');

var _ = require('lodash');

var randomstring = require('randomstring');

var AppConfig = require('../config/app-config').default;

var TraderHandler = require('../handler/trader.handler').default;
var CompanyHandler = require('../handler/company.handler').default;
var TraderPortfolioHandler = require('../handler/trader-portfolio.handler').default;

// const sequelize = new Sequelize( "wp_bbapp", "root" , "root" , {
//     host: "localhost",
//     dialect: "mysql",
//     port: 3306
// });

const sequelize2 = new Sequelize( AppConfig.postgres.database, AppConfig.postgres.username , AppConfig.postgres.password , {
    host: AppConfig.postgres.host,
    dialect: AppConfig.postgres.dialect,
    port: AppConfig.postgres.port,
    pool:  AppConfig.postgres.pool
});

// const WPShare = sequelize.define('wp_share_price_value', {
//     user_id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true
//     },
//     username: {
//         type: Sequelize.STRING
//     },
//     email: {
//         type: Sequelize.STRING
//     },
//     company: {
//         type: Sequelize.STRING
//     },
//     shares: {
//         type: Sequelize.DOUBLE
//     },
//     ask_price: {
//         type: Sequelize.DOUBLE
//     },
//     purchase_value: {
//         type: Sequelize.DOUBLE
//     },
//     currency: {
//         type: Sequelize.STRING
//     },
//     isNew: {
//         type: Sequelize.BOOLEAN
//     },
//     isNew2: {
//         type: Sequelize.BOOLEAN
//     }
// }, {
//     timestamps: false
// });


const TraderCoinMigration = sequelize2.define('TraderCoinMigration', {
    user_id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    userName: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    company: {
        type: Sequelize.STRING
    },
    shares: {
        type: Sequelize.DOUBLE
    },
    isNew: {
        type: Sequelize.BOOLEAN
    },
    isNew2: {
        type: Sequelize.BOOLEAN
    },
    isUserPresent:  {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    transferComplete:  {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false
});


async function insertCoinsToAccount( payload, blockNV, sW, sS, rAB, yA ) {

    let trader = await TraderHandler.getTraderInfoByUserName( payload.userName );

    if ( payload.company == "BLOCK-EVOLUTION-NV") {

        let flag = await TraderPortfolioHandler.createTraderPortfolio( trader.traderID, blockNV, parseInt( payload.shares ) );

        await TraderCoinMigration.update({
            transferComplete:true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    } else if (payload.company == "SITV-WARRANT" ) {

        let flag = await TraderPortfolioHandler.createTraderPortfolio( trader.traderID, sW, parseInt( payload.shares ) );
        await TraderCoinMigration.update({
            transferComplete:true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    } else if (payload.company == "SITV-SHARES") {

        let flag = await TraderPortfolioHandler.createTraderPortfolio( trader.traderID, sS, parseInt( payload.shares ) );
        await TraderCoinMigration.update({
            transferComplete:true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    } else if (payload.company == "REALXIQ-AB") {

        let flag = await TraderPortfolioHandler.createTraderPortfolio( trader.traderID, rAB, parseInt( payload.shares ) );
        await TraderCoinMigration.update({
            transferComplete:true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    } else if (payload.company == "YAZZER-LIFESTYLE-AB") {

        let flag = await TraderPortfolioHandler.createTraderPortfolio( trader.traderID, yA, parseInt( payload.shares ) );

        await TraderCoinMigration.update({
            transferComplete:true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    }

    console.log(">>> Transfer Complete", payload.userName );

}



async function updateCoinsToAccount( payload, blockNV, sW, sS, rAB, yA ) {

    let trader = await TraderHandler.getTraderInfoByUserName( payload.userName );

    if ( payload.company == "BLOCK-EVOLUTION-NV") {

        let flag = await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, blockNV.companyID, parseInt( payload.shares ) );

        await TraderCoinMigration.update({
            transferComplete: ( flag == 0 ) ? false : true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    } else if (payload.company == "SITV-WARRANT" ) {

        let flag = await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, sW.companyID, parseInt( payload.shares ) );
        await TraderCoinMigration.update({
            transferComplete: ( flag == 0 ) ? false : true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    } else if (payload.company == "SITV-SHARES") {

        let flag = await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, sS.companyID, parseInt( payload.shares ) );
        await TraderCoinMigration.update({
            transferComplete: ( flag == 0 ) ? false : true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    } else if (payload.company == "REALXIQ-AB") {

        let flag = await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, rAB.companyID, parseInt( payload.shares ) );
        await TraderCoinMigration.update({
            transferComplete: ( flag == 0 ) ? false : true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    } else if (payload.company == "YAZZER-LIFESTYLE-AB") {

        let flag = await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, yA.companyID, parseInt( payload.shares ) );
        
        await TraderCoinMigration.update({
            transferComplete: ( flag == 0 ) ? false : true
        }, {
            where: {
                user_id: payload.user_id
            }
        });

    }

    console.log(">>> Transfer Complete", payload.userName );

}

async function transferCoins() {

    let blockNV = await CompanyHandler.getCompanyAllInfo("BLOCK-EVOLUTION-NV");
    let sW = await CompanyHandler.getCompanyAllInfo("SITV-WARRANT");
    let sS = await CompanyHandler.getCompanyAllInfo("SITV-SHARES");
    let rAB = await CompanyHandler.getCompanyAllInfo("REALXIQ-AB");
    let yA = await CompanyHandler.getCompanyAllInfo("YAZZER-LIFESTYLE-AB");


    let list = await TraderCoinMigration.findAll({
        where: {
            isUserPresent: true
        }
    });

    for( let i = 0 ; i < list.length; i ++ ) {

        await updateCoinsToAccount( {
            user_id: list[i].user_id,
            userName: list[i].userName,
            email: list[i].email,
            company: list[i].company,
            shares: list[i].shares
        }, blockNV, sW, sS, rAB, yA );

    }

}


async function assignCoins() {

    let blockNV = await CompanyHandler.getCompanyAllInfo("BLOCK-EVOLUTION-NV");
    let sW = await CompanyHandler.getCompanyAllInfo("SITV-WARRANT");
    let sS = await CompanyHandler.getCompanyAllInfo("SITV-SHARES");
    let rAB = await CompanyHandler.getCompanyAllInfo("REALXIQ-AB");
    let yA = await CompanyHandler.getCompanyAllInfo("YAZZER-LIFESTYLE-AB");


    let list = await TraderCoinMigration.findAll({
        where: {
            isUserPresent: true,
            transferComplete: false
        }
    });

    for( let i = 0 ; i < list.length; i ++ ) {

        await insertCoinsToAccount( {
            user_id: list[i].user_id,
            userName: list[i].userName,
            email: list[i].email,
            company: list[i].company,
            shares: list[i].shares
        }, blockNV, sW, sS, rAB, yA );

    }

}

async function checkAvailableUsers(  ) {

    let list = await TraderCoinMigration.findAll();

    for( let i = 0 ; i < list.length; i ++ ) {

        try{

            let trader = await TraderHandler.getTraderInfoByUserName( list[i].userName );

            await TraderCoinMigration.update({
                isUserPresent: true
            }, {
                where: {
                    user_id: list[i].user_id
                }
            });

        } catch ( err ) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>", list[i].userName, err );
        }

    }

}

async function mg( purgeDB = false ) {

    await TraderCoinMigration.sync({force: purgeDB});

    let users = await WPShare.findAll();

    for( let i = 0 ; i < users.length; i ++ ) {

        console.log( ">>>>", users[i].username, users[i].email );
        console.log( "\n\r" );

        if ( users[i].company != null ) {

            await TraderCoinMigration.create({
                user_id: randomstring.generate(),
                userName: ((users[i].username).toLowerCase()),
                email: users[i].email,
                company: (((users[i].company).toUpperCase()).replace(/ /g,"-")).trim(),
                shares: users[i].shares,
                isNew: users[i].isNew,
                isNew2: users[i].isNew2
            });

        }


    }

}

async function transferAndSetCustomData () {

    let sW = await CompanyHandler.getCompanyAllInfo("SITV-WARRANT");
    let sS = await CompanyHandler.getCompanyAllInfo("SITV-SHARES");

    // SHARES : TRADER-qgx8aLmqXp5SZM37ajQEqdjwiqC1Zpbh / hal7d1972@gmail.com / hal7d1972 / 443086
    let trader = await TraderHandler.getTraderInfoByUserName( "hal7d1972" );
    console.log( await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, sS.companyID, parseInt( 443086 ) ));

    // SHARES : TRADER-JNDNqWzqXABTEiy73dmBrDcSzYWlAirB / issaelg8@gmail.com / bozilssa / 110000 - Allotment ----------------
    trader = await TraderHandler.getTraderInfoByUserName( "bozilssa" );
    console.log( await TraderPortfolioHandler.createTraderPortfolio( trader.traderID, sS, parseInt( 110000 ) ) );

    // SHARES : TRADER-1gD0vAQ4omhcuYbGdY8cUJMssL9dBi1o / ray.watkins@outlook.com / pluddoswebtrading / 1136000 -------------------
    trader = await TraderHandler.getTraderInfoByUserName( "pluddoswebtrading" );
    console.log( await TraderPortfolioHandler.createTraderPortfolio( trader.traderID, sS, parseInt( 1136000 ) ) );

    // SHARES : TRADER-ERPtIVyoADSNIpzoxz6vk6YKDtCTqe35 / eliteworldonline@gmail.com / liberation1970 / 1136600
    trader = await TraderHandler.getTraderInfoByUserName( "liberation1970" );
    console.log( await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, sS.companyID, parseInt( 1136000 ) ) );

    // SHARES : TRADER-ERPtIVyoADSNIpzoxz6vk6YKDtCTqe35 / Ukonlinemoneyguru@gmail.com / globalempire / 1128037 --- DELETE MULTIPLE IDS
    trader = await TraderHandler.getTraderInfoByUserName( "globalempire" );
    console.log( await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, sS.companyID, parseInt( 1128037 ) ) );

    // WARRANT : TRADER-qgx8aLmqXp5SZM37ajQEqdjwiqC1Zpbh / hal7d1972@gmail.com / hal7d1972 / 3669643
    trader = await TraderHandler.getTraderInfoByUserName( "hal7d1972" );
    console.log( await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, sW.companyID, parseInt( 3669643 ) ) );

    // WARRANT : TRADER-88hUpSzxqo6D17N09lkfCV0vbprWJ1cK / Ukonlinemoneyguru@gmail.com / globalempire / 2620680
    trader = await TraderHandler.getTraderInfoByUserName( "globalempire" );
    console.log( await TraderPortfolioHandler.updateTraderPortfolio( trader.traderID, sW.companyID, parseInt( 2620680 ) ) );

}

//mg( true );

//checkAvailableUsers();

//transferCoins();

//assignCoins();

transferAndSetCustomData();
