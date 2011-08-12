(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var core, get_delivery_receipts, get_message_activity, get_message_status, get_mo_message, get_mt_message, send_keyword_content, send_message, send_subscribers_message;
    core = require('./core')(token, url, ver);
    get_delivery_receipts = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    get_message_activity = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    get_message_status = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    get_mo_message = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    get_mt_message = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    send_keyword_content = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    send_message = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    send_subscribers_message = function(verOverride) {
      var version;
      return version = verOverride || null;
    };
    return {
      version: ver || core.vers['messaging'],
      get_delivery_receipts: get_delivery_receipts,
      get_message_activity: get_message_activity,
      get_message_status: get_message_status,
      get_mo_message: get_mo_message,
      get_mt_message: get_mt_message,
      send_keyword_content: send_keyword_content,
      send_message: send_message,
      send_subscribers_message: send_subscribers_message
    };
  };
}).call(this);
