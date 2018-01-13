module.exports = function(sequelize, DataTypes) {

  var TraderWallet = sequelize.define('TraderWallet', {
    traderWalletID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },

    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },

    currencyCode: {
      type: DataTypes.STRING,
      allowNull: false
    },

    currencyName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    traderID: { type: DataTypes.STRING,  unique: 'compositeIndex' },

    currencyID: { type: DataTypes.STRING, unique: 'compositeIndex' }
    
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //TraderWallet.belongsTo( models.Trader, { foreignKey: "traderID" });
      }
    },
    
    hooks: {

    }
  });

  return TraderWallet;
};