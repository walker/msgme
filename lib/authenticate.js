(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var core, jstoxml, libxmljs;
    core = require('./core')(token, url, ver);
    jstoxml = require('jstoxml');
    libxmljs = require('libxmljs');
    return {
      version: ver || core.vers['authenticate'],
      authenticate_api: function(api_key, account_name, callback, verOverride) {
        var version, xml_payload;
        version = verOverride || null;
        xml_payload = jstoxml.toXML({
          'apiRequest': {
            'authenticateAPI': {
              'apiKey': api_key,
              'accountName': account_name
            }
          }
        }, true);
        return core.callApi('authenticate', 'authenticate_api', null, xml_payload, function(err, result, status) {
          var xmlDoc;
          xmlDoc = libxmljs.parseXmlString(result);
          if (xmlDoc.root().attr('statusCode').value() === '200') {
            return callback(null, xmlDoc.get('//authToken').text(), 200);
          } else {
            return callback({
              'code': xmlDoc.root().attr('statusCode').value(),
              'msg': xmlDoc.root().attr('status').value()
            });
          }
        }, version);
      },
      get_account_ids: function(api_key, account_name, callback, verOverride) {
        var version;
        return version = verOverride || null;
      }
    };
  };
}).call(this);
