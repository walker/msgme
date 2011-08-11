If you have non-expiring tokens (I thought these existed, but now I can't verify that):

```
msgme = require('msgme')([token])
```


Right now, the require is complicated for expiring tokens. (CoffeeScript)

Here's the require for the beginning of the app:

```
msg_me = require('msgme')({acctname: '[acct_name_here]', api_key:'[api_key_here]'}, [Optional Non-standard API URL], [Optional API Version Specification])
```

The non-standard API URL would be for "Enterprise" users only wherein you have a custom API pointed at your msgme API account. It will be something like api.my_domain.com

The API version defaults to 1 and if anything is wrong with the API version you provide (doesn't exist, isn't a number) the library falls back to v1 of the API.

Then, wherever in your application you need to then start making requests of the msgme API, you have to wrap your application code that calls the msgme API in a get_token call:

```
msg_me.get_token(msg_me.token,
	(returned_obj)->
		msgme = returned_obj
		[Put the rest of your code here]
		[You can now call all other functions, for instance:]
		msgme.subscribers.add('[phonenumber]', [keyword_id], [shortcode], [terms], [addtl], () ->
			# result of API call to add subscriber's phonenumber
		)
	,
	msg_me.url
)
```