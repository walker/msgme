(function() {
  var exports;
  exports = module.exports = function(token, url, ver) {
    var core, custom_field, get_custom_fields, get_subscribers_count, get_subscribers_list, libxmljs, run_filter;
    core = require('./core')(token, url, ver);
    libxmljs = require('libxmljs');
    custom_field = function(keyword_id, custom_field_configurations, callback, verOverride) {
      var doc, version, xml_payload;
      if (typeof custom_field_configurations === 'object' && Object.prototype.toString.call(custom_field_configurations) === '[object Array]') {
        version = verOverride || null;
        libxmljs.setTagCompression = 1;
        doc = new libxmljs.Document(function(n) {
          return n.node('apiRequest', {
            token: token
          }, function(n) {
            return n.node('DefineCustomField', {
              keywordId: keyword_id
            }, function(n) {
              if (custom_field_configurations.length > 0) {
                return custom_field_configurations.forEach(function(field) {
                  var field_atts, method;
                  field_atts = {
                    'name': field.name
                  };
                  switch (field.type) {
                    case 'int':
                    case 'INT':
                    case 'integer':
                    case 'INTEGER':
                      field_atts.type = 'int';
                      break;
                    case 'BOOL':
                    case 'bool':
                    case 'boolean':
                      field_atts.type = 'bool';
                      break;
                    default:
                      field_atts.type = 'text';
                  }
                  if (!field.valid_length || field.valid_length === null || field.valid_length.toString() === 'undefined') {} else {
                    field_atts.validLength = field.valid_length;
                  }
                  if (!field.id || field.id === null || field.id.toString() === 'undefined') {
                    method = 'define_custom_field';
                  } else {
                    method = 'update_custom_field';
                    field_atts.fieldId = field.id;
                  }
                  return n.node('customField', field_atts, function(n) {
                    var field_values;
                    n.node('description', field.description);
                    field_values = field.field_values;
                    if (typeof field_values === 'object' && Object.prototype.toString.call(field_values) === '[object Array]') {
                      return field_values.forEach(function(field_value) {
                        return n.node('validInputs', field_value);
                      });
                    }
                  });
                });
              }
            });
          });
        });
        xml_payload = doc.toString();
        return core.callApi('subscribers', method, null, xml_payload, function(err, data, status) {
          var custom_fields_list, i, returned, xmlDoc;
          xmlDoc = libxmljs.parseXmlString(data);
          if (xmlDoc.root().attr('statusCode').value() === '200') {
            returned = {
              'keyword_id': keyword_id,
              'custom_fields': []
            };
            custom_fields_list = xmlDoc.find('//customField');
            if (typeof custom_fields_list === 'object') {
              i = 0;
              custom_fields_list.forEach(function(custom_field) {
                returned.custom_fields[i] = {
                  'name': custom_field.attr('name').value(),
                  'id': custom_field.attr('fieldId').value(),
                  'keyword_id': custom_field.attr('keywordId').value()
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
      } else {
        return callback({
          'code': '400',
          'msg': 'Bad Request',
          'reason': 'You must provide custom fields configurations.'
        });
      }
    };
    get_custom_fields = function(keyword_id, callback, verOverride) {
      var params, version;
      version = verOverride || null;
      params = {
        'keywordId': keyword_id
      };
      return core.callApi('subscriptions', 'get_custom_fields', params, null, function(err, data, status) {
        var custom_fields_list, i, returned, xmlDoc;
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200') {
          returned = {
            'keyword_id': keyword_id,
            'custom_fields': []
          };
          custom_fields_list = xmlDoc.find('//customField');
          if (typeof custom_fields_list === 'object') {
            i = 0;
            custom_fields_list.forEach(function(custom_field) {
              var j, valid_list;
              returned.custom_fields[i] = {
                'name': custom_field.attr('name').value(),
                'id': custom_field.attr('fieldId').value(),
                'description': custom_field.get('description').text(),
                'type': custom_field.attr('type').value(),
                'length': custom_field.attr('length').value(),
                'created': custom_field.attr('created').value(),
                'updated': custom_field.attr('updated').value(),
                'default_value': custom_field.attr('defaultValue').value(),
                'keyword_id': custom_field.attr('keywordId').value(),
                'valid_inputs': []
              };
              valid_list = custom_field.find('validInputs');
              if (typeof valid_list === 'object') {
                j = 0;
                valid_list.forEach(function(valid_input) {
                  returned.custom_fields[i].valid_inputs[j] = valid_input.text();
                  return j++;
                });
              }
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
    get_subscribers_list = function(keyword_id, start_at, number_of_subscribers, date_created, fields, return_fields, callback, verOverride) {
      var field_array, i, numberOfSubscribers, params, startAt, value_ranges, version;
      version = verOverride || null;
      numberOfSubscribers = number_of_subscribers || 100;
      startAt = start_at || 0;
      params = {
        'keywordId': keyword_id,
        'dateCreated': date_created,
        'numberOfSubscribers': numberOfSubscribers
      };
      if (typeof fields === 'object' && Object.prototype.toString.call(fields) === '[object Array]') {
        field_array = [];
        value_ranges = [];
        i = 0;
        fields.forEach(function(field) {
          if (field.name) {
            field_array[i] = field.name;
            if (field.range) {
              value_ranges[i] = field.range;
            } else {
              value_ranges[i] = '';
            }
            return i++;
          }
        });
        params.fields = field_array.join('+');
        params.valueRange = value_ranges.join('+');
      }
      if (typeof return_fields === 'object' && Object.prototype.toString.call(return_fields) === '[object Array]') {
        params.returnFields = return_fields.join('+');
      }
      return core.callApi('subscriptions', 'get_subscribers_list', params, null, function(err, data, status) {
        var attrs, returned, subscriber_list, subscribers, xmlDoc;
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200') {
          subscribers = xmlDoc.get('//subscribers');
          returned = {
            'keyword_id': keyword_id,
            'subscribers': []
          };
          if (subscribers.attr('page') !== null) {
            returned.page = subscribers.attr('page').value();
          }
          if (subscribers.attr('numberOfPages') !== null) {
            returned.number_of_pages = subscribers.attr('numberOfPages').value();
          }
          if (subscribers.attr('numberOfRecords') !== null) {
            returned.number_of_records = subscribers.attr('numberOfRecords').value();
          }
          if (returned.number_of_records && returned.number_of_records > 0) {
            subscriber_list = xmlDoc.get('//subscriber');
            if (typeof subscriber_list === 'object' && Object.prototype.toString.call(subscriber_list) === '[object Array]') {
              i = 0;
              subscriber_list.forEach(function(subscriber) {
                var attrs;
                attrs = subscriber.attrs();
                if (typeof attrs === 'object' && Object.prototype.toString.call(attrs) === '[object Array]') {
                  returned.subscribers[0] = {};
                  return attrs.forEach(function(attr) {
                    return returned.subscribers[0][attr.name()] = attr.value();
                  });
                }
              });
              return callback(null, returned, 200);
            } else if (typeof subscriber_list === 'object') {
              attrs = subscriber_list.attrs();
              if (typeof attrs === 'object' && Object.prototype.toString.call(attrs) === '[object Array]') {
                returned.subscribers[0] = {};
                attrs.forEach(function(attr) {
                  return returned.subscribers[0][attr.name()] = attr.value();
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
          } else {
            return callback(null, returned, 200);
          }
        }
      }, version);
    };
    get_subscribers_count = function(account_id, keyword_id, field, callback, verOverride) {
      var params, version;
      version = verOverride || null;
      params = {
        'keywordId': keyword_id,
        'accountId': account_id
      };
      return core.callApi('subscriptions', 'get_subscribers_count', params, null, function(err, data, status) {
        var count, xmlDoc;
        xmlDoc = libxmljs.parseXmlString(data);
        if (xmlDoc.root().attr('statusCode').value() === '200') {
          count = xmlDoc.get('//subscribersCount');
          if (count.text()) {
            return callback(null, count.text(), 200);
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
    run_filter = function(account_id, keyword_id, fields, callback, verOverride) {
      var doc, version, xml_payload;
      version = verOverride || null;
      libxmljs.setTagCompression = 1;
      doc = new libxmljs.Document(function(n) {
        return n.node('apiRequest', {
          token: token
        }, function(n) {
          return n.node('runfilter', {
            'accountId': account_id,
            'keywordId': keyword_id
          }, function(n) {
            if (fields.length > 0) {
              return n.node('fields', function(n) {
                return fields.forEach(function(field) {
                  return n.node('field', {
                    'id': field.id,
                    'value': field.value
                  }, '');
                });
              });
            }
          });
        });
      });
      xml_payload = doc.toString();
      return core.callApi('subscriptions', 'run_filter', null, xml_payload, function(err, data, status) {
        var count, xmlDoc;
        if (data !== '') {
          xmlDoc = libxmljs.parseXmlString(data);
          if (xmlDoc.root().attr('statusCode').value() === '200') {
            count = xmlDoc.get('//subscribersCount');
            if (count.text()) {
              return callback(null, count.text(), 200);
            }
          } else {
            return callback({
              'code': xmlDoc.root().attr('statusCode').value(),
              'msg': xmlDoc.root().attr('status').value(),
              'reason': xmlDoc.get('//reason').text()
            });
          }
        } else {
          return callback({
            'code': '500',
            'msg': 'Server Error',
            'reason': 'Sorry, but we received a blank response from MsgMe.'
          });
        }
      }, version);
    };
    return {
      version: ver || core.vers['subscriptions'],
      custom_field: custom_field,
      define_custom_field: custom_field,
      update_custom_field: custom_field,
      get_custom_fields: get_custom_fields,
      get_subscribers_list: get_subscribers_list,
      get_subscribers_count: get_subscribers_count,
      run_filter: run_filter
    };
  };
}).call(this);
