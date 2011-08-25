######
# msgme Messaging module
######

exports = module.exports = (token, url, ver) ->
	######
	# Module dependencies
	######
	core = require('./core')(token, url, ver)
	libxmljs = require('libxmljs')
	
	get_delivery_receipts = (, verOverride) ->
		version = verOverride || null
	
	get_message_activity = (, verOverride) ->
		version = verOverride || null
	
	get_message_status = (, verOverride) ->
		version = verOverride || null
	
	get_mo_message = (, verOverride) ->
		version = verOverride || null
	
	get_mt_message = (, verOverride) ->
		version = verOverride || null
	
	send_keyword_content	 = (, verOverride) ->
			version = verOverride || null
	
	send_message = (account_id, shortcode, message, msidns, schedule, callback, verOverride) ->
		version = verOverride || null
		
		if(!schedule || schedule==null || typeof schedule!='string')
			d = new Date()
			if(d.getSeconds()>29)
				e = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()+1, d.getSeconds()+30)
			else
				e = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()+30)
			e = new Date(d.getTime()+5000)
			month = e.getMonth()+1
			if(month<10)
				month = '0'+month
			else
				month = month
			if(e.getDate()<10)
				date = '0'+e.getDate()
			else
				date = e.getDate()
			if(e.getHours()<10)
				hours = '0'+e.getHours()
			else
				hours = e.getHours()
			if(e.getMinutes()<10)
				minutes = '0'+e.getMinutes()
			else
				minutes = e.getMinutes()
			if(e.getSeconds()<10)
				serconds = '0'+e.getSeconds()
			else
				seconds = e.getSeconds()
			
			schedule = e.getFullYear()+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds
		
		libxmljs.setTagCompression = 1
		doc = new libxmljs.Document((n) ->
			n.node('apiRequest', {token: token}, (n) ->
				n.node('SendMessage', {'accountId': account_id}, (n) ->
					if(msidns.length>0)
						n.node('msidns', (n) ->
							msidns.forEach((msidn) ->
								n.node('msidn', {'terms': 'true'}, msidn)
							)
						)
					n.node('shortcode', shortcode)
					n.node('message', message)
					n.node('schedule', schedule)
				)
			)
		)
		xml_payload = doc.toString()
		if(data!='')
			xmlDoc = libxmljs.parseXmlString(data)
			# status - not currently set properly
			# xmlDoc.root().attr('status').value()
			# xmlDoc.root().attr('statusCode').value()
			if(xmlDoc.root().attr('statusCode').value()=='200')
				message_id = xmlDoc.get('//message')
				if(message_id.attr('id').value())
					callback(null, count.text(), 200)
			else
				callback({'code':xmlDoc.root().attr('statusCode').value(), 'msg':xmlDoc.root().attr('status').value(), 'reason': xmlDoc.get('//reason').text()})
		else
			callback({'code':'500', 'msg':'Server Error', 'reason':'Sorry, but we received a blank response from MsgMe.'})
	
	send_subscribers_message = (, verOverride) ->
		version = verOverride || null
	
	
	return {
		version: ver || core.vers['messaging']
		get_delivery_receipts: get_delivery_receipts
		get_message_activity: get_message_activity
		get_message_status: get_message_status
		get_mo_message: get_mo_message
		get_mt_message: get_mt_message
		send_keyword_content: send_keyword_content
		send_message: send_message
		send_subscribers_message: send_subscribers_message
	}
