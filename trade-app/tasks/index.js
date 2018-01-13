var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);

var tasks = [];

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-8) === '.task.js');
    })
    .forEach(function(file) {
        tasks.push( require(path.join(__dirname, file)) ); //Import all Tasks
    });
