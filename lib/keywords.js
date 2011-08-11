(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var core, get_keywords, libxmljs;
    core = require('./core')(token, url, ver);
    libxmljs = require('libxmljs');
    get_keywords = function(account_id, shortcode, callback, verOverride) {
      var params, version;
      version = verOverride || null;
      params = {
        'accountId': account_id,
        'shortcode': shortcode
      };
      return core.callApi('keywords', 'get_keywords', params, null, function(err, data, status) {
        var i, keyword_list, returned, xmlDoc;
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200') {
          returned = {
            'shortcode': shortcode,
            'keywords': []
          };
          keyword_list = xmlDoc.find('//keyword');
          if (typeof keyword_list === 'object') {
            i = 0;
            keyword_list.forEach(function(keyword) {
              returned.keywords[i] = {
                'keyword_id': keyword.attr('keywordId').value(),
                'keyword_name': keyword.attr('keywordName').value(),
                'subscription': keyword.attr('subscription').value(),
                'created_date': keyword.attr('createdDate').value(),
                'account_id': keyword.attr('accountId').value()
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
    };
    return {
      version: ver || core.vers['keywords'],
      'get_keywords': get_keywords
    };
  };
}).call(this);
