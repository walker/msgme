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
					if(method == 'get_accounts_ids')
						return true;
					else
						return false;
					break;
				case 'subscribers':
					if(method == 'list_subscriptions' || method == 'get_subscriber')
						return true;
					else
						return false;
					break;
				case 'subscriptions':
					if(method == 'get_custom_fields' || method == 'get_subscribers_list' || method == 'get_subscribers_count')
						return true;
					else
						return false;
					break;
				case 'keywords':
					if(method == 'get_new_keywords' || method == 'keyword_available' || method == 'get_keywords')
						return true;
					else
						return false;
					break;
				case 'ivr':
					if(method == 'get_inbound_vmails' || method == 'get_outbound_vmails' || method == 'delete_inbound_vmails')
						return true;
					else
						return false;
					break;
				case 'messaging':
					if(method == 'get_delivery_receipts' || method == 'get_message_activity' || method == 'get_message_status' || method == 'get_mo_message' || method == 'get_mt_message')
						return true;
					else
						return false;
					break;
			}
		} else if(type=='post') {
			
		}
	}
}