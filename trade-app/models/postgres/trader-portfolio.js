module.exports = function(sequelize, DataTypes) {

  var TraderPortfolio = sequelize.define('TraderPortfolio', {

    traderPortfolioID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },

    companyCode: {
      type: DataTypes.STRING,
      allowNull: false
    },

    companyName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    totalShares: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: { 
     
    }
  });

  return TraderPortfolio;
};