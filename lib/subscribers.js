(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var add_subscriber, core, get_subscriber, jstoxml, libxmljs, list_subscriptions, unsubscribe_subscriber, update_subscriber;
    core = require('./core')(token, url, ver);
    jstoxml = require('jstoxml');
    libxmljs = require('libxmljs');
    list_subscriptions = function(msidn, callback, verOverride) {
      var params, version;
      version = verOverride || null;
      params = {
        'msidn': msidn
      };
      return core.callApi('subscribers', 'list_subscriptions', params, null, function(err, data, status) {
        var i, returned, subscription_list, xmlDoc;
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200') {
          returned = {
            'msidn': msidn,
            'subscriptions': []
          };
          subscription_list = xmlDoc.find('//subscription');
          if (typeof subscription_list === 'object') {
            i = 0;
            subscription_list.forEach(function(subscription) {
              returned.subscriptions[i] = {
                'keyword_id': subscription.attr('keywordId').value(),
                'keyword_name': subscription.attr('keywordName').value(),
                'date_subscribed': subscription.attr('dateSubscribed').value(),
                'shortcode': subscription.attr('shortcode').value()
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
    add_subscriber = function(msidn, keyword_id, shortcode, terms, addtl, callback, passthrough, verOverride) {
      var doc, fields, version, xml_payload;
      version = verOverride || null;
      if (addtl && typeof addtl === 'object') {
        fields = addtl;
      } else {
        fields = [];
      }
      if (terms === true) {
        terms = 'true';
      } else {
        terms = 'false';
      }
      doc = new libxmljs.Document(function(n) {
        return n.node('apiRequest', {
          token: token
        }, function(n) {
          return n.node('addSubscriber', function(n) {
            n.node('subscriber', {
              msidn: msidn
            }, function(n) {
              return n.node('keyword', {
                'keywordId': keyword_id,
                'shortcode': shortcode
              }, function(n) {
                if (fields.length > 0) {
                  return n.node('fields', function(n) {
                    return fields.forEach(function(field) {
                      return n.node('field', {
                        'name': field.name
                      }, function(n) {
                        return n.node('fieldValues', function(n) {
                          return n.node('fieldValue', {
                            'value': field.name
                          }, '');
                        });
                      });
                    });
                  });
                }
              });
            });
            return n.node('terms', terms);
          });
        });
      });
      xml_payload = doc.toString();
      return core.callApi('subscribers', 'add_subscriber', null, xml_payload, function(err, data, status) {
        var i, returned, subscriber_list, xmlDoc;
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200' || xmlDoc.root().attr('statusCode').value() === '201') {
          returned = {
            'msidn': msidn,
            'subscriber': []
          };
          subscriber_list = xmlDoc.find('//subscriber');
          if (typeof subscriber_list === 'object') {
            i = 0;
            subscriber_list.forEach(function(subscriber) {
              returned.subscriber[i] = {
                'msidn': subscriber.attr('msidn').value(),
                'subscriber_id': subscriber.attr('subscriberId').value()
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
    get_subscriber = function(msidn, keywordId, callback, verOverride) {
      var params, version;
      version = verOverride || null;
      params = {
        'msidn': msidn
      };
      return core.callApi('subscribers', 'get_subscriber', params, null, callback, version);
    };
    update_subscriber = function(msidn, keyword_id, shortcode, callback, verOverride) {
      var version;
      version = verOverride || null;
      return core.callApi('subscribers', 'unsubscribe_subscriber', params, null, callback, version);
    };
    unsubscribe_subscriber = function(msidn, keyword_id, shortcode, callback, verOverride) {
      var version;
      version = verOverride || null;
      return core.callApi('subscribers', 'unsubscribe_subscriber', params, null, callback, version);
    };
    return {
      version: ver || core.vers['subscribers'],
      list_subscriptions: list_subscriptions,
      add_subscriber: add_subscriber,
      get_subscriber: get_subscriber,
      update_subscriber: update_subscriber,
      unsubscribe_subscriber: unsubscribe_subscriber
    };
  };
}).call(this);
