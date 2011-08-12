######
# msgme Keywords module
######

exports = module.exports = (token, url, ver) ->
	######
	# Module dependencies
	######
	core = require('./core')(token, url, ver)
	libxmljs = require('libxmljs')
	
	######
	# Retrieve a mobile number's subscriptions
	#
	# @param {String} msidn 10-digit mobile number
	# @return {Array} An array with objects for each subscription. Array will be empty if no subscriptions found for msidn
	######
	get = (account_id, shortcode, callback, past_24_hours, date_created, verOverride) ->
		version = verOverride || null
		params =
			'accountId': account_id
			'shortcode': shortcode
		
		if past_24_hours == true
			method = 'get_new_keywords'
		else if date_created
			method = 'get_new_keywords'
			params.dateCreated = date_created
		else
			method = 'get_keywords'
		
		core.callApi(
			'keywords',
			method,
			params,
			null,
			(err, data, status) ->
				xmlDoc = libxmljs.parseXmlString(data)
				
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200')
					returned = {'shortcode': shortcode, 'keywords': []}
					
					keyword_list = xmlDoc.find('//keyword')
					# TODO: Make this non-blocking?
					if typeof keyword_list == 'object'
						i = 0;
						keyword_list.forEach((keyword)->
							returned.keywords[i] =
								'keyword_id': keyword.attr('keywordId').value()
								'keyword_name': keyword.attr('keywordName').value()
								'subscription': keyword.attr('subscription').value()
								'created_date': keyword.attr('createdDate').value()
								'account_id': keyword.attr('accountId').value()
							i++
						)
					callback(null, returned, 200)
				else
					callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
			,
			version
		)
	
	available = (keyword_name, account_id, shortcode, callback, verOverride) ->
		version = verOverride || null
		
		params =
			'keyword_name': account_id
			'accountId': account_id
			'shortcode': shortcode
		
		core.callApi(
			'keywords',
			'keyword_available',
			params,
			null,
			(err, data, status) ->
				xmlDoc = libxmljs.parseXmlString(data)
				
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200')
					keyword = xmlDoc.find('//keyword')
					# TODO: Make this non-blocking?
					if typeof keyword == 'object'
						if keyword.attr('available').value()
							callback(null, keyword.attr('available').value(), 200)
						else
							callback(null, false, 200)
					else
						callback(null, false, 200)
				else
					callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
			,
			version
		)
	
	
	return {
		version: ver || core.vers['keywords'],
		get_keywords: get,
		keyword_available: available,
		get_new_keywords: () -> 
			console.log('Use get_keywords and add TRUE as 4th argument for last 24 hours, or false for the 4th argument and YYYYMMDD as the 5th argument.')
	}
