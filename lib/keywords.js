(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var available, core, get, libxmljs;
    core = require('./core')(token, url, ver);
    libxmljs = require('libxmljs');
    get = function(account_id, shortcode, callback, past_24_hours, date_created, verOverride) {
      var method, params, version;
      version = verOverride || null;
      params = {
        'accountId': account_id,
        'shortcode': shortcode
      };
      if (past_24_hours === true) {
        method = 'get_new_keywords';
      } else if (date_created) {
        method = 'get_new_keywords';
        params.dateCreated = date_created;
      } else {
        method = 'get_keywords';
      }
      return core.callApi('keywords', method, params, null, function(err, data, status) {
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
    available = function(keyword_name, account_id, shortcode, callback, verOverride) {
      var params, version;
      version = verOverride || null;
      params = {
        'keyword_name': account_id,
        'accountId': account_id,
        'shortcode': shortcode
      };
      return core.callApi('keywords', 'keyword_available', params, null, function(err, data, status) {
        var keyword, xmlDoc;
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200') {
          keyword = xmlDoc.find('//keyword');
          if (typeof keyword === 'object') {
            if (keyword.attr('available').value()) {
              return callback(null, keyword.attr('available').value(), 200);
            } else {
              return callback(null, false, 200);
            }
          } else {
            return callback(null, false, 200);
          }
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
      get_keywords: get,
      keyword_available: available,
      get_new_keywords: function() {
        return console.log('Use get_keywords and add TRUE as 4th argument for last 24 hours, or false for the 4th argument and YYYYMMDD as the 5th argument.');
      }
    };
  };
}).call(this);
