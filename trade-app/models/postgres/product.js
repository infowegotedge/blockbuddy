import AppConfig from "../../config/app-config";

module.exports = function(sequelize, DataTypes) {

  var Product = sequelize.define('Product', {

    productID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },

    productType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [ AppConfig.productType ]
      }
    },

    productSku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'SKU must be unique.'
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    productMeta: {
      type: DataTypes.JSON
    },

    sellingPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    compensationWallet: {
      type: DataTypes.JSON
    },

    compensationPortfolio: {
      type: DataTypes.JSON
    },

    compensation: {
      type: DataTypes.JSON
    },

    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
          productID: this.productID,
          productType: this.productType,
          productSku: this.productSku,
          description: this.description,
          productName: this.productName,
          productMeta: this.productMeta,
          sellingPrice: this.sellingPrice,
          compensationWallet: this.compensationWallet,
          compensationPortfolio: this.compensationPortfolio,
          compensation: this.compensation,
          isActive: this.isActive,
          isRecurring: this.isRecurring,
          updatedAt: this.updatedAt
        }
      },

      getRecord() {
        return {
          productType: this.productType,
          productSku: this.productSku,
          description: this.description,
          productName: this.productName,
          productMeta: this.productMeta,
          sellingPrice: this.sellingPrice,
          compensationWallet: this.compensationWallet,
          compensationPortfolio: this.compensationPortfolio,
          compensation: this.compensation,
          isActive: this.isActive,
          isRecurring: this.isRecurring,
          updatedAt: this.updatedAt
        }
      },
    }
    
  });

  return Product;
};