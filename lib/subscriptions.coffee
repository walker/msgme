######
# msgme Subscriptions module
######

exports = module.exports = (token, url, ver) ->
	######
	# Module dependencies
	######
	
	core = require('./core')(token, url, ver)
	libxmljs = require('libxmljs')
	
	custom_field = (keyword_id, custom_field_configurations, callback, verOverride) ->
		if(typeof custom_field_configurations == 'object' && Object.prototype.toString.call(custom_field_configurations) == '[object Array]')
			version = verOverride || null
			libxmljs.setTagCompression = 1
			doc = new libxmljs.Document((n) ->
				n.node('apiRequest', {token: token}, (n) ->
					n.node('DefineCustomField', {keywordId: keyword_id}, (n) ->
						if(custom_field_configurations.length>0)
							custom_field_configurations.forEach((field) ->
								field_atts = {'name': field.name}
								switch(field.type)
									when 'int', 'INT', 'integer', 'INTEGER'
										field_atts.type = 'int'
									when 'BOOL', 'bool', 'boolean'
										field_atts.type = 'bool'
									else
										field_atts.type = 'text'
								if(!field.valid_length || field.valid_length==null || field.valid_length.toString() == 'undefined')
									# do nothing
								else
									field_atts.validLength = field.valid_length
								if(!field.id || field.id==null || field.id.toString() == 'undefined')
									method = 'define_custom_field'
								else
									method = 'update_custom_field'
									field_atts.fieldId = field.id
								
								n.node('customField', field_atts, (n) ->
									n.node('description', field.description)
									field_values = field.field_values
									if(typeof field_values == 'object' && Object.prototype.toString.call(field_values) == '[object Array]')
										field_values.forEach((field_value) ->
												n.node('validInputs', field_value)
										)
								)
							)
					)
				)
			)
			xml_payload = doc.toString()
			core.callApi(
				'subscribers',
				method,
				null,
				xml_payload,
				(err, data, status) ->
					xmlDoc = libxmljs.parseXmlString(data)
					# status - not currently set properly
					# xmlDoc.root().attr('status').value()
					# xmlDoc.root().attr('statusCode').value()
					if(xmlDoc.root().attr('statusCode').value()=='200')
						returned = {'keyword_id': keyword_id, 'custom_fields': []}
						
						custom_fields_list = xmlDoc.find('//customField')
						# TODO: Make this non-blocking?
						if typeof custom_fields_list == 'object'
							i = 0;
							custom_fields_list.forEach((custom_field)->
								returned.custom_fields[i] =
									'name': custom_field.attr('name').value()
									'id': custom_field.attr('fieldId').value()
									'keyword_id': custom_field.attr('keywordId').value()
								i++
							)
						callback(null, returned, 200)
					else
						callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
				, version
			)
		else
			callback({'code':'400', 'msg':'Bad Request', 'reason': 'You must provide custom fields configurations.'})
	
	get_custom_fields = (keyword_id, callback, verOverride) ->
		version = verOverride || null
		params =
			'keywordId': keyword_id
		
		core.callApi(
			'subscriptions',
			'get_custom_fields',
			params,
			null,
			(err, data, status) ->
				xmlDoc = libxmljs.parseXmlString(data)
				
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200')
					returned = {'keyword_id': keyword_id, 'custom_fields': []}
					
					# This didn't match the docs (was just 'field')
					custom_fields_list = xmlDoc.find('//customField')
					# TODO: Make this non-blocking?
					if typeof custom_fields_list == 'object'
						i = 0;
						custom_fields_list.forEach((custom_field)->
							returned.custom_fields[i] =
								'name': custom_field.attr('name').value()
								'id': custom_field.attr('fieldId').value()
								# This didn't match the docs (was just an attr of customField or field)
								'description': custom_field.get('description').text()
								'type': custom_field.attr('type').value()
								'length': custom_field.attr('length').value()
								'created': custom_field.attr('created').value()
								'updated': custom_field.attr('updated').value()
								'default_value': custom_field.attr('defaultValue').value()
								'keyword_id': custom_field.attr('keywordId').value()
								'valid_inputs': []
							
							valid_list = custom_field.find('validInputs')
							if typeof valid_list == 'object'
								j = 0
								valid_list.forEach((valid_input) ->
									returned.custom_fields[i].valid_inputs[j] = valid_input.text()
									j++
								)
							i++
						)
					callback(null, returned, 200)
				else
					callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
			, version
		)
	
	get_subscribers_list = (keyword_id, start_at, number_of_subscribers, date_created, fields, return_fields, callback, verOverride) ->
		version = verOverride || null
		numberOfSubscribers = number_of_subscribers || 100
		startAt = start_at || 0
		
		params =
			'keywordId': keyword_id
			'dateCreated': date_created
			'numberOfSubscribers': numberOfSubscribers
		
		if (typeof(fields) == 'object' && Object.prototype.toString.call(fields) == '[object Array]')
			field_array = []
			value_ranges = []
			i = 0
			fields.forEach((field) ->
				if(field.name)
					field_array[i] = field.name
					if(field.range)
						value_ranges[i] = field.range
					else
						value_ranges[i] = ''
					i++
			)
			params.fields = field_array.join('+');
			params.valueRange = value_ranges.join('+');
		
		if (typeof(return_fields) == 'object' && Object.prototype.toString.call(return_fields) == '[object Array]')
			params.returnFields = return_fields.join('+');
		
		core.callApi(
			'subscriptions',
			'get_subscribers_list',
			params,
			null,
			(err, data, status) ->
				xmlDoc = libxmljs.parseXmlString(data)
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200')
					subscribers = xmlDoc.get('//subscribers')
					
					returned = {'keyword_id': keyword_id, 'subscribers': []}
					if subscribers.attr('page') isnt null
						returned.page = subscribers.attr('page').value()
					if subscribers.attr('numberOfPages') isnt null
						returned.number_of_pages = subscribers.attr('numberOfPages').value()
					if subscribers.attr('numberOfRecords') isnt null
						returned.number_of_records = subscribers.attr('numberOfRecords').value()
					
					if returned.number_of_records && returned.number_of_records > 0
						subscriber_list = xmlDoc.get('//subscriber')
						# TODO: Make this non-blocking?
						if typeof subscriber_list == 'object' && Object.prototype.toString.call(subscriber_list) == '[object Array]'
							i = 0;
							subscriber_list.forEach((subscriber)->
								attrs = subscriber.attrs()
								if typeof attrs == 'object' && Object.prototype.toString.call(attrs) == '[object Array]'
									returned.subscribers[0] = {}
									attrs.forEach((attr) ->
										returned.subscribers[0][attr.name()] = attr.value()
									)
							)
							callback(null, returned, 200)
						else if typeof subscriber_list == 'object'
							attrs = subscriber_list.attrs()
							if typeof attrs == 'object' && Object.prototype.toString.call(attrs) == '[object Array]'
								returned.subscribers[0] = {}
								attrs.forEach((attr) ->
									returned.subscribers[0][attr.name()] = attr.value()
								)
							callback(null, returned, 200)
						else
							callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
					else
						callback(null, returned, 200)
			,
			version
		)
	
	get_subscribers_count = (account_id, keyword_id, field, callback, verOverride) ->
		version = verOverride || null
		params =
			'keywordId': keyword_id
			'accountId': account_id
		
		core.callApi(
			'subscriptions',
			'get_subscribers_count',
			params,
			null,
			(err, data, status) ->
				xmlDoc = libxmljs.parseXmlString(data)
				# status - not currently set properly
				# xmlDoc.root().attr('status').value()
				# xmlDoc.root().attr('statusCode').value()
				if(xmlDoc.root().attr('statusCode').value()=='200')
					count = xmlDoc.get('//subscribersCount')
					if(count.text())
						callback(null, count.text(), 200)
				else
					callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
			,
			version
		)
	
	run_filter = (account_id, keyword_id, fields, callback, verOverride) ->
		version = verOverride || null
		libxmljs.setTagCompression = 1
		doc = new libxmljs.Document((n) ->
			n.node('apiRequest', {token: token}, (n) ->
				n.node('runfilter', {'accountId': account_id, 'keywordId': keyword_id}, (n) ->
					if(fields.length>0)
						n.node('fields', (n) ->
							fields.forEach((field) ->
								n.node('field', {'id': field.id, 'value': field.value}, '')
							)
						)
				)
			)
		)
		xml_payload = doc.toString()
		core.callApi(
			'subscriptions',
			'run_filter',
			null,
			xml_payload,
			(err, data, status) ->
				if(data!='')
					xmlDoc = libxmljs.parseXmlString(data)
					# status - not currently set properly
					# xmlDoc.root().attr('status').value()
					# xmlDoc.root().attr('statusCode').value()
					if(xmlDoc.root().attr('statusCode').value()=='200')
						count = xmlDoc.get('//subscribersCount')
						if(count.text())
							callback(null, count.text(), 200)
					else
						callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
				else
					callback({'code':'500', 'msg':'Server Error', 'reason':'Sorry, but we received a blank response from MsgMe.'})
			,
			version
		)

	return {
		version: ver || core.vers['subscriptions']
		custom_field: custom_field
		define_custom_field: custom_field
		update_custom_field: custom_field
		get_custom_fields: get_custom_fields
		get_subscribers_list: get_subscribers_list
		get_subscribers_count: get_subscribers_count
		run_filter: run_filter
	}