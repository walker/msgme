######
# Core API functionality for all modules
######

######
# Module dependencies
######

http = require('http')
urlParser = require('url')
path = require('path')
qs = require('querystring')
i = require('util').inspect

module.exports = (token, url, ver) ->
	######
	# Versioning of each module in the MsgMe API
	# Override by passing a versions object.
	######
	
	default_api_url = 'http://api.msgme.com/'
	
	defaultVers = 
		authenticate: 1
		subscribers: 1
		subscriptions: 1
		campaigns: 1
		keywords: 1
		ivr: 1
		messaging: 1
	
	vers = defaultVers # vers ? union(defaultVers, vers) : defaultVers
	
	# Overwrite defaults if versions object was passed
	api_url = if url then url else default_api_url
	
	######
	# Standard post
	#
	# @param {String} url API URL for the endpoint you are calling + params
	######
	post = (url, data, callback) ->
		parsedUrl = urlParser.parse(url, true)
		result = ''
		
		if (parsedUrl.query == undefined)
			parsedUrl.query = {}
		
		pathstr = parsedUrl.pathname
		
		if(parsedUrl.query != undefined)
			pathstr = pathstr + "?" + qs.stringify(parsedUrl.query)
		
		request = http.request(
			{
				"host" : parsedUrl.hostname,
				"port" : parsedUrl.port,
				"path" : pathstr,
				"method" : "POST",
				"headers" :
					"Content-Length": data.length
			},
			(res) ->
				res.setEncoding('utf8')
				res.on("data",
					(chunk) ->
						result += chunk
				)
				res.on("end",
					() ->
						result = result
						# console.log(result)
						callback(null, result, res.statusCode)
				)
		)
		
		request.on("error", (err) ->
			callback(err)
		)
		request.write(data)
		request.end()
		
	######
	# Standard get
	#
	# @param {String} url API URL for the endpoint you are calling + params
	######
	get = (url, callback) ->
		parsedUrl = urlParser.parse(url, true)
		result = ""
		
		if (parsedUrl.query == undefined)
			parsedUrl.query = {}
		
		pathstr = parsedUrl.pathname + "?" + qs.stringify(parsedUrl.query)
		
		request = http.request({
				"host" : parsedUrl.hostname,
				"port" : parsedUrl.port,
				"path" : pathstr,
				"method" : "GET",
				"headers" : {
					"Content-Length": 0
				}
			},
			(res) ->
				res.on("data", (chunk) ->
					result += chunk
				)
				res.on("end", () ->
					result = result
					# console.log(result)
					callback(null, result, res.statusCode)
				)
		)
		
		request.on("error", (err) ->
			callback(err)
		)
		
		request.end()
	
	######
	# Union utility
	# Thanks TJ!
	######
	# union = (a, b) ->
	# 	if (a && b)
	# 		tokens = Object.tokens(b)
	# 		len = tokens.length
	# 		token
	# 		
	# 		for token in tokens
	# 			if (!a.hasOwnProperty(token))
	# 				a[token] = b[token]
	# 	return a

	######
	# Process Array Utility 
	######
	process_array = (items, process) ->
		todo = items.concat()
		
		setTimeout(() ->
			process(todo.shift)
			if(todo.length > 0)
				setTimeout(arguments.callee, 25)
		, 25)
	
	######
	# Expose public
	######
	return {
		vers: vers,
		post: post,
		process_array: process_array,
		get: get,
		######
		# Call API
		#
		# @param {String} module The Bandcamp API module
		# @param {String} method Module method
		# @param {Object} parameters Parameters to pass to the method
		# @param {Function} callback Callback to handle Bandcamp response
		# @param {Integer} [ver] Version of the module you want to call. This is an override of defaults (latest).
		# @return {Object} Bandcamp response
		######
		callApi: (module, method, params, payload, callback, ver) ->
			if(typeof callback isnt 'function')
				callback = (err, data, status) ->
					console.log('No callback was set for '+module+'.'+'method')
			if (!module || !method)
				new Error('msgme.callAPI: Module and Method are required.')
				return
				
			if(_is('get', module, method))
				if !params
					params =  {}
				params.token = token
			else
				params = null
			
			version = if ver then ver else vers[module]
			
			baseUrl = api_url
			parsedParams = qs.stringify(params).replace(/\%2c/ig, ',')
			v = 'v'+version.toString()
			fullUrl = baseUrl + path.join(v, module, method)
			
			if(_is('get', module, method) && typeof token == 'string')
				console.log('GET: '+fullUrl + '?' + parsedParams)
				get(fullUrl + '?' + parsedParams + '&token=' + token, callback)
			else
				console.log('POST: '+fullUrl)
				# console.log(payload)
				post(fullUrl, payload, callback)
	}

_is = (type, module, method) ->
	if(type=='get')
		switch module
			when 'authenticate'
				switch method
					when 'get_account_ids'
						return true
					else
						return false
			when 'subscribers'
				switch method
					when 'list_subscriptions', 'get_subscriber'
						return true
					else
						return false
			when 'subscriptions'
				switch method
					when 'get_custom_fields', 'get_subscribers_list', 'get_subscribers_count'
						return true
					else
						return false
			when 'keywords'
				switch method
					when 'get_new_keywords', 'keyword_available', 'get_keywords'
						return true
					else
						return false
			when 'ivr'
				switch method
					when 'get_inbound_vmails', 'get_outbound_vmails', 'delete_inbound_vmails'
						return true
					else
						return false
			when 'messaging'
				switch method
					when 'get_delivery_receipts', 'get_message_activity', 'get_message_status', 'get_mo_message', 'get_mt_message'
						return true
					else
						return false
			else
				return false
	else if(type=='post')
		return false