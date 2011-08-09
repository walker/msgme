######
# msgme Subscribers module
######

exports = module.exports = (token, url, ver) ->

	######
	# Module dependencies
	######
	core = require('./core')(token, url)
	
	######
	# Retrieve a mobile number's subscriptions
	#
	# @param {String} msidn 10-digit mobile number
	# @return {Object} An object with an array called {Array} 
	######
	list_subscriptions = (msidn, callback, verOverride) ->
		version = verOverride || null
		params = {
			'msidn': msidn
		}
		
		core.callApi('subscribers', 'list_subscriptions', params, callback, version)
	
	######
	# Add a subscriber to a tokenword
	#
	# @param {String} msidn 10-digit mobile number
	# @param {String} tokenword ID
	# @param {String} shortcode the tokenword ID must belong to this shortcode
	# @param {String} msidn 
	# @param {String} msidn 10-digit mobile number
	# @param {String} msidn 10-digit mobile number
	# @param {String} passthrough Optional passthrough information
	# @return {Object} An object with status, status_code, and subscriber_id
	######
	add_subscriber = (msidn, tokenword_id, shortcode, terms, addtl, callback, passthrough, callback, verOverride) ->
		version = verOverride || null
		
		# handle additional information
		if(addtl)
			fields = this._parse_payload_fields(addtl)
		else
			fields = {}
		
		payload = 
			'subscriber':
				_attrs:
					'msidn': msidn
				_content:
					'tokenword':
						_attrs:
							'tokenwordId': tokenword_id
							'shortcode': shortcode
						_content:
							fields
		
		payload.terms = if !terms then false else true
		if passthrough
			payload.passthrough = passthrough
		
		xml_payload = jstoxml.toXML({
			'apiRequest': {
				_attrs: {
					'token': token
				},
				'addSubscriber': payload
			}
		}, true)
		
		core.callApi('subscribers', 'list_subscriptions', null, xml_payload, callback, version)
	
	######
	# Retrieve a subscriber's information
	#
	# @param {String} msidn 10-digit mobile number
	# @param {String} the tokenword ID of the subscribeable tokenword "If a tokenword ID is included then metadata associated with the subscriber for that tokenword will be returned." - from msgme API docs.
	# @return {Object} An object with an array called {Array} 
	######
	get_subscriber = (msidn, tokenwordId, callback, verOverride) ->
		version = verOverride || null
		params = {
			'msidn': msidn
		}
		
		core.callApi('subscribers', 'get_subscriber', params, null, callback, version)
	
	
	######
	# Retrieve a subscriber's information
	#
	# @param {String} msidn 10-digit mobile number
	# @param {String} the tokenword ID of the subscribeable tokenword "If a tokenword ID is included then metadata associated with the subscriber for that tokenword will be returned." - from msgme API docs.
	# @param {String} the shortcode the tokenword ID is associated with
	# @return {Object} An object with an array called {Array} 
	######
	update_subscriber = (msidn, tokenword_id, shortcode, callback, verOverride) ->
		version = verOverride || null
		
		core.callApi('subscribers', 'unsubscribe_subscriber', params, null, callback, version)
	
	######
	# Retrieve a subscriber's information
	#
	# @param {String} msidn 10-digit mobile number
	# @param {String} the tokenword ID of the subscribeable tokenword "If a tokenword ID is included then metadata associated with the subscriber for that tokenword will be returned." - from msgme API docs.
	# @param {String} the shortcode the tokenword ID is associated with
	# @return {Object} An object with an array called {Array} 
	######
	unsubscribe_subscriber = (msidn, tokenword_id, shortcode, callback, verOverride) ->
		version = verOverride || null
		
		core.callApi('subscribers', 'unsubscribe_subscriber', params, null, callback, version)
	
	######
	# Set more information about a subscriber. The default fields are below.
	#   state: Standard 2-letter abbreviation code (Example: CA, NY)
	#   city: Alphanumeric
	#   gender: Accepted values: Male, Female
	#   dob: Date of birth formatted as "YYYYMMDD"
	#   zip: 5-digit numeric
	#   email: Properly formatted email address
	#   carrier: Accepted values: AllTel, ATT, ATT Blue, Boost, Nextel, Sprint, TMobile, USCellular, Verizon, Virgin
	#
	# @param {Object} An object full of additional parameters for updating for add a subscriber
	# @return {Object} An object ready for inserting into jstoxml doc being constructed
	######
	_parse_payload_fields = (addtl) ->
		fields_arr = []
		for attr_name in addtl
			fields_arr.push({
				'field':
					_attrs:
						'name': attr_name
					'fieldValues':
						'fieldValue':
							_attrs:
								'value': addtl[attr_name]
			})
		
		if(fields_arr.length>0)
			return {'fields': fields_arr}
	
	return {
		version: ver || core.vers['subscribers'],
		list_subscriptions: list_subscriptions,
		add_subscriber: add_subscriber,
		get_subscriber: get_subscriber,
		update_subscriber: update_subscriber,
		unsubscribe_subscriber: unsubscribe_subscriber
	}