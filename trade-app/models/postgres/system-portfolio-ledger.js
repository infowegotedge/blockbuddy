import AppConfig from "../../config/app-config";

module.exports = function(sequelize, DataTypes) {

  var SystemPortfolioLedger = sequelize.define('SystemPortfolioLedger', {

    systemPortfolioLedgerID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },

    shareTrade: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    },

    total: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    from: {
      type: DataTypes.STRING,
      allowNull: false
    },

    to: {
      type: DataTypes.STRING,
      allowNull: false
    },

    transferType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [ AppConfig.transactionType ]
      }
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [ AppConfig.ledgerType ]
      }
    },

    subType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [ AppConfig.ledgerSubType ]
      }
    },

    companyID: {
      type: DataTypes.STRING,
      allowNull: false
    },

    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    privateNote:{
      type: DataTypes.TEXT,
      allowNull: true
    }


  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      
    }
  });

  return SystemPortfolioLedger;
};