(function() {
  var exports;
  exports = module.exports = function(token, set_callback, non_standard_url, vers) {
    var auth, url;
    if (non_standard_url && typeof non_standard_url === 'string') {
      url = non_standard_url;
    } else {
      url = null;
    }
    if (!token || typeof token !== 'string') {
      if (typeof token === 'object' && token.acctname && token.api_key) {
        auth = require('./authenticate')(token, url, vers);
        return auth.authenticate_api(token.api_key, token.acctname, function(err, data, status) {
          var new_token;
          if (!err) {
            new_token = data;
            return set_callback({
              token: new_token,
              version: '0.1',
              authenticate: require('./authenticate')(new_token, url, vers),
              subscribers: require('./subscribers')(new_token),
              subscriptions: require('./subscriptions')(new_token),
              campaigns: require('./campaigns')(new_token),
              keywords: require('./keywords')(new_token),
              ivr: require('./ivr')(new_token),
              messaging: require('./messaging')(new_token)
            });
          } else {
            new Error('MsgMe: We were unable to acquire an API authentication token.');
          }
        });
      } else {
        new Error('MsgMe: Token (Account name/Api Key) is required, sign up for a MsgMe.com account if you do not have one.');
      }
    } else {
      return {
        token: token,
        version: '0.1',
        authenticate: require('./authenticate')(token, url, vers),
        subscribers: require('./subscribers')(token),
        subscriptions: require('./subscriptions')(token),
        campaigns: require('./campaigns')(token),
        keywords: require('./keywords')(token),
        ivr: require('./ivr')(token),
        messaging: require('./messaging')(token)
      };
    }
  };
}).call(this);
