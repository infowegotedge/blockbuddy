'use strict';

const fs     = require('fs');
let walkSync = (dir, prefix, filelist) => {
  let files  = fs.readdirSync(dir);
  filelist   = filelist || [];

  files.forEach(function(file) {
    let isDir = fs.statSync(dir + '/' + file).isDirectory();
    if (isDir) {
      filelist = walkSync(dir + '/' + file, prefix, filelist);
    }
    else if(!isDir && file.indexOf(prefix) >= 0) {
      filelist.push(dir + '/' + file);
    }
  });

  return filelist;
}

exports.loadModels = (filePath, prefix, provider) => {

  let files   = walkSync(filePath, prefix);
  let _models = {};
  let key     = '';

  try {
    for(key in files) {
      let _model = require(files[key]);
      _models[_model.getName()] = new _model(provider);
    }
    return _models;
  }
  catch(e) {
    let _m = 'Unable to load model: '+files[key]+', Message: '+e.message;
    throw new Error(_m);
  }
};
