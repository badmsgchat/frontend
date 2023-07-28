var fs = require('fs');
var {minify} = require('../node_modules/uglify-js');

// build script.min.js
var fnames = fs.readdirSync("./frontend/deps");
fnames.sort(function(a, b){
    return parseInt(a.split('.')[0]) - parseInt(b.split('.')[0]);
});

var content = fnames.map(function(fname) {
  return fs.readFileSync("./frontend/deps/"+fname, "utf-8");
}).join(" \n");

var min = minify(content, {mangle: true, compress: true});
fs.writeFileSync("./frontend/assets/script.min.js", min.code, "utf-8");