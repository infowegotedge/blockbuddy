module.exports = function(sequelize, DataTypes) {

  var Currency = sequelize.define('Currency', {

    currencyID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },
    
    currencyCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Currency Code must be unique.'
      },
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'Currency Code must be in alphanumeric'
        }
      }
    },
    currencyName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Currency name must be unique.'
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }

  }, {

    classMethods: {
      associate: function(models) {
        // associations can be defined here

      }
    },

    getterMethods: {

      getAdminRecord() {
        return {
          currencyID: this.currencyID,
          currencyCode: this.currencyCode,
          currencyName: this.currencyName,
          description: this.description,
          updatedAt: this.updatedAt
        }
      },
      
      getRecord() {
        return {
          currencyCode: this.currencyCode,
          currencyName: this.currencyName,
          description: this.description,
          updatedAt: this.updatedAt
        }
      }

    },

    hooks: {

    }

    });

  return Currency;
};