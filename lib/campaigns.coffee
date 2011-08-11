######
# msgme Campaigns module
######

exports = module.exports = (token, url, ver) ->

	######
	# Module dependencies
	######
	core = require('./core')(token, url, ver)
	
	return {
		version: ver || core.vers['campaigns'],
	}
