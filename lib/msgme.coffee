exports = module.exports = (token, non_standard_url, vers) ->
	if (non_standard_url && typeof non_standard_url == 'string')
		if non_standard_url.lastIndexOf('/')+1 != non_standard_url.length
			non_standard_url = non_standard_url+'/'
		if non_standard_url.indexOf('http://')==-1 && non_standard_url.indexOf('https://')==-1
			non_standard_url = 'http://'+non_standard_url
		
		if(non_standard_url)
			url = non_standard_url
		else
			url = null
	else
		url = null
	
	msgme_versions = [1]
	
	vers = null if vers not in msgme_versions
	
	if(typeof token == 'object' && token.acctname && token.api_key)
		return {
			'token': token,
			'url': url,
			'get_token': (token, main_callback, url) ->
				if(typeof token == 'object' && token.acctname && token.api_key)
					auth = require('./authenticate')(token, url, vers)
					# get expiring token
					auth.authenticate_api(token.api_key, token.acctname, (err, data, status) -> 
						if(err && err.code!='200')
							main_callback(err)
						else if(data)
							new_token = data
							main_callback({
								token: new_token,
								url: url,
								version: if vers then vers else 1, # API version
								authenticate: require('./authenticate')(new_token, url, vers),
								subscribers: require('./subscribers')(new_token, url, vers),
								subscriptions: require('./subscriptions')(new_token, url, vers),
								campaigns: require('./campaigns')(new_token, url, vers),
								keywords: require('./keywords')(new_token, url, vers),
								ivr: require('./ivr')(new_token, url, vers),
								messaging: require('./messaging')(new_token, url, vers)
							})
						else
							new Error('MsgMe: We were unable to acquire an API authentication token.')
							return
					)
				else
					new Error('MsgMe: Token (Account name/Api Key) is required, sign up for a MsgMe.com account if you do not have one.')
					return
		}
	else if(typeof token == 'string')
		return {
			token: token,
			version: '0.1', # Library version
			authenticate: require('./authenticate')(token, url, vers),
			subscribers: require('./subscribers')(token, url, vers),
			subscriptions: require('./subscriptions')(token, url, vers),
			campaigns: require('./campaigns')(token, url, vers),
			keywords: require('./keywords')(token, url, vers),
			ivr: require('./ivr')(token, url, vers),
			messaging: require('./messaging')(token, url, vers)
		}
	else
		new Error('MsgMe: Token (Account name/Api Key) is required, sign up for a MsgMe.com account if you do not have one.')
		return