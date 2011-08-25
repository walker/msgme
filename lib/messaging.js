(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var core, get_delivery_receipts, get_message_activity, get_message_status, get_mo_message, get_mt_message, libxmljs, send_keyword_content, send_message, send_subscribers_message;
    core = require('./core')(token, url, ver);
    libxmljs = require('libxmljs');
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
    send_message = function(account_id, shortcode, message, msidns, schedule, callback, verOverride) {
      var d, date, doc, e, hours, minutes, month, seconds, serconds, version, xml_payload;
      version = verOverride || null;
      if (!schedule || schedule === null || typeof schedule !== 'string') {
        d = new Date();
        if (d.getSeconds() > 29) {
          e = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 1, d.getSeconds() + 30);
        } else {
          e = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds() + 30);
        }
        e = new Date(d.getTime() + 5000);
        month = e.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        } else {
          month = month;
        }
        if (e.getDate() < 10) {
          date = '0' + e.getDate();
        } else {
          date = e.getDate();
        }
        if (e.getHours() < 10) {
          hours = '0' + e.getHours();
        } else {
          hours = e.getHours();
        }
        if (e.getMinutes() < 10) {
          minutes = '0' + e.getMinutes();
        } else {
          minutes = e.getMinutes();
        }
        if (e.getSeconds() < 10) {
          serconds = '0' + e.getSeconds();
        } else {
          seconds = e.getSeconds();
        }
        schedule = e.getFullYear() + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
      }
      libxmljs.setTagCompression = 1;
      doc = new libxmljs.Document(function(n) {
        return n.node('apiRequest', {
          token: token
        }, function(n) {
          return n.node('SendMessage', {
            'accountId': account_id
          }, function(n) {
            if (msidns.length > 0) {
              n.node('msidns', function(n) {
                return msidns.forEach(function(msidn) {
                  return n.node('msidn', {
                    'terms': 'true'
                  }, msidn);
                });
              });
            }
            n.node('shortcode', shortcode);
            n.node('message', message);
            return n.node('schedule', schedule);
          });
        });
      });
      xml_payload = doc.toString();
      return console.log(xml_payload);
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
