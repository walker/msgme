If you have non-expiring tokens:
```
require('msgme')([token], null, 'https://api.revolutionmsg.com/')
```


Right now, the require is complicated if your account only has expiring tokens. Here's a coffeescript version of what it looks like:

```
msgme = null
require('msgme')({acctname: '[account name]', api_key: '[api key]'},
	(returned_obj)->
		msgme = returned_obj
	,
	'https://api.revolutionmsg.com/'
)
```