import AppConfig from "../../config/app-config";

module.exports = function(sequelize, DataTypes) {

  var SystemWalletLedger = sequelize.define('SystemWalletLedger', {
    
    systemWalletLedgerID: {
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
    
    amount: {
      type: DataTypes.DOUBLE,
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

    currencyID: {
      type: DataTypes.STRING,
      allowNull: false
    },

    note: {
      type: DataTypes.TEXT
    },
    
    privateNote: {
      type: DataTypes.TEXT
    }


  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },

    hooks: {

    },

    getterMethods: {

    }
    
  });

  return SystemWalletLedger;
};