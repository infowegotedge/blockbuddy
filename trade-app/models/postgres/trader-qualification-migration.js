module.exports = function(sequelize, DataTypes) {

  var TraderQualificationMigration = sequelize.define('TraderQualificationMigration', {

    traderQualificationMigrationID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },

    note: {
      type: DataTypes.TEXT,
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

  return TraderQualificationMigration;
};