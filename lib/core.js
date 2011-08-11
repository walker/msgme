(function() {
  var http, i, jstoxml, path, qs, urlParser, _is;
  http = require('http');
  urlParser = require('url');
  path = require('path');
  qs = require('querystring');
  jstoxml = require('jstoxml');
  i = require('util').inspect;
  module.exports = function(token, url, ver) {
    var api_url, defaultVers, default_api_url, get, post, process_array, vers;
    default_api_url = 'http://api.msgme.com/';
    defaultVers = {
      authenticate: 1,
      subscribers: 1,
      subscriptions: 1,
      campaigns: 1,
      keywords: 1,
      ivr: 1,
      messaging: 1
    };
    vers = defaultVers;
    api_url = url ? url : default_api_url;
    post = function(url, data, callback) {
      var parsedUrl, pathstr, request, result;
      parsedUrl = urlParser.parse(url, true);
      result = '';
      if (parsedUrl.query === void 0) {
        parsedUrl.query = {};
      }
      pathstr = parsedUrl.pathname;
      if (parsedUrl.query !== void 0) {
        pathstr = pathstr + "?" + qs.stringify(parsedUrl.query);
      }
      request = http.request({
        "host": parsedUrl.hostname,
        "port": parsedUrl.port,
        "path": pathstr,
        "method": "POST",
        "headers": {
          "Content-Length": data.length
        }
      }, function(res) {
        res.setEncoding('utf8');
        res.on("data", function(chunk) {
          return result += chunk;
        });
        return res.on("end", function() {
          result = result;
          return callback(null, result, res.statusCode);
        });
      });
      request.on("error", function(err) {
        return callback(err);
      });
      request.write(data);
      return request.end();
    };
    get = function(url, callback) {
      var parsedUrl, pathstr, request, result;
      parsedUrl = urlParser.parse(url, true);
      result = "";
      if (parsedUrl.query === void 0) {
        parsedUrl.query = {};
      }
      pathstr = parsedUrl.pathname + "?" + qs.stringify(parsedUrl.query);
      request = http.request({
        "host": parsedUrl.hostname,
        "port": parsedUrl.port,
        "path": pathstr,
        "method": "GET",
        "headers": {
          "Content-Length": 0
        }
      }, function(res) {
        res.on("data", function(chunk) {
          return result += chunk;
        });
        return res.on("end", function() {
          result = result;
          return callback(null, result, res.statusCode);
        });
      });
      request.on("error", function(err) {
        return callback(err);
      });
      return request.end();
    };
    process_array = function(items, process) {
      var todo;
      todo = items.concat();
      return setTimeout(function() {
        process(todo.shift);
        if (todo.length > 0) {
          return setTimeout(arguments.callee, 25);
        }
      }, 25);
    };
    return {
      vers: vers,
      post: post,
      process_array: process_array,
      get: get,
      callApi: function(module, method, params, payload, callback, ver) {
        var baseUrl, fullUrl, parsedParams, v, version;
        if (typeof callback !== 'function') {
          callback = function(err, data, status) {
            return console.log('No callback was set for ' + module + '.' + 'method');
          };
        }
        if (!module || !method) {
          new Error('msgme.callAPI: Module and Method are required.');
          return;
        }
        if (_is('get', module, method)) {
          if (!params) {
            params = {};
          }
          params.token = token;
        } else {
          params = null;
        }
        version = ver ? ver : vers[module];
        baseUrl = api_url;
        parsedParams = qs.stringify(params).replace(/\%2c/ig, ',');
        v = 'v' + version.toString();
        fullUrl = baseUrl + path.join(v, module, method);
        if (_is('get', module, method) && typeof token === 'string') {
          console.log('GET: ' + fullUrl + '?' + parsedParams);
          return get(fullUrl + '?' + parsedParams + '&token=' + token, callback);
        } else {
          console.log('POST: ' + fullUrl);
          return post(fullUrl, payload, callback);
        }
      }
    };
  };
  _is = function(type, module, method) {
    if (type === 'get') {
      switch (module) {
        case 'authenticate':
          switch (method) {
            case 'get_account_ids':
              return true;
            default:
              return false;
          }
          break;
        case 'subscribers':
          switch (method) {
            case 'list_subscriptions':
            case 'get_subscriber':
              return true;
            default:
              return false;
          }
          break;
        case 'subscriptions':
          switch (method) {
            case 'get_custom_fields':
            case 'get_subscribers_list':
            case 'get_subscribers_count':
              return true;
            default:
              return false;
          }
          break;
        case 'keywords':
          switch (method) {
            case 'get_new_keywords':
            case 'keyword_available':
            case 'get_keywords':
              return true;
            default:
              return false;
          }
          break;
        case 'ivr':
          switch (method) {
            case 'get_inbound_vmails':
            case 'get_outbound_vmails':
            case 'delete_inbound_vmails':
              return true;
            default:
              return false;
          }
          break;
        case 'messaging':
          switch (method) {
            case 'get_delivery_receipts':
            case 'get_message_activity':
            case 'get_message_status':
            case 'get_mo_message':
            case 'get_mt_message':
              return true;
            default:
              return false;
          }
          break;
        default:
          return false;
      }
    } else if (type === 'post') {
      return false;
    }
  };
}).call(this);
