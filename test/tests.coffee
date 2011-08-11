assert = require('assert')
i = require('util').inspect

######
# Replace key with your own non-expiring Token.
# Requires Expresso to run this test, npm install expresso -g; cd ..; expresso -I lib
######
key = '[token]'

# or account name / api key
expiring_token_key = {acctname: '[acct_name]', api_key: '[token]'}


# Test Token
msgme = null
require('msgme')(key,
	(returned_obj)->
		msgme = returned_obj
)

module.exports = {
	'Test .authenticate': () ->
		# incorrect type for key
		assert.throws(require('msgme')(23))
		# incorrect credentials for expiring key
		assert.throws(require('msgme')({acctname:expiring_token_key.acctname, api_key:expiring_token_key.api_key+'354353432'}))
		
		assert.type(require('msgme')(expiring_token_key), 'object')
		
		assert.type(require('msgme')(key), 'object')
		
		assert.throws(require('msgme')(key+'234322342'))
	,
	'Test .version': function() {
		# not setting version
		msgme_1 = require('msgme')(key)
		assertEqual(msgme_1.version, 1);
		
		# setting a version that exists
		msgme_2 = require('msgme')(key)
		assertEqual(msgme_2.version, 1);
		
		# setting a version that doesn't exists, should reset to most recent version
		# TODO: Make this throw error, instead? Is this the proper action for this circumstance?
		msgme_3 = require('msgme')(key, 5)
		assertEqual(msgme_3.version, 1);
	},
}