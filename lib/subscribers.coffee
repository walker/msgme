######
# msgme Subscribers module
######

exports = module.exports = (token, url, ver) ->

	######
	# Module dependencies
	######
	core = require('./core')(token, url, ver)
	jstoxml = require('jstoxml')
	libxmljs = require('libxmljs')
	
	######
	# Retrieve a mobile number's subscriptions
	#
	# @param {String} msidn 10-digit mobile number
	# @return {Array} An array with objects for each subscription. Array will be empty if no subscriptions found for msidn
	######
	list_subscriptions = (msidn, callback, verOverride) ->
		version = verOverride || null
		params = {
			'msidn': msidn
		}
		
		core.callApi(
			'subscribers',
			'list_subscriptions',
			params,
			null,
			(err, data, status) ->
				xmlDoc = libxmljs.parseXmlString(data)
				
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200')
					returned = {'msidn': msidn, 'subscriptions': []}
					
					subscription_list = xmlDoc.find('//subscription')
					# TODO: Make this non-blocking?
					if typeof subscription_list == 'object'
						i = 0;
						subscription_list.forEach((subscription)->
							returned.subscriptions[i] =
								'keyword_id': subscription.attr('keywordId').value()
								'keyword_name': subscription.attr('keywordName').value()
								'date_subscribed': subscription.attr('dateSubscribed').value()
								'shortcode': subscription.attr('shortcode').value()
							i++
						)
					callback(null, returned, 200)
				else
					callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
			,
			version
		)
	
	######
	# Add a subscriber to a keyword
	#
	# @param {String} msidn 10-digit mobile number
	# @param {String} keyword ID
	# @param {String} shortcode the keyword ID must belong to this shortcode
	# @param {Boolean} terms True or False that subscriber agreed to the terms
	# @param {Array} addtl An array of objects containing {field: [fieldname], value: [field value]} for the addtional field values that can be saved with a subscriber
	# @param {Function} callback Your callback for dealing with the returned data
	# @param {String} passthrough Optional passthrough information
	# @param {String} verOverride Optional API version override
	# @return {String} An object with status, status_code, and subscriber_id
	######
	add = (msidn, keyword_id, shortcode, terms, addtl, callback, passthrough, verOverride) ->
		version = verOverride || null
		if(addtl && typeof addtl == 'object')
			fields = addtl
		else
			fields = []
		
		if(terms==true)
			terms = 'true'
		else
			terms = 'false'
		
		libxmljs.setTagCompression = 1
		doc = new libxmljs.Document((n) ->
			n.node('apiRequest', {token: token}, (n) ->
				n.node('addSubscriber', (n) ->
					n.node('subscriber', {msidn: msidn}, (n) ->
						n.node('keyword', {'keywordId': keyword_id, 'shortcode': shortcode}, (n) ->
							if(fields.length>0)
								n.node('fields', (n) ->
									fields.forEach((field) ->
										n.node('field', {'name': field.name}, (n) ->
											n.node('fieldValues', (n) ->
												n.node('fieldValue', {'value': field.value}, '')
											)
										)
									)
								)
						)
					)
					n.node('terms', terms)
				)
			)
		)
		xml_payload = doc.toString()
		core.callApi(
			'subscribers',
			'add_subscriber',
			null,
			xml_payload,
			(err, data, status) ->
				xmlDoc = libxmljs.parseXmlString(data)
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200' || xmlDoc.root().attr('statusCode').value()=='201')
					returned = {'msidn': msidn, 'subscriber': []}
					
					subscriber_list = xmlDoc.find('//subscriber')
					# TODO: Make this non-blocking?
					if typeof subscriber_list == 'object'
						i = 0;
						subscriber_list.forEach((subscriber)->
							returned.subscriber[i] =
								'msidn': subscriber.attr('msidn').value()
								'subscriber_id': subscriber.attr('subscriberId').value()
							i++
						)
					callback(null, returned, 200)
				else
					callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
			, version
		)
	
	######
	# Retrieve a subscriber's information
	#
	# @param {String} msidn 10-digit mobile number
	# @param {String} keyword_id The keyword ID of the subscribeable keyword "If a keyword ID is included then metadata associated with the subscriber for that keyword will be returned." - from msgme API docs.
	# @param {Function} callback The callback function for handling returned data or err
	# @param {String} verOverride Override the API version being called
	# @return {Object} An object with an array called {Array} 
	######
	get = (msidn, keyword_id, callback, verOverride) ->
		version = verOverride || null
		params = {
			'msidn': msidn
			'keywordId': keyword_id
		}
		
		core.callApi(
			'subscribers',
			'get_subscriber',
			params,
			null,
			(err, data, status) ->
				xmlDoc = libxmljs.parseXmlString(data)
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200')
					subscriber = xmlDoc.get('//subscriber')
					returned = {'msidn': msidn, 'subscriber_id': subscriber.attr('subscriberId').value(), 'created': subscriber.attr('created').value(), 'fields': {}}
					
					field_list = xmlDoc.find('//field')
					values_list = xmlDoc.find('//values')
					value_list = xmlDoc.find('//value')
					# TODO: This is an ungodly mess. Why was this not easier?!
					if typeof field_list == 'object'
						i = 0
						j = 0
						field_list.forEach((field) ->
							if(values_list[j].child() != null)
								if(typeof value_list[i] == 'object')
									returned.fields[field.attr('name').value()] = value_list[i].text()
								i++
							else
								returned.fields[field.attr('name').value()] = ''
							j++
						)
					callback(null, returned, 200)
				else
					callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
			,
			version
		)
	
	
	######
	# Retrieve a subscriber's information
	#
	# @param {String} msidn 10-digit mobile number
	# @param {String} the keyword ID of the subscribeable keyword "If a keyword ID is included then metadata associated with the subscriber for that keyword will be returned." - from msgme API docs.
	# @param {String} the shortcode the keyword ID is associated with
	# @return {Object} An object with an array called {Array} 
	######
	update = (msidn, subscriber_id, keyword_id, shortcode, addtl, callback, passthrough, verOverride) ->
		version = verOverride || null
		if(addtl && typeof addtl == 'object')
			fields = addtl
		else
			fields = []
		
		doc = new libxmljs.Document((n) ->
			n.node('apiRequest', {token: token}, (n) ->
				n.node('updateSubscriber', (n) ->
					n.node('subscriber', {msidn: msidn, subscriberId: subscriber_id}, (n) ->
						n.node('keyword', {'keywordId': keyword_id, 'shortcode': shortcode}, (n) ->
							if(fields.length>0)
								n.node('fields', (n) ->
									fields.forEach((field) ->
										if(field.update_method != 'overwrite' && field.update_method != 'append' && field.update_method != 'remove')
											field.update_method = 'overwrite'
										n.node('field', {'name': field.name, 'updateMethod': field.update_method}, (n) ->
											n.node('fieldValues', (n) ->
												n.node('fieldValue', {'value': field.value}, '')
											)
										)
									)
								)
						)
					)
				)
			)
		)
		xml_payload = doc.toString()
		core.callApi(
			'subscribers',
			'update_subscriber',
			null,
			xml_payload,
			(err, data, status) ->
				xmlDoc = libxmljs.parseXmlString(data)
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200')
					subscriber = xmlDoc.get('//subscriber')
					if(typeof subscriber == 'object')
						returned = {'msidn': msidn, 'subscriber_id': subscriber.attr('subscriberId').value(), 'modified': subscriber.attr('modified').value()}
						callback(null, returned, 200)
					else
						callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
				else
					callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
			, version
		)
	
	######
	# Retrieve a subscriber's information
	#
	# @param {String} msidn 10-digit mobile number
	# @param {String} the keyword ID of the subscribeable keyword "If a keyword ID is included then metadata associated with the subscriber for that keyword will be returned." - from msgme API docs.
	# @param {String} the shortcode the keyword ID is associated with
	# @return {Object} An object with an array called {Array} 
	######
	unsubscribe = (msidn, keyword_id, shortcode, callback, verOverride) ->
		version = verOverride || null
		
		doc = new libxmljs.Document((n) ->
			n.node('apiRequest', {token: token}, (n) ->
				n.node('unsubscribeSubscriber', {stopService: "false"}, (n) ->
					n.node('subscriber', {msidn: msidn})
					n.node('keywords', (n) ->
						n.node('keyword', {'keywordId': keyword_id, 'shortcode': shortcode}, '')
					)
				)
			)
		)
		xml_payload = doc.toString()
		core.callApi(
			'subscribers',
			'unsubscribe_subscriber',
			null,
			xml_payload,
			(err, data, status) ->
				console.log(data)
				xmlDoc = libxmljs.parseXmlString(data)
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200')
					subscriber = xmlDoc.get('//subscriber')
					if(typeof subscriber == 'object')
						returned = {'msidn': msidn, 'subscriber_id': subscriber.attr('subscriberId').value(), 'unsubscribe_date': subscriber.attr('unsubscribeDate').value(), 'keywords': []}
						keyword_list = xmlDoc.find('//keyword')
						# TODO: Non-blocking?
						if typeof keyword_list == 'object' && typeof keyword_list.size != 'undefined'
							i = 0
							keyword_list.forEach((keyword) ->
								returned.keywords[i] = 
									keyword_id: keyword.attr('keywordId').value()
									shortcode: keyword.attr('shortcode').value()
								i++
							)
							callback(null, returned, 200)
						else
							callback({'code':'410', 'msg':'Gone', 'reason':'User was not subscribed to keyword or has previously unsubscribed.'})
					else
						callback({'code':'500', 'msg':'Unknown Server Error'})
				else
					callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
			, version
		)
	
	return {
		version: ver || core.vers['subscribers'],
		list_subscriptions: list_subscriptions,
		add_subscriber: add,
		get_subscriber: get,
		update_subscriber: update,
		unsubscribe_subscriber: unsubscribe
	}