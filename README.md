If you have non-expiring tokens (I thought these existed, but now I can't verify that):

```
msgme = require('msgme')([token], [api_url], [api_version])
```


Right now, the require is complicated for expiring tokens. (CoffeeScript)

Here's the require for the beginning of the app:

```
msg_me = require('msgme')({acctname: '[acct_name_here]', api_key:'[api_key_here]'}, [Optional Non-standard API URL], [Optional API Version Specification])
```

The non-standard API URL would be for "Enterprise" users only wherein you have a custom API pointed at your msgme API account. It will be something like api.my_domain.com

The API version defaults to 1 and if anything is wrong with the API version you provide (doesn't exist, isn't a number) the library falls back to v1 of the API.

Then, wherever in your application you need to then start making requests of the msgme API, you have to wrap your application code that calls the msgme API in a get_token call.

Get Account IDs

```
msg_me.get_token(msg_me.token,
	(returned_obj)->
		if(returned_obj.code && returned_obj.code!='200')
			res.send(returned_obj.reason)
		else
			msgme = returned_obj
			
			msgme.authenticate.get_account_ids((err, data, status) ->
				if err
					res.send(err.reason)
				else
					console.log("app-data")
					res.send(data)
			)
```

Get Keywords attached to shortcode

```
msg_me.get_token(msg_me.token,
	(returned_obj)->
		if(returned_obj.code && returned_obj.code!='200')
			res.send(returned_obj.reason)
		else
			msgme = returned_obj
			
			msgme.keywords.get_keywords('[account id]', '[shortcode]', (err, data, status) ->
				if err
					res.send(err.reason)
				else
					res.send(data)
			)
```

Add subscriber

```
msg_me.get_token(msg_me.token,
	(returned_obj)->
		if(returned_obj.code && returned_obj.code!='200')
			res.send(returned_obj.reason)
		else
			msgme = returned_obj
			
			msgme.subscribers.add_subscriber('[phone number/msidn]', '[keyword id]', '[shortcode]', true, [{name: 'gender', value: 'Male'},{name: 'zip', value:'60601'},{name:'email', value:'email@domain.com'}], (err, data, status) ->
				if err
					res.send(err.reason)
				else
					res.send(data)
			)
```

List Subscriptions for a particular Subscriber

```
msg_me.get_token(msg_me.token,
	(returned_obj)->
		if(returned_obj.code && returned_obj.code!='200')
			res.send(returned_obj.reason)
		else
			msgme = returned_obj
			
			msgme.subscribers.list_subscriptions('[phone number/msidn]', (err, data, status) ->
				if err
					res.send(err.reason)
				else
					console.log("app-data")
					res.send(data)
			)
```

Get Info About Subscriber

```
msg_me.get_token(msg_me.token,
	(returned_obj)->
		if(returned_obj.code && returned_obj.code!='200')
			res.send(returned_obj.reason)
		else
			msgme = returned_obj
			
			msgme.subscribers.get_subscriber('[phone number/msidn]', '[keyword id]', (err, data, status) ->
				if err
					res.send(err.reason)
				else
					console.log("app-data")
					res.send(data)
			)
```

Update a Subscriber's Information

```
msg_me.get_token(msg_me.token,
	(returned_obj)->
		if(returned_obj.code && returned_obj.code!='200')
			res.send(returned_obj.reason)
		else
			msgme = returned_obj
			
			msgme.subscribers.update_subscriber('[phone number/msidn]', '[subscriber id]', '[keyword id]', '[shortcode]', [{'name':'dob', 'value': '19770101'}, {'name':'zip', 'value':'60601', 'update_method':'overwrite'}, {'name':'gender', 'value':'Male'}, {'name':'city', 'value':'Chicago', 'update_method':'remove'}, {'name':'email', 'value':', email@domain.com', 'update_method':'append'}, {'name':'state', 'value':'IL'}], (err, data, status) ->
				if err
					res.send(err.reason)
				else
					console.log("app-data")
					res.send(data)
			)
```

Unsubscribe a subscriber from a particular keyword (todo: unsubscribe a subscriber from particular keywordS)

```
msg_me.get_token(msg_me.token,
	(returned_obj)->
		if(returned_obj.code && returned_obj.code!='200')
			res.send(returned_obj.reason)
		else
			msgme = returned_obj
			
			msgme.subscribers.unsubscribe_subscriber('[phone number/msidn]', '[keyword id]', '[shortcode]', (err, data, status) ->
				if err
					res.send(err.reason)
				else
					console.log("app-data")
					res.send(data)
			)
```