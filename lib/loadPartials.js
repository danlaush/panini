var fs    = require('fs');
var path  = require('path');
var utils = require('./utils');

/**
 * Looks for files with .html, .hbs, or .handlebars extensions within the given directory, and adds them as Handlebars partials matching the name of the file.
 * @param {string} dir - Folder to check for partials.
 */
module.exports = function(dir) {
  var partials = utils.loadFiles(dir, '**/*.{html,hbs,handlebars}');
  // Get the absolute directory of each partials folder
  var partial_dirs = [];
  for (var i in dir) {
    partial_dirs[i] = path.join(process.cwd(), dir[i]);
  }

  for (var i in partials) {
    var file = fs.readFileSync(partials[i]);

    // create name w/ subfolders for handlebars partial
    // get the partial's absolute path
    var full_name = partials[i];
    // get the file name
    var file_name = path.basename(full_name);
    // remove partial directory from string
    var local_dir = full_name;
    for (var i in partial_dirs) {
      local_dir = local_dir.replace(partial_dirs[i], "");
    }
    // remove filename and forward/trailing slashes
    var name = local_dir.replace(file_name, "").replace(/\/+$/, "").replace(/^\/+/,"");
    
    this.Handlebars.registerPartial(name, file.toString() + '\n');
  }
}