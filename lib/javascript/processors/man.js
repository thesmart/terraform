var fs = require("fs");
var path = require("path");
var cs = require("coffee-script");
var TerraformError = require("../../error").TerraformError;
var REGEX_DIR_STAR = /(\/\*|\/|\*)$/;
var REGEX_COFFEE_EXT = /\.coffee$/;
var REGEX_JS_EXT = /\.js/;
var REGEX_HIDDEN_PRE = /^_/;

function compileManifest(filePath, fileContents) {
  var manifest = JSON.parse(fileContents.toString());
  if (manifest['manifest']) {
    manifest = manifest['manifest']
  } else {
    throw new Error('manifest is invalid format');
  }

  // we're first going to locate all scripts relative to the man file
  var allScripts = [];
  var manFolderPath = path.dirname(filePath);

  // find all scripts mentioned by the manifest
  for (var i = 0, l = manifest.length; i < l; ++i) {
    var relPathToScript = manifest[i];
    if (REGEX_JS_EXT.test(relPathToScript) || REGEX_COFFEE_EXT.test(relPathToScript)) {
      var scriptPath = path.resolve(manFolderPath, relPathToScript);
      allScripts.push(scriptPath);
    } else if (REGEX_DIR_STAR.test(relPathToScript)) {
      var relPathToScripts = relPathToScript.replace(REGEX_DIR_STAR, '');
      var absPathToScripts = path.resolve(manFolderPath, relPathToScripts);
      var subScripts = scanPathForScripts(absPathToScripts)
      allScripts.push.apply(allScripts, subScripts);
    }
  }

  // COMPILE PHASE
}

function scanPathForScripts(absPath) {
  var scripts = [];
  var dirs = [];
  var files = [];

  fs.readdirSync(absPath).forEach(function(scriptName) {
    if (REGEX_HIDDEN_PRE.test(scriptName)) {
      // hidden file name
      return;
    }
    var currentAbsPath = path.join(absPath, scriptName);
    var pathStat = fs.statSync(currentAbsPath);
    if (pathStat.isDirectory()) {
      dirs.push(currentAbsPath);
    } else if (pathStat.isFile() && (REGEX_JS_EXT.test(currentAbsPath) || REGEX_COFFEE_EXT.test(currentAbsPath))) {
      files.push(currentAbsPath);
    }
  });

  dirs.sort(function(a, b) {
    return a < b ? -1 : 1;
  }).forEach(function(current) {
    var nextScripts = scanPathForScripts(current);
    scripts.push.apply(scripts, nextScripts); // append
  });

  files.sort(function(a, b) {
    return a < b ? -1 : 1;
  }).forEach(function(current) {
    scripts.push(current); // append
  });

  return scripts;
}

function compileJavaScript(filePath, javaScript) {
  var error = null;
  try{
    var script = cs.compile(coffeeScript, { bare: true })
    return script;
  }catch(e){
    e.source = "SmangPack";
    e.dest = "JavaScript";
    e.filename = filePath;
    e.stack = fileContents.toString();
    e.lineno = parseInt(e.location.first_line ? e.location.first_line + 1 : -1);
    throw new TerraformError(e)
  }
}

function compileCoffeeScript(filePath, coffeeScript) {
  try{
    var script = cs.compile(coffeeScript, { bare: true })
    return script;
  }catch(e){
    e.source = "SmangPack";
    e.dest = "JavaScript";
    e.filename = filePath;
    e.stack = coffeeScript.toString();
    e.lineno = parseInt(e.location.first_line ? e.location.first_line + 1 : -1);
    throw new TerraformError(e);
  }
}

exports.compile = function(filePath, fileContents, callback){
  var script, error = null;

  try {
    script = compileManifest(filePath, fileContents, callback);
    callback(null, script);
  } catch(e) {
    error = e;
  }
  callback(error, script);
};
