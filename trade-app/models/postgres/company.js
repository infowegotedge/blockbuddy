import AppConfig from "../../config/app-config";
import randomstring from "randomstring";
import _ from "lodash";

module.exports = function(sequelize, DataTypes) {//@TODO add check so that a single user can create company once

  var Company = sequelize.define('Company', {

    companyID: {
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
      allowNull: false,
      unique: {
        args: true,
        msg: 'Company Code must be unique.'
      }
    },
    
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Company Name must be unique.'
      }
    },
    
    companyShortDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    companyLongDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    companyAddress: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    companyURL: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyEmail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    companyContactNumber: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    companyMeta: {
      type: DataTypes.JSON,
      allowNull: true
    },

    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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

    getterMethods: {

      isCompanyActive() {
        return (this.isActive && this.isApproved);
      },

      getRecord() {
        return {
          companyCode: this.companyCode,
          companyName: this.companyName,
          companyShortDescription: this.companyShortDescription,
          companyLongDescription: this.companyLongDescription,
          companyAddress: this.companyAddress,
          companyURL: this.companyURL,
          companyEmail: this.companyEmail,
          companyContactNumber: this.companyContactNumber,
          companyMeta: this.companyMeta,
          isApproved: this.isApproved,
          isActive: this.isActive
        }
      }

    },

    hooks: {

    }

    });

  /**
   * List all active companies created in the system
   * @param page {number} Page Number
   * @param limit {number} Number of results per page
   * @param transaction
   * @returns {object} collection of rows and count
   */
  Company.listAllActive = async( page = 1, limit = AppConfig.defaultListSize,  transaction = null ) => {

    if (_.isNull( page ) || _.isUndefined( page ) || _.isNull( limit ) || _.isUndefined( limit )) {
      throw new Error("Invalid query parameters");
    }

    page = parseInt( page );
    limit = parseInt( limit );

    let offset = 0;

    if ( page > 1 ) {
      offset = (page - 1) * limit;
    }

    if (!_.isFinite(page) || !_.isFinite(limit) || limit > 100 || limit <= 0 || page <= 0) {
      throw new Error("Invalid query parameters");
    }

    let query = {
      where: {
        isActive: true
      },
      offset,
      limit,
      order: [['updatedAt', 'DESC']],
      transaction
    };

    return await Company.findAndCount( query );

  };

  return Company;
};