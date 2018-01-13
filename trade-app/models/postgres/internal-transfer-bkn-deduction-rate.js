import AppConfig from "../../config/app-config";
import randomstring from "randomstring";

module.exports = function(sequelize, DataTypes) {

  var InternalTransferBknDeductionRate = sequelize.define('InternalTransferBknDeductionRate', {
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
        isIn: [ AppConfig.internalTransferBknDeductionType ]
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
      beforeValidate: ( InternalTransferBknDeductionRate, options) => {
        return  InternalTransferBknDeductionRate.conversionID = AppConfig.internalTransferBknDeductionRate + randomstring.generate();
      }
    }
  });

  return InternalTransferBknDeductionRate;
};