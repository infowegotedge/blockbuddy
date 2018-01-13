import AppConfig from "../../config/app-config";
import randomstring from "randomstring";

module.exports = function(sequelize, DataTypes) {

  var Offer = sequelize.define('Offer', {
    offerID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },
    
    offerType: {
      type: DataTypes.STRING,
      validate: {
        isIn: [ AppConfig.offerTypes ]
      }
    },

    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    tradeUnitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },

    tradeTotalAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },

    tradeTotalShares: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    systemPortfolioLedgerID: {
      type: DataTypes.STRING,
      allowNull: true
    },

    systemWalletLedgerID: {
      type: DataTypes.STRING,
      allowNull: true
    },

    consumedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },

    companyCode: {
      type: DataTypes.STRING,
      allowNull: false
    }
    
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // Offer.belongsTo( models.Company, { foreignKey: "companyID" });
        // Offer.belongsTo( models.Trader, { foreignKey: "createdBy" });
        // Offer.belongsTo( models.SystemPortfolioLedger, { foreignKey: "systemPortfolioLedgerID" });
        // Offer.belongsTo( models.SystemWalletLedger, { foreignKey: "systemWalletLedgerID" });
      }
    },
    hooks: {
      beforeValidate: (offer, options) => {
        return offer.offerID = AppConfig.offerID + randomstring.generate();
      }
    }
  });

  return Offer;
};