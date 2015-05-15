var scss = require("node-sass")
var TerraformError = require("../../error").TerraformError

exports.compile = function(filePath, dirs, fileContents, callback){
  var outputStyle = 'compressed';
  if (process.env.NODE_ENV == 'development' || process.env.HARP_ENV == 'development') {
    outputStyle = 'expanded';
  }

  scss.render({
    file: filePath,
    includePaths: dirs,
    outputStyle: outputStyle
  }, function (e, css) {
    if (e) {
      var error = new TerraformError ({
        source: "Sass",
        dest: "CSS",
        lineno: e.line || 99,
        name: "Sass Error",
        message: e.message,
        filename: e.file || filePath,
        stack: fileContents.toString()
      })
      return callback(error)
    }

    callback(null, css.css)
  });
}
