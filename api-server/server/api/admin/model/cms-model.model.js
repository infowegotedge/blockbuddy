'use strict';

// const crypt = require('crypto')

class CMSModel {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // CMS Schema Definition
    let cmsSchema = new Schema({
      cms_heading: { type: String },
      cms_slug: { type: String },
      cms_content: { type: String },
      cms_photo: { type: String },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date },
      active: { type: Boolean, "default": true },
      enable_disable: { type: Boolean, "default": true }
    });

    // CMS Schema
    cmsSchema.index({created_at:1})
    this.CMS = connection.model('CMSContent', cmsSchema);
  }

  createContent(newValue, cb) {
    let time = (new Date()).toISOString();
    let slug = newValue.heading.replace(/\s/g, '-').toLowerCase();

    let cmsData = {
      cms_heading: newValue.heading,
      cms_content: newValue.content,
      cms_photo: newValue.photo,
      cms_slug: slug,
      created_at: time,
      updated_at: time,
      active: true,
      enable_disable: true
    };

    let cms = new this.CMS(cmsData);
    cms.save(cb);
  }

  updateContent(cmsID, newValue, cb) {
    let time = (new Date()).toISOString();
    let cmsData = {
      cms_heading: newValue.heading,
      cms_content: newValue.content,
      cms_photo: newValue.photo,
      updated_at: time
    };

    return this.CMS.update({'_id': cmsID}, cmsData, cb);
  }

  deleteContent(cmsID, cb) {
    return this.CMS.update({'_id': cmsID}, { 'active': false, 'enable_disable': false }, cb);
  }

  deActivateContent(cmsID, cb) {
    return this.CMS.update({'_id': cmsID}, { 'active': false }, cb);
  }

  listCount(cb) {
    return this.CMS.count(cb);
  }

  list(currentPage, perPage, cb) {
    let offset = ((currentPage - 1) * perPage);
    
    let queryObj = this.CMS.find({}).sort({"_id": -1}).limit(perPage);
    if(offset !== 0) {
      queryObj = queryObj.skip(offset);
    }

    this.listCount((e, c) => {
      return queryObj.exec((_e, u) => {
        if(!_e) {
          return cb(false, {"cmsContent": u, "totalPages": c});
        }
        else {
          return cb(true, 'CMS content not found.');
        }
      });
    });
  }

  listContent(cb) {
    let queryObj = this.CMS.find({'active': true, 'enable_disable': true}).sort({"_id": -1}).limit(4);

    return queryObj.exec((_e, u) => {
      if(!_e) {
        return cb(false, u);
      }
      else {
        return cb(true, 'CMS content not found.');
      }
    });
  }
}

module.exports = CMSModel;
module.exports.getName = () => {
  return 'cms';
}