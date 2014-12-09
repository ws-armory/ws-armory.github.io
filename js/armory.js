const GOOGLE_API_KEY="AIzaSyDTZXoxGEyZZmCZmqCKxe0zBDUvaapwCfY"
const GOOGLE_SHORTENER_API="https://www.googleapis.com/urlshortener/v1/url"
const GOOGLE_SHORTENER_URI="http://goo.gl/"
const ITEM_SLOTS = {
	0: "Chest",
	1: "Legs",
	2: "Head",
	3: "Shoulder",
	4: "Feet",
	5: "Hands",
	6: "Tool",
	7: "Weapon Attachment",
	8: "Support System",
	9: "Key",
	10: "Implant",
	11: "Gadget",
	15: "Energy Shield",
	16: "Weapon",
	17: "Bag",
}

var linked = false;

function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
		} else {
		window.onload = function() {
			func();
			if (oldonload) {
				oldonload();
			}
		}
	}
}

function getRemoteUrl(path) {
	return window.location.protocol + '//'
		+ window.location.host + getLocalUrl(path);
}

function getLocalUrl(path) {
	return window.location.pathname.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') + '/' + path;
}

function loadGoogleAnalytics() {
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-11788240-7', 'auto');
	ga('send', 'pageview');
}

function loadParams() {
	var match,
	urlparams = {},
	exp = /([^&=]+)=?([^&]*)/g,
	query  = window.location.search.substring(1);

	while (match = exp.exec(query)) {
		if (urlparams[decodeURIComponent(match[1])] == undefined) {
			urlparams[decodeURIComponent(match[1])] = []
			urlparams[decodeURIComponent(match[1])].push(
				decodeURIComponent(match[2])
			);
		} else {
			urlparams[decodeURIComponent(match[1])].push(
				decodeURIComponent(match[2])
			);
		}
	}

	return urlparams;
}

function getSlotName(num) {
	if (isNaN(num))
		return num;
	else
	{
		if (ITEM_SLOTS[parseInt(num)])
			return ITEM_SLOTS[parseInt(num)];
		else
			return num;
	}
}

function viewItems(){
	var data = document.getElementById('data').value,
	query;

	try { data = atob(data) }
	catch(err){ }
	finally {
		try { data = JSON.parse(data) }
		catch(err) {
			alert("Invalid data (has to be JSON)");
			return;
		}
	}

	// TODO: validate object "data"
	query = '';
	for (var key in data) {
		query = query + '&' + encodeURIComponent(key)
			+ '='+ encodeURIComponent(data[key]);
	}
	window.location.assign(getLocalUrl('?' + query.slice(1)));
}

function loadItems(obj){
	var section = document.getElementById('main'),
	    error = document.getElementById('error');

	if (obj == null || Object.getOwnPropertyNames(obj).length === 0) {
		error.innerHTML = "No items given!";
		return;
	}

	var table = document.createElement('table'),
	thead = document.createElement('thead'),
	tbody = document.createElement('tbody'),
	button = document.createElement('button'),
	share = document.createElement('p'),
	link = document.createElement('input');

	table.id = 'items';
	table.appendChild(thead);
	table.appendChild(tbody);

	thead.appendChild(document.createElement('tr'));
	thead.firstChild.appendChild(document.createElement('th'));
	thead.firstChild.childNodes[0].appendChild(document.createTextNode('Slot'));
	thead.firstChild.childNodes[0].className = 'slot';
	thead.firstChild.appendChild(document.createElement('th'));
	thead.firstChild.childNodes[1].appendChild(document.createTextNode('Item'));
	thead.firstChild.childNodes[1].className = 'item';

	button.setAttribute('onclick','setShareLink()');
	button.appendChild(document.createTextNode('Share'));

	link.style.visibility = 'hidden';
	link.id = 'sharelink';
	link.setAttribute('onfocus','this.select()');
	link.setAttribute('onmouseup','return false;');
	link.setAttribute('type','text');

	share.id = 'share';
	share.appendChild(button);
	share.appendChild(document.createElement('br'));
	share.appendChild(link);

	section.appendChild(table);
	section.appendChild(share);

	for (var key in obj) {
		if (obj[key].constructor !== Array)
			continue;

		for (var i = 0; i < obj[key].length; i++) {
			var itemId = obj[key][i];

			if (itemId && isNaN(itemId))
				continue;

			var tr = document.createElement('tr');
			slot = document.createElement('td'),
			it = document.createElement('td'),
			a = document.createElement('a'),
			slotName = getSlotName(key);

			if (obj[key].length > 1) {
				slotName = slotName+' ['+(i+1).toString()+']';
			}

			var itemClass = ITEM_SLOTS[key].replace(' ', '_').toLowerCase();

			slot.className = 'slot ' + itemClass;
			slot.appendChild(document.createTextNode(slotName));

			a.className = 'item';
			a.href='http://' + JH_HOST + '/items/i-' + itemId;
			a.appendChild(document.createTextNode(itemId));

			it.className = 'item';
			it.appendChild(a);

			tr.appendChild(slot);
			tr.appendChild(it);

			tbody.appendChild(tr);
		}
	}
}

function setShareLink() {
	if (!window.XMLHttpRequest) {
		alert("XMLHttpRequest is disabled, please use a recent browser");
		return
	}

	if (linked) // already shared
		return;

	var xmlhttp = new XMLHttpRequest(),
	    link = document.getElementById('sharelink'),
	    error = document.getElementById('error'),
	    share = document.getElementById('share'),
	    url;

	xmlhttp.onreadystatechange = function (){
		if (xmlhttp.readyState == 4) {
		    	if (xmlhttp.status == 200)
			{
				var l = JSON.parse(xmlhttp.responseText),
					parser = document.createElement('a'),
					goid;
				parser.href = l['id'];
				goid = parser.pathname;
				if (goid.charAt(0) == '/')
					goid = goid.substr(1);
				link.setAttribute('value',getRemoteUrl('v?'+goid));
				link.style.visibility = 'visible';
				link.focus();
				linked = true;
			}
			else
			{
				error.innerHTML =
					"Got " + xmlhttp.status + " status "
					+ " using the URL shortening API<br/>"
					+ "Error: "+xmlhttp.responseText;
			}
		}
	}

	url = GOOGLE_SHORTENER_API;
	if (GOOGLE_API_KEY != null)
		url = url + '?key=' + GOOGLE_API_KEY;

	xmlhttp.open('POST',url,true);

	xmlhttp.setRequestHeader("Accept","application/json");
	xmlhttp.setRequestHeader("Content-type","application/json");

	xmlhttp.send(JSON.stringify({'longUrl': window.location.href}));
}

function getItemsPageParams(params) {
	if (!window.XMLHttpRequest) {
		alert("XMLHttpRequest is disabled, please use a recent browser");
		return
	}

	if (params.length > 1)
		return;


	var xmlhttp = new XMLHttpRequest(),
	    	error = document.getElementById('error'),
		key = null,
		url = null;

	for (var k in params) {
		key = k;
		break;
	}

	url = GOOGLE_SHORTENER_API + '?shortUrl=' + GOOGLE_SHORTENER_URI + key;
	if (GOOGLE_API_KEY != null)
		url = url + '&key=' + GOOGLE_API_KEY;

	xmlhttp.open('GET',url,false);
	xmlhttp.setRequestHeader("Accept","application/json");
	xmlhttp.send(null);

	if (xmlhttp.status == 200) {
		var uri = document.createElement('a');
		uri.href = JSON.parse(xmlhttp.responseText)['longUrl'];

		return uri.search;
	}
	else
	{
		error.innerHTML =
			"Got " + xmlhttp.status + " status "
			+ " using the URL shortening API<br>"
			+ "Error: " + xmlhttp.responseText;
	}
	return null;
}


function initIndex() {
	addLoadEvent(loadGoogleAnalytics());
}

function initView() {
	addLoadEvent(loadGoogleAnalytics());
	addLoadEvent(function (){
		JH_options = {
			preload: true,
			colors: true,
			names: true,
			whitebg: false,
		};
		loadItems(loadParams());
	});
}

function initRedirect() {
	addLoadEvent(function (){
		params = getItemsPageParams(loadParams())
		if (params)
		{
			window.location.assign(getLocalUrl(params));
		}
		else
		{
			document.getElementById('error').innerHTML =
				"Error: invalid query string !";
		}
	});
}
