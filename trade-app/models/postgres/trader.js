import AppConfig from "../../config/app-config";

//import TraderQualification from '../../transaction/trader-qualification';

module.exports = function(sequelize, DataTypes) {

  var Trader = sequelize.define('Trader', {
    
    traderID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },
    
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username must be unique.'
      }
    },
    
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    
    isKycApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    
    contactNumber:  {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    
    address:  {
      type: DataTypes.TEXT,
      defaultValue: ""
    },
    
    country:  {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    
    locale:  {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "TRADER",
      validate: {
        isIn: [ AppConfig.traderRoles ]
      }
    }
    
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },

    getterMethods: {

      canTrade() {
        return (this.isActive && this.isKycApproved);
      },

      fullName() {
        return this.firstName + ' ' + this.lastName
      },

      getCompleteRecord() {
        return {
          traderID: this.traderID,
          firstName: this.firstName,
          lastName:  this.lastName,
          email: this.email,
          isKycApproved: this.isKycApproved,
          contactNumber: this.contactNumber,
          address: this.address,
          country: this.country,
          locale: this.country,
          isActive: this.isActive,
          userName: this.userName,
          updatedAt: this.updatedAt
        }
      },

      getRecord() {
        return {
          fullName: this.firstName + ' ' + this.lastName,
          email: this.email,
          isKycApproved: this.isKycApproved,
          contactNumber: this.contactNumber,
          address: this.address,
          country: this.country,
          locale: this.country,
          isActive: this.isActive,
          userName: this.userName,
          updatedAt: this.updatedAt
        }
      },
      
      getAuthTokenPayload() {
        return {
          userName: this.userName,
          traderID: this.traderID,
          email: this.email,
          role: this.role
        }
      }
    },

    hooks: {
      afterCreate(instance, options){
        
        //Update the default Trader Qualification
        //TraderQualification.registerNewTrader( instance.traderID );

      }
    }
  });

  return Trader;
};
