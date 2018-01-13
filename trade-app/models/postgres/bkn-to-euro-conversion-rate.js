import AppConfig from "../../config/app-config";
import randomstring from "randomstring";

module.exports = function(sequelize, DataTypes) {

  var BknToEuroConversionRate = sequelize.define('BknToEuroConversionRate', {
    conversionID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },

    hooks: {
      beforeValidate: (BknToEuroConversionRate, options) => {
        return BknToEuroConversionRate.conversionID = AppConfig.bknToEuroConversionRateIDType + randomstring.generate();
      }
    }
  });

  return BknToEuroConversionRate;
};