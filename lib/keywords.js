(function() {
  var exports;
  exports = module.exports = function(token, ver) {
    var core;
    core = require('./core')(token);
    return {
      version: ver || core.vers['keywords']
    };
  };
}).call(this);
