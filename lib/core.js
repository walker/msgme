/**
 * Core API functionality for all modules
 */

/**
 * Module dependencies
 */

var http = require('http'),
	urlParser = require('url'),
	path = require('path'),
	qs = require('querystring'),
	jstoxml = require('jstoxml'),
	i = require('util').inspect;

module.exports = function(key, url, vers) {

	/**
	* Versioning of each module in the MsgMe API
	* Override by passing a versions object.
	*/
	
	var default_api_url = 'http://api.msgme.com';
	
	var defaultVers = {
		authenticate: 1,
		subscribers: 1,
		subscriptions: 1,
		campaigns: 1,
		keywords: 1,
		ivr: 1,
		messaging: 1
	}
	
	var vers = vers ? union(defaultVers, vers) : defaultVers;
	
	// Overwrite defaults if versions object was passed
	var api_url = url ? url : default_api_url;
	
	/**
	* Expose public
	*/
	return {
		get: get,
		callApi: callApi,
		vers: vers,
		union: union
	}
	
	/**
	* Union utility
	* Thanks TJ!
	*/
	function union(a, b){
		if (a && b) {
			var keys = Object.keys(b),
				len = keys.length,
				key;
			
			for (var i = 0; i < len; ++i) {
				key = keys[i];
				if (!a.hasOwnProperty(key)) {
					a[key] = b[key];
				}
			}
		}
		return a;
	}

	/**
	* Standard get
	*
	* @param {String} url API URL for the endpoint you are calling + params
	*/
	function get(url) {
		callback = callback || function() {};
		
		var parsedUrl = urlParser.parse(url, true),
		request,
		result = "";
		
		if (parsedUrl.query === undefined) {
			parsedUrl.query = {};
		}
		
		var path = parsedUrl.pathname + "?" + qs.stringify(parsedUrl.query);
		
		request = http.request({
				"host" : parsedUrl.hostname,
				"port" : parsedUrl.port,
				"path" : path,
				"method" : "GET",
				"headers" : {
					"Content-Length": 0
				}
			},
			function(res) {
				res.on("data", function(chunk) {
					result += chunk;
				});
				
			res.on("end", function() {
				result = JSON.parse(result);
				callback(null, result, res.statusCode);
			});
		});
		
		request.on("error", function(err) {
			callback(err);
		});
		
		request.end();
	}

	/**
	* Call API
	*
	* @param {String} module The Bandcamp API module
	* @param {String} method Module method
	* @param {Object} parameters Parameters to pass to the method
	* @param {Function} callback Callback to handle Bandcamp response
	* @param {Integer} [ver] Version of the module you want to call. This is an override of defaults (latest).
	* @return {Object} Bandcamp response
	*/
	
	function callApi(module, method, params, payload, ver) {
		if (!module || !method) {
			new Error('msgme.callAPI: Module and Method are required.');
			return;
		}
		
		if(_is('get', module, method)) {
			params.token = auth_token;
		} else {
			params = null;
		}
		
		var version = ver ? ver : vers[module],
			baseUrl = api_url,
			parsedParams = qs.stringify(params).replace(/\%2c/ig, ','),
			v = 'v'+version.toString();
			fullUrl = baseUrl + path.join(version, module, method)
				+ '?' + parsedParams + '&key=' + key;
		
		if(_is('get', module, method))
			get(fullUrl);
		else
			post(fullUrl, payload)
	}
	
	function _is(type, module, method) {
		if(type=='get') {
			switch(module) {
				case 'authenticate':
					switch(method) {
						case 'get_accounts_ids':
							return true;
						break;
						default:
							return false;
					}
					break;
				case 'subscribers'
					switch(method) {
						case 'list_subscriptions':
						case 'get_subscriber':
							return true;
						break;
						default:
							return false;
					}
					break;
				case 'subscriptions':
					switch(module) {
						case 'get_custom_fields':
						case 'get_subscribers_list':
						case 'get_subscribers_count':
							return true;
						break;
						default:
							return false;
					}
					break;
				case 'keywords':
					switch(module) {
						case 'get_new_keywords':
						case 'keyword_available':
						case 'get_keywords':
							return true;
						break;
						default:
							return false;
					}
					break;
				case 'ivr':
					switch(module) {
						case 'get_inbound_vmails':
						case 'get_outbound_vmails':
						case 'delete_inbound_vmails':
							return true;
						break;
						default:
							return false;
					}
					break;
				case 'messaging':
					switch(module) {
						case 'get_delivery_receipts':
						case 'get_message_activity':
						case 'get_message_status':
						case 'get_mo_message':
						case 'get_mt_message':
							return true;
						break;
						default:
							return false;
					}
					break;
			}
		} else if(type=='post') {
			
		}
	}
}