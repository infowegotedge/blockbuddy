import AppConfig from "../../config/app-config";

module.exports = function(sequelize, DataTypes) {

  var TraderWalletLedger = sequelize.define('TraderWalletLedger', {
    traderWalletLedgerID: {
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
    
    transferType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [ AppConfig.transactionType ]
      }
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

      getAdminRecord() {
        return {
          traderWalletLedgerID: this.traderWalletLedgerID,
          shareTrade: this.shareTrade,
          amount: this.amount,
          from: this.from,
          to: this.to,
          transferType: this.transferType,
          type: this.type,
          subType: this.subType,
          note: this.note,
          privateNote: this.privateNote,
          updatedAt: this.updatedAt
        }
      },

      getRecord() {
        return {
          traderWalletLedgerID: this.traderWalletLedgerID,
          shareTrade: this.shareTrade,
          amount: this.amount,
          from: this.from,
          to: this.to,
          transferType: this.transferType,
          type: this.type,
          subType: this.subType,
          note: this.note,
          updatedAt: this.updatedAt
        }
      },
    }
  });

  return TraderWalletLedger;
};