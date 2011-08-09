(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var add_subscriber, core, get_subscriber, list_subscriptions, unsubscribe_subscriber, update_subscriber, _parse_payload_fields;
    core = require('./core')(token, url);
    list_subscriptions = function(msidn, callback, verOverride) {
      var params, version;
      version = verOverride || null;
      params = {
        'msidn': msidn
      };
      return core.callApi('subscribers', 'list_subscriptions', params, callback, version);
    };
    add_subscriber = function(msidn, tokenword_id, shortcode, terms, addtl, callback, passthrough, callback, verOverride) {
      var fields, payload, version, xml_payload;
      version = verOverride || null;
      if (addtl) {
        fields = this._parse_payload_fields(addtl);
      } else {
        fields = {};
      }
      payload = {
        'subscriber': {
          _attrs: {
            'msidn': msidn
          },
          _content: {
            'tokenword': {
              _attrs: {
                'tokenwordId': tokenword_id,
                'shortcode': shortcode
              },
              _content: fields
            }
          }
        }
      };
      payload.terms = !terms ? false : true;
      if (passthrough) {
        payload.passthrough = passthrough;
      }
      xml_payload = jstoxml.toXML({
        'apiRequest': {
          _attrs: {
            'token': token
          },
          'addSubscriber': payload
        }
      }, true);
      return core.callApi('subscribers', 'list_subscriptions', null, xml_payload, callback, version);
    };
    get_subscriber = function(msidn, tokenwordId, callback, verOverride) {
      var params, version;
      version = verOverride || null;
      params = {
        'msidn': msidn
      };
      return core.callApi('subscribers', 'get_subscriber', params, null, callback, version);
    };
    update_subscriber = function(msidn, tokenword_id, shortcode, callback, verOverride) {
      var version;
      version = verOverride || null;
      return core.callApi('subscribers', 'unsubscribe_subscriber', params, null, callback, version);
    };
    unsubscribe_subscriber = function(msidn, tokenword_id, shortcode, callback, verOverride) {
      var version;
      version = verOverride || null;
      return core.callApi('subscribers', 'unsubscribe_subscriber', params, null, callback, version);
    };
    _parse_payload_fields = function(addtl) {
      var attr_name, fields_arr, _i, _len;
      fields_arr = [];
      for (_i = 0, _len = addtl.length; _i < _len; _i++) {
        attr_name = addtl[_i];
        fields_arr.push({
          'field': {
            _attrs: {
              'name': attr_name
            },
            'fieldValues': {
              'fieldValue': {
                _attrs: {
                  'value': addtl[attr_name]
                }
              }
            }
          }
        });
      }
      if (fields_arr.length > 0) {
        return {
          'fields': fields_arr
        };
      }
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
