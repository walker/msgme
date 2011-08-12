(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var core, create, remove;
    core = require('./core')(token, url, ver);
    create = function(campaign, keyword, subscription, optin_message, confirm_message, do_not_send_content, limit_subscribers, max_subscribers, schedule, scheduled_datetime, time_zone, type, content, uri, title, description, verOverride) {
      var version;
      return version = verOverride || null;
    };
    remove = function(account_id, campaign_id, verOverride) {
      var version;
      return version = verOverride || null;
    };
    return {
      version: ver || core.vers['campaigns'],
      create_campaign: create,
      delete_campaign: remove
    };
  };
}).call(this);
