######
# msgme Authenticate module
######

exports = module.exports = (token, url, ver) ->
	
	######
	# Module dependencies
	######
	core = require('./core')(token, url, ver)
	jstoxml = require('jstoxml')
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
			xml_payload = jstoxml.toXML({
				'apiRequest': {
					'authenticateAPI': {
						'apiKey' : api_key
						'accountName' : account_name
					}
				}
			}, true)
			core.callApi(
				'authenticate',
				'authenticate_api',
				null,
				xml_payload,
				(err, result, status) ->
					xmlDoc = libxmljs.parseXmlString(result)
					
					# status - not currently set properly
					# xmlDoc.root().attr('status').value()
					# xmlDoc.root().attr('statusCode').value()
					if(xmlDoc.root().attr('statusCode').value()=='200')
						callback(null, xmlDoc.get('//authToken').text(), 200);
					else
						callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value()})
				,
				version
			)
		,
		get_account_ids: (api_key, account_name, callback, verOverride) ->
			version = verOverride || null
	}
