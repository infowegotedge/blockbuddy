import AppConfig from "../../config/app-config";
import randomstring from "randomstring";

module.exports = function(sequelize, DataTypes) {

  var WithdrawalDeductionRate = sequelize.define('WithdrawalDeductionRate', {
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
    type:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "FIXED",
      validate: {
        isIn: [ AppConfig.withdrawalDeductionType ]
      }
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
      beforeValidate: (withdrawalDeductionRate, options) => {
        return withdrawalDeductionRate.conversionID = AppConfig.withdrawalDeductionRateID + randomstring.generate();
      }
    }
  });

  return WithdrawalDeductionRate;
};