######
# msgme IVR module
######

exports = module.exports = (token, url, ver) ->
	######
	# Module dependencies
	######
	core = require('./core')(token, url, ver)
	
	get_inbound_vmails = (, verOverride) ->
		version = verOverride || null
	
	get_outbound_vmails = (, verOverride) ->
		version = verOverride || null
	
	delete_inbound_vmails = (, verOverride) ->
		version = verOverride || null
	
	send_ivr_message = (, verOverride) ->
		version = verOverride || null
	
	return {
		version: ver || core.vers['ivr']
		get_inbound_vmails: get_inbound_vmails
		get_outbound_vmails: get_outbound_vmails
		delete_inbound_vmails: delete_inbound_vmails
		send_ivr_message: send_ivr_message
	}
