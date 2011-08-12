######
# msgme Campaigns module
######

exports = module.exports = (token, url, ver) ->
	######
	# Module dependencies
	######
	core = require('./core')(token, url, ver)
	
	create = (campaign, keyword, subscription, optin_message, confirm_message, do_not_send_content, limit_subscribers, max_subscribers, schedule, scheduled_datetime, time_zone, type, content, uri, title, description, verOverride) ->
		version = verOverride || null
	
	remove = (account_id, campaign_id, verOverride) ->
		version = verOverride || null
	
	return {
		version: ver || core.vers['campaigns']
		create_campaign: create
		delete_campaign: remove
	}
