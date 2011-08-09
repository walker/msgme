######
# msgme Subscriptions module
######

exports = module.exports = (token, url, ver) ->

	######
	# Module dependencies
	######
	core = require('./core')(token, url)
	
	return {
		version: ver || core.vers['subscriptions'],
	}
