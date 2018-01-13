import AppConfig from "../../config/app-config";

module.exports = function(sequelize, DataTypes) {

  var QualificationCompensation = sequelize.define('QualificationCompensation', {

    qualificationCompensationID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },

    bonusType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [ AppConfig.bonusType ]
      }
    },

    base: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [ AppConfig.bonusBase ]
      }
    },
    
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
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

      getRecord() {
        return {
          qualificationCompensationID: this.qualificationCompensationID,
          qualificationID: this.qualificationID,
          compensationID: this.compensationID,
          bonusType: this.bonusType,
          amount: this.amount,
          base: this.base,
          updatedAt: this.updatedAt
        }
      },

    },

  });

  return QualificationCompensation;
};