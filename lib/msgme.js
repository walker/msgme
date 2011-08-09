
var exports = module.exports = function(key, vers=1) {
	if (!key || typeof key != 'string') {
		if(typeof key == array && key.username && key.password) {
			// get expiring token
		} else {
			new Error('MsgMe: Key is required, request one from support@bandcamp.com if you do not have one.');
			return;
		}
	}
	
	var core = require('./core')(key, vers);
	
	return {
		version: '0.1', // Library version
		authenticate: require('./authenticate')(key),
		subscribers: require('./subscribers')(key),
		subscriptions: require('./subscriptions')(key),
		campaigns: require('./campaigns')(key),
		keywords: require('./keywords')(key),
		ivr: require('./ivr')(key),
		messaging: require('./messaging')(key)
	}

}