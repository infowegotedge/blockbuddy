import AppConfig from "../../config/app-config";

module.exports = function(sequelize, DataTypes) {

  var TraderPortfolioLedger = sequelize.define('TraderPortfolioLedger', {
    
    traderPortfolioLedgerID: {
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
          traderPortfolioLedgerID: this.traderPortfolioLedgerID,
          shareTrade: this.shareTrade,
          total: this.total,
          from: this.from,
          to: this.to,
          transferType: this.transferType,
          type: this.type,
          subType: this.subType,
          note: this.note,
          privateNote: this.privateNote,
          companyID: this.companyID,
          updatedAt: this.updatedAt
        }
      },

      getRecord() {
        return {
          traderPortfolioLedgerID: this.traderPortfolioLedgerID,
          shareTrade: this.shareTrade,
          total: this.total,
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

  return TraderPortfolioLedger;
};