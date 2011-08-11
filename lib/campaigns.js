(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var core;
    core = require('./core')(token, url, ver);
    return {
      version: ver || core.vers['campaigns']
    };
  };
}).call(this);
