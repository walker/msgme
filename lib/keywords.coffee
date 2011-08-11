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
	get = (account_id, shortcode, callback, verOverride) ->
		version = verOverride || null
		params = {
			'accountId': account_id
			'shortcode': shortcode
		}
		
		core.callApi(
			'keywords',
			'get_keywords',
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
	
	return {
		version: ver || core.vers['keywords'],
		get_keywords: get
	}
