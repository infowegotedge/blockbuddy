module.exports = function(sequelize, DataTypes) {

  var StockReport = sequelize.define('StockReport', {
    stockReportID: {
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

    companyID: {
      type: DataTypes.STRING,
      allowNull: true
    },

    unitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },

    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },

    day: {
      type: DataTypes.STRING,
      allowNull: false
    },

    completeDate: {
      type: DataTypes.STRING,
      allowNull: false
    },

    date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    month: {
      type: DataTypes.STRING,
      allowNull: false
    },

    monthNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    HH: {
      type: DataTypes.STRING,
      allowNull: false
    },

    mm: {
      type: DataTypes.STRING,
      allowNull: false
    },

    ss: {
      type: DataTypes.STRING,
      allowNull: false
    }
    
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here

      }
    },
    hooks: {

    }
  });

  return StockReport;
};