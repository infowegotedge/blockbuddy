module.exports = function(sequelize, DataTypes) {

  var Qualification = sequelize.define('Qualification', {
    
    qualificationID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },

    qualificationName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    qualificationCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Qualification code must be unique.'
      }
    },

    description: {
      type: DataTypes.TEXT
    },
    
    constraints: {
      type: DataTypes.JSON,
      allowNull: false
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
          qualificationID: this.qualificationID,
          qualificationName: this.qualificationName,
          qualificationCode: this.qualificationCode,
          constraints: this.constraints,
          isActive: this.isActive,
          description: this.description,
          updatedAt: this.updatedAt
        }
      },

      getRecord() {
        return {
          qualificationName: this.qualificationName,
          qualificationCode: this.qualificationCode,
          description: this.description,
          isActive: this.isActive,
          updatedAt: this.updatedAt
        }
      }

    },

  });

  return Qualification;
};