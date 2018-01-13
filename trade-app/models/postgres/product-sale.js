module.exports = function(sequelize, DataTypes) {

  var ProductSale = sequelize.define('ProductSale', {

    productSaleID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },

    gatewayResponse: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    note: {
      type: DataTypes.TEXT
    },

    orderTotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    orderID:{
      type: DataTypes.STRING,
      allowNull: false
    },

    productSku: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    sponsorUserName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    isProcessed: {
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
     
    },

    getterMethods: {

      getAdminRecord() {
        return {
          productSaleID: this.productSaleID,
          gatewayResponse: this.gatewayResponse,
          traderID: this.traderID,
          note: this.note,
          orderTotal: this.orderTotal,
          orderID: this.orderID,
          productSku: this.productSku,
          sponsorUserName: this.sponsorUserName,
          isProcessed: this.isProcessed,
          productID: this.productID,
          updatedAt: this.updatedAt
        }
      },

      getRecord() {
        return {
          gatewayResponse: this.gatewayResponse,
          traderID: this.traderID,
          note: this.note,
          orderTotal: this.orderTotal,
          orderID: this.orderID,
          productSku: this.productSku,
          isProcessed: this.isProcessed,
          updatedAt: this.updatedAt
        }
      },
    }
    
  
  });

  return ProductSale;
};