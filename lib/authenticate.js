(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var core, libxmljs;
    core = require('./core')(token, url, ver);
    libxmljs = require('libxmljs');
    return {
      version: ver || core.vers['authenticate'],
      authenticate_api: function(api_key, account_name, callback, verOverride) {
        var doc, version, xml_payload;
        version = verOverride || null;
        doc = new libxmljs.Document(function(n) {
          return n.node('apiRequest', function(n) {
            return n.node('authenticateAPI', function(n) {
              n.node('apiKey', api_key);
              return n.node('accountName', account_name);
            });
          });
        });
        xml_payload = doc.toString();
        return core.callApi('authenticate', 'authenticate_api', null, xml_payload, function(err, data, status) {
          var xmlDoc;
          xmlDoc = libxmljs.parseXmlString(data);
          if (xmlDoc.root().attr('statusCode').value() === '200') {
            return callback(null, xmlDoc.get('//authToken').text(), 200);
          } else {
            return callback({
              'code': xmlDoc.root().attr('statusCode').value(),
              'msg': xmlDoc.root().attr('status').value(),
              'reason': xmlDoc.get('//reason').text()
            });
          }
        }, version);
      },
      get_account_ids: function(callback, verOverride) {
        var version;
        if (typeof version !== 'string' || typeof version !== 'number') {
          verOverride = null;
        }
        version = verOverride || null;
        return core.callApi('authenticate', 'get_account_ids', null, null, function(err, data, status) {
          var account_list, i, returned, xmlDoc;
          xmlDoc = libxmljs.parseXmlString(data);
          if (xmlDoc.root().attr('statusCode').value() === '200') {
            returned = [];
            account_list = xmlDoc.find('//account');
            if (typeof account_list === 'object') {
              i = 0;
              account_list.forEach(function(account) {
                returned[i] = {
                  'account_id': account.attr('accountId').value(),
                  'account_name': account.attr('accountName').value()
                };
                return i++;
              });
            }
            return callback(null, returned, 200);
          } else {
            return callback({
              'code': xmlDoc.root().attr('statusCode').value(),
              'msg': xmlDoc.root().attr('status').value(),
              'reason': xmlDoc.get('//reason').text()
            });
          }
        }, version);
      }
    };
  };
}).call(this);
