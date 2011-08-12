######
# msgme Authenticate module
######

exports = module.exports = (token, url, ver) ->
	######
	# Module dependencies
	######
	core = require('./core')(token, url, ver)
	libxmljs = require('libxmljs')
	
	return {
		version: ver || core.vers['authenticate'],
		######
		# Retrieve a temporary, expiring token for subsequent API requests
		#
		# @param {String} api_key Api Key
		# @param {String} account_name Developer Account Username, not your username
		# @return {Object} A temporary token (token)
		######
		authenticate_api: (api_key, account_name, callback, verOverride) ->
			version = verOverride || null
			doc = new libxmljs.Document((n) ->
				n.node('apiRequest', (n) ->
					n.node('authenticateAPI', (n) ->
						n.node('apiKey', api_key)
						n.node('accountName', account_name)
					)
				)
			)
			
			xml_payload = doc.toString()
			core.callApi(
				'authenticate',
				'authenticate_api',
				null,
				xml_payload,
				(err, data, status) ->
					xmlDoc = libxmljs.parseXmlString(data)
					
					# status - not currently set properly
					# xmlDoc.root().attr('status').value()
					# xmlDoc.root().attr('statusCode').value()
					if(xmlDoc.root().attr('statusCode').value()=='200')
						callback(null, xmlDoc.get('//authToken').text(), 200)
					else
						callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
				,
				version
			)
		,
		
		######
		# Retrieve a account IDs that a particular token has the right to access
		#
		# @param {Function} callback
		# @param {Number} verOverride The API version you wish to query.
		# @return {Object} An array of objects. Each object contains an account id & account name.
		######
		get_account_ids: (callback, verOverride) ->
			if(typeof version != 'string' || typeof version != 'number')
				verOverride = null
			version = verOverride || null
			
			core.callApi(
				'authenticate',
				'get_account_ids',
				null,
				null,
				(err, data, status) ->
					xmlDoc = libxmljs.parseXmlString(data)
					
					# status - not currently set properly
					# xmlDoc.root().attr('status').value()
					# xmlDoc.root().attr('statusCode').value()
					if(xmlDoc.root().attr('statusCode').value()=='200')
						returned = []
						
						account_list = xmlDoc.find('//account')
						# TODO: Make this non-blocking?
						if typeof account_list == 'object'
							i = 0;
							account_list.forEach((account)->
								returned[i] =
									'account_id': account.attr('accountId').value()
									'account_name': account.attr('accountName').value()
								i++
							)
						callback(null, returned, 200)
					else
						callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
				,
				version
			)
	}
