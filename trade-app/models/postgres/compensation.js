module.exports = function(sequelize, DataTypes) {

  var Compensation = sequelize.define('Compensation', {
    
    compensationID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },

    compensationName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    description: {
      type: DataTypes.TEXT
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
          compensationID: this.compensationID,
          compensationName: this.compensationName,
          isActive: this.isActive,
          description: this.description
        }
      },

      getRecord() {
        return {
          name: this.name,
          isActive: this.isActive,
          description: this.description
        }
      }

    },

  });

  return Compensation;
};