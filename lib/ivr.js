(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var core, delete_inbound_vmails, get_inbound_vmails, get_outbound_vmails, send_ivr_message;
    core = require('./core')(token, url, ver);
    get_inbound_vmails = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    get_outbound_vmails = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    delete_inbound_vmails = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    send_ivr_message = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    return {
      version: ver || core.vers['ivr'],
      get_inbound_vmails: get_inbound_vmails,
      get_outbound_vmails: get_outbound_vmails,
      delete_inbound_vmails: delete_inbound_vmails,
      send_ivr_message: send_ivr_message
    };
  };
}).call(this);
