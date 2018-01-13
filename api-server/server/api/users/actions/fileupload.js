'use strict';

let ApiBaseActions = require('./../../apibase.actions');
const AWS          = require('aws-sdk');
const fs           = require('fs');
const uuid         = require('uuid');

class FileUpload extends ApiBaseActions {

  /**
   * Constructor
   * @param {Request} request 
   * @param {Replay} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
    this.s3  = new AWS.S3({
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      // region: process.env.AWS_REGION,
      apiVersion: process.env.AWS_API_VERSION,
      params: {Bucket: process.env.AWS_BUCKET}
    });
  }

  /**
   * Generate Output
   * @param {Number} code 
   * @param {Object} data 
   * @param {Error} error 
   */
  out(code, data, error) {
    if(error) {
      super.logger.logError(error);
    }

    if(data.hasError) {
      super.logger.logWarning(data.message);
    }

    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let that     = this;
    let payload  = this.req.payload;
    let Users    = this.app.users;
    let userId   = this.req.auth.credentials.id;
    let file     = payload.file;
    let fileName = '';

    if(!file && payload.govPhotoId) {
      file = payload.govPhotoId;
      fileName = 'gov_photo/';
    }
    else if(!file && payload.taxPhotoId) {
      file = payload.taxPhotoId;
      fileName = 'tax_photo/';
    }
    else if(!file && payload.cmsPhoto) {
      file = payload.cmsPhoto
      fileName = 'cmsPhoto/';
    }
    else if(!file && !payload.taxPhotoId && !payload.govPhotoId) {
      return that.out(200, {"hasError": true, "message": "File not found."});
    }

    let filePath    = process.env.AWS_UPLOAD+'/'+fileName+uuid.v1()+'-'+file.filename;
    let contentType = file.headers['content-type'];
    let readStream  = fs.createReadStream(file.path);
    let params      = {Key: filePath, Body: readStream, ACL: process.env.AWS_ACL, ContentType: contentType};

    that.s3.upload(params, function(err, data) {
      if (err) {
        return that.out(200, {"hasError": true, "message": err}, err);
      } else {

        if(fileName !== '') {
          return that.out(200, {
            "hasError": false,
            "path": data.Location,
            "message": 'Image uploaded successfully'
          }, null);
        }
        else {
          Users.updateImage(userId, filePath, function(e, u) {
            if(e) {
              return that.out(200, {"hasError": true, "message": u}, e);
            }
  
            return that.out(200, {
              "hasError": false,
              "path": data.Location,
              "message": 'Avatar uploaded successfully'
            }, null)
          });
        }
      }
    });
  }
}

module.exports = (request, reply) => {
  let fileupload = new FileUpload(request, reply);
  return fileupload.processRequest();
}