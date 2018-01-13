import AppConfig from '../../config/app-config'

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';

const cls = require('continuation-local-storage');
const namespace = cls.createNamespace('bbapp-transaction');
Sequelize.useCLS(namespace);

var db        = {};

const sequelize = new Sequelize( AppConfig.postgres.database, AppConfig.postgres.username , AppConfig.postgres.password , {
    host: AppConfig.postgres.host,
    dialect: AppConfig.postgres.dialect,
    port: AppConfig.postgres.port,
    pool:  AppConfig.postgres.pool,
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });


fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;



//============================== Relations Mapping =====================================


//Trader Associations
db.Trader.hasOne( db.TraderQualification, { foreignKey: "traderID" });
db.Trader.hasMany( db.TraderWallet, { foreignKey: "traderID" } );
db.Trader.hasMany( db.TraderPortfolio, { foreignKey: "traderID" }  );
db.Trader.hasMany( db.TraderQualificationMigration, { foreignKey: "traderID" }  );
db.Trader.hasMany( db.ProductSale, { foreignKey: "traderID" });
db.Trader.belongsToMany( db.TraderWalletLedger, { through: 'TraderWalletIndex', foreignKey: "traderID"});
db.Trader.belongsToMany( db.TraderPortfolioLedger, { through: 'TraderPortolioIndex', foreignKey: "traderID"});


//Trader Wallet Associations
db.TraderWallet.belongsTo( db.Currency, { foreignKey: "currencyID" });


//Trader Portfolio Associations
db.TraderPortfolio.belongsTo( db.Company, { foreignKey: "companyID" });


//Offer Associations
db.Offer.belongsTo( db.Trader, { foreignKey: "createdBy" });
db.Offer.belongsTo( db.Company, { foreignKey: "companyID" });
db.Offer.belongsTo( db.SystemPortfolioLedger, { foreignKey: "systemPortfolioLedgerID" });
db.Offer.belongsTo( db.SystemWalletLedger, { foreignKey: "systemWalletLedgerID" });


//SystemPortfolioLedger Associations
db.SystemPortfolioLedger.belongsTo( db.Company, { foreignKey: "companyID" });


//SystemPortfolioLedger Associations
db.SystemWalletLedger.belongsTo( db.Currency, { foreignKey: "currencyID" });


//Qualification Associations
db.Qualification.hasOne( db.QualificationCompensation, { foreignKey: "qualificationID" });
db.Qualification.hasOne( db.TraderQualification, { foreignKey: "qualificationID" });


//Trader Qualification Associations
db.TraderQualification.belongsTo( db.Qualification, { foreignKey: "qualificationID" });


//Compensation Associations
db.Compensation.hasOne( db.QualificationCompensation, { foreignKey: "compensationID" });


db.Company.hasMany( db.ExchangeLog, { foreignKey: "companyID" } );
db.Company.hasMany( db.ExchangeAggregationLog, { foreignKey: "companyID" } );

//Product Sale
//db.Product.belongsTo( db.ProductSale, { foreignKey: "productID" });

//Qualification Associations
// db.Qualification.belongsTo( db.TraderQualification, { foreignKey: "qualificationID" });
// db.Qualification.belongsTo( db.TraderQualificationMigration, { foreignKey: "qualificationID" });




// db.TraderPortfolioLedger.belongsTo( db.Company, { foreignKey: "companyID" });
// db.TraderPortfolioLedger.belongsToMany( db.Trader, { through: 'TraderPortfolioIndex', foreignKey: "traderPortfolioLedgerID"});
//
//
// db.TraderWalletLedger.belongsTo( db.VirtualCurrency, { foreignKey: "virtualCurrencyID" });
// db.TraderWalletLedger.belongsToMany( db.Trader, { through: 'TraderWalletIndex', foreignKey: "traderWalletLedgerID"});
//
//
//
// db.Qualification.belongsTo( db.QualificationCompensation, { foreignKey: "qualificationID" });
// db.Qualification.belongsTo( db.TraderQualification, { foreignKey: "qualificationID" });
// db.Qualification.belongsTo( db.TraderQualificationMigration, { foreignKey: "qualificationID" });
//
// db.CompensationPlan.belongsTo( db.QualificationCompensation, { foreignKey: "compensationPlanID" });
//



//============================== END of Relations Mapping ===============================


module.exports = db;
