######
# msgme Messaging module
######

exports = module.exports = (token, url, ver) ->
	######
	# Module dependencies
	######
	core = require('./core')(token, url, ver)
	
	get_delivery_receipts = (, verOverride) ->
		version = verOverride || null
	
	get_message_activity = (, verOverride) ->
		version = verOverride || null
	
	get_message_status = (, verOverride) ->
		version = verOverride || null
	
	get_mo_message = (, verOverride) ->
		version = verOverride || null
	
	get_mt_message = (, verOverride) ->
		version = verOverride || null
	
	send_keyword_content	 = (, verOverride) ->
			version = verOverride || null
	
	send_message = (, verOverride) ->
		version = verOverride || null
	
	send_subscribers_message = (, verOverride) ->
		version = verOverride || null
	
	
	return {
		version: ver || core.vers['messaging']
		get_delivery_receipts: get_delivery_receipts
		get_message_activity: get_message_activity
		get_message_status: get_message_status
		get_mo_message: get_mo_message
		get_mt_message: get_mt_message
		send_keyword_content: send_keyword_content
		send_message: send_message
		send_subscribers_message: send_subscribers_message
	}
