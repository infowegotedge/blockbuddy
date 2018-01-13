module.exports = function(sequelize, DataTypes) {

  var TraderQualification = sequelize.define('TraderQualification', {

    traderQualificationID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'ID must be unique.'
      },
      primaryKey: true
    },
    
    qualificationCode: {
      type: DataTypes.STRING,
      allowNull: false
    },

    qualificationName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    traderID: { type: DataTypes.STRING,  unique: 'compositeIndex' },

    qualificationID: { type: DataTypes.STRING, unique: 'compositeIndex' }
    
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: { 
     
    }
  });

  return TraderQualification;
};