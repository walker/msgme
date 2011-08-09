Right now, the require is complicated. Here's a coffeescript version of what it looks like:

```
msgme = null
require('msgme')({acctname: '[account name]', api_key: '[api key]'},
	(returned_obj)->
		msgme = returned_obj
	,
	'https://api.revolutionmsg.com/'
)
```