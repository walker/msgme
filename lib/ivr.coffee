######
# msgme IVR module
######

exports = module.exports = (token, ver) ->

	######
	# Module dependencies
	######
	core = require('./core')(token)
	
	return {
		version: ver || core.vers['ivr'],
	}
