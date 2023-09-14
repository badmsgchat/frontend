const {minify} = require('../node_modules/uglify-js');
const fs = require('fs'),
      path = require('path');

const config = {
  directory: path.join(__dirname, 'js'),
  output: path.join(__dirname, 'assets', 'script.min.js'),
  uglifyConfig: { mangle: true, compress: true }
};



function getFiles(dir, array) {
  var files = fs.readdirSync(dir);
  var array = array || [];

  files.forEach(f => {
    const fpath = path.join(dir, f);

    if (fs.statSync(fpath).isDirectory()) {
      array = getFiles(fpath, array);
    } else {
      if (f.endsWith('.js')) {
        array.push(fpath);
      }
    }
  });

  return array;
}


// sort all files based on numbers, and concatenate
const files = getFiles(config.directory);
const sorted = files.sort((a, b) => {
  a = parseInt(a.split('.')[0]);
  b = parseInt(b.split('.')[0]);

  return a - b;
});

const concatenated = sorted.map(fpath => {
  return fs.readFileSync(fpath, 'utf-8');
}).join('\n');


// minify
const minified = minify(concatenated, config.uglifyConfig).code;
fs.writeFileSync(config.output, minified, 'utf-8');