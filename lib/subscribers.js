(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var add, core, get, jstoxml, libxmljs, list_subscriptions, unsubscribe, update;
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
    add = function(msidn, keyword_id, shortcode, terms, addtl, callback, passthrough, verOverride) {
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
      libxmljs.setTagCompression = 1;
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
                            'value': field.value
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
    get = function(msidn, keyword_id, callback, verOverride) {
      var params, version;
      version = verOverride || null;
      params = {
        'msidn': msidn,
        'keywordId': keyword_id
      };
      return core.callApi('subscribers', 'get_subscriber', params, null, function(err, data, status) {
        var field_list, i, j, returned, subscriber, value_list, values_list, xmlDoc;
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200') {
          subscriber = xmlDoc.get('//subscriber');
          returned = {
            'msidn': msidn,
            'subscriber_id': subscriber.attr('subscriberId').value(),
            'created': subscriber.attr('created').value(),
            'fields': {}
          };
          field_list = xmlDoc.find('//field');
          values_list = xmlDoc.find('//values');
          value_list = xmlDoc.find('//value');
          if (typeof field_list === 'object') {
            i = 0;
            j = 0;
            field_list.forEach(function(field) {
              if (values_list[j].child() !== null) {
                if (typeof value_list[i] === 'object') {
                  returned.fields[field.attr('name').value()] = value_list[i].text();
                }
                i++;
              } else {
                returned.fields[field.attr('name').value()] = '';
              }
              return j++;
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
    update = function(msidn, subscriber_id, keyword_id, shortcode, addtl, callback, passthrough, verOverride) {
      var doc, fields, version, xml_payload;
      version = verOverride || null;
      if (addtl && typeof addtl === 'object') {
        fields = addtl;
      } else {
        fields = [];
      }
      doc = new libxmljs.Document(function(n) {
        return n.node('apiRequest', {
          token: token
        }, function(n) {
          return n.node('updateSubscriber', function(n) {
            return n.node('subscriber', {
              msidn: msidn,
              subscriberId: subscriber_id
            }, function(n) {
              return n.node('keyword', {
                'keywordId': keyword_id,
                'shortcode': shortcode
              }, function(n) {
                if (fields.length > 0) {
                  return n.node('fields', function(n) {
                    return fields.forEach(function(field) {
                      if (field.update_method !== 'overwrite' && field.update_method !== 'append' && field.update_method !== 'remove') {
                        field.update_method = 'overwrite';
                      }
                      return n.node('field', {
                        'name': field.name,
                        'updateMethod': field.update_method
                      }, function(n) {
                        return n.node('fieldValues', function(n) {
                          return n.node('fieldValue', {
                            'value': field.value
                          }, '');
                        });
                      });
                    });
                  });
                }
              });
            });
          });
        });
      });
      xml_payload = doc.toString();
      return core.callApi('subscribers', 'update_subscriber', null, xml_payload, function(err, data, status) {
        var returned, subscriber, xmlDoc;
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200') {
          subscriber = xmlDoc.get('//subscriber');
          if (typeof subscriber === 'object') {
            returned = {
              'msidn': msidn,
              'subscriber_id': subscriber.attr('subscriberId').value(),
              'modified': subscriber.attr('modified').value()
            };
            return callback(null, returned, 200);
          } else {
            return callback({
              'code': xmlDoc.root().attr('statusCode').value(),
              'msg': xmlDoc.root().attr('status').value(),
              'reason': xmlDoc.get('//reason').text()
            });
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
    unsubscribe = function(msidn, keyword_id, shortcode, callback, verOverride) {
      var doc, version, xml_payload;
      version = verOverride || null;
      doc = new libxmljs.Document(function(n) {
        return n.node('apiRequest', {
          token: token
        }, function(n) {
          return n.node('unsubscribeSubscriber', {
            stopService: "false"
          }, function(n) {
            n.node('subscriber', {
              msidn: msidn
            });
            return n.node('keywords', function(n) {
              return n.node('keyword', {
                'keywordId': keyword_id,
                'shortcode': shortcode
              }, '');
            });
          });
        });
      });
      xml_payload = doc.toString();
      return core.callApi('subscribers', 'unsubscribe_subscriber', null, xml_payload, function(err, data, status) {
        var i, keyword_list, returned, subscriber, xmlDoc;
        console.log(data);
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200') {
          subscriber = xmlDoc.get('//subscriber');
          if (typeof subscriber === 'object') {
            returned = {
              'msidn': msidn,
              'subscriber_id': subscriber.attr('subscriberId').value(),
              'unsubscribe_date': subscriber.attr('unsubscribeDate').value(),
              'keywords': []
            };
            keyword_list = xmlDoc.find('//keyword');
            if (typeof keyword_list === 'object' && typeof keyword_list.size !== 'undefined') {
              i = 0;
              keyword_list.forEach(function(keyword) {
                returned.keywords[i] = {
                  keyword_id: keyword.attr('keywordId').value(),
                  shortcode: keyword.attr('shortcode').value()
                };
                return i++;
              });
              return callback(null, returned, 200);
            } else {
              return callback({
                'code': '410',
                'msg': 'Gone',
                'reason': 'User was not subscribed to keyword or has previously unsubscribed.'
              });
            }
          } else {
            return callback({
              'code': '500',
              'msg': 'Unknown Server Error'
            });
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
      version: ver || core.vers['subscribers'],
      list_subscriptions: list_subscriptions,
      add_subscriber: add,
      get_subscriber: get,
      update_subscriber: update,
      unsubscribe_subscriber: unsubscribe
    };
  };
}).call(this);
