/**
 * msgme Subscribers module
 */

var exports = module.exports = function(key, ver) {

	/**
	* Module dependencies
	*/
	var core = require('./core')(key);
	
	return {
		version: ver || core.vers['subscribers'],
		list_subscriptions: list_subscriptions,
		add_subscriber: add_subscriber,
		get_subscriber: get_subscriber,
		update_subscriber: update_subscriber,
		unsubscribe_subscriber: unsubscribe_subscriber
	}
	
	/**
	* Retrieve a mobile number's subscriptions
	*
	* @param {String} msidn 10-digit mobile number
	* @return {Object} An object with an array called {Array} 
	*/
	function list_subscriptions(msidn, verOverride) {
		var version = verOverride || null,
		params = {
			'msidn': msidn
		};
		
		core.callApi('subscribers', 'list_subscriptions', params, callback, version);
	}
	
	/**
	* Add a subscriber to a keyword
	*
	* @param {String} msidn 10-digit mobile number
	* @param {String} keyword ID
	* @param {String} shortcode the keyword ID must belong to this shortcode
	* @param {String} msidn 
	* @param {String} msidn 10-digit mobile number
	* @param {String} msidn 10-digit mobile number
	* @param {String} passthrough Optional passthrough information
	* @return {Object} An object with status, status_code, and subscriber_id
	*/
	function add_subscriber(msidn, keyword_id, shortcode, terms, addtl, passthrough, verOverride) {
		var version = verOverride || null,
		
		// handle additional information
		if(addtl) {
			fields = this._parse_payload_fields(addtl);
		} else {
			fields = {};
		}
		
		payload = {
			'subscriber': {
				_attrs: {
					'msidn': msidn,
				},
				_content: {
					'keyword': {
						_attrs: {
							'keywordId': keyword_id,
							'shortcode': shortcode,
						},
						_content: {
							fields
						}
					}
			}
			'terms': (!terms) ? false : true;
		};
		
		// Not supporting passthrough yet.
		if(passthrough) payload.passthrough = passthrough;
		
		xml_payload = jstoxml.toXML({
			'apiRequest': {
				_attrs: {
					'token': key
				},
				'addSubscriber': payload
			}
		});
		
		core.callApi('subscribers', 'list_subscriptions', null, xml_payload, version);
	}
	
	/**
	* Retrieve a subscriber's information
	*
	* @param {String} msidn 10-digit mobile number
	* @param {String} the keyword ID of the subscribeable keyword "If a keyword ID is included then metadata associated with the subscriber for that keyword will be returned." - from msgme API docs.
	* @return {Object} An object with an array called {Array} 
	*/
	function get_subscriber(msidn, keywordId, verOverride) {
		var version = verOverride || null,
		params = {
			'msidn': msidn
		};
		
		core.callApi('subscribers', 'get_subscriber', params, null, version);
	}
	
	
	/**
	* Retrieve a subscriber's information
	*
	* @param {String} msidn 10-digit mobile number
	* @param {String} the keyword ID of the subscribeable keyword "If a keyword ID is included then metadata associated with the subscriber for that keyword will be returned." - from msgme API docs.
	* @param {String} the shortcode the keyword ID is associated with
	* @return {Object} An object with an array called {Array} 
	*/
	function update_subscriber(msidn, keyword_id, shortcode, verOverride) {
		var version = verOverride || null;
		
		core.callApi('subscribers', 'unsubscribe_subscriber', params, null, version);
	}
	
	/**
	* Retrieve a subscriber's information
	*
	* @param {String} msidn 10-digit mobile number
	* @param {String} the keyword ID of the subscribeable keyword "If a keyword ID is included then metadata associated with the subscriber for that keyword will be returned." - from msgme API docs.
	* @param {String} the shortcode the keyword ID is associated with
	* @return {Object} An object with an array called {Array} 
	*/
	function unsubscribe_subscriber(msidn, keyword_id, shortcode, verOverride) {
		var version = verOverride || null;
		
		core.callApi('subscribers', 'unsubscribe_subscriber', params, null, version);
	}
	
	/**
	* Set more information about a subscriber. The default fields are below.
	*   state: Standard 2-letter abbreviation code (Example: CA, NY)
	*   city: Alphanumeric
	*   gender: Accepted values: Male, Female
	*   dob: Date of birth formatted as "YYYYMMDD"
	*   zip: 5-digit numeric
	*   email: Properly formatted email address
	*   carrier: Accepted values: AllTel, ATT, ATT Blue, Boost, Nextel, Sprint, TMobile, USCellular, Verizon, Virgin
	*
	* @param {Object} An object full of additional parameters for updating for add a subscriber
	* @return {Object} An object ready for inserting into jstoxml doc being constructed
	*/
	function _parse_payload_fields(addtl) {
		fields_arr = Array();
		for(var attr_name in addtl) {
			fields_arr[] = {
				'field':
					_attrs: {
						'name': attr_name
					},
					'fieldValues':
					{
						'fieldValue':
							_attrs: {
								'value': addtl[attr_name]
							}
					}
			}
		}
		if(fields_arr.length>0) {
			return {
				'fields': fields_arr
			}
		}
	}
}