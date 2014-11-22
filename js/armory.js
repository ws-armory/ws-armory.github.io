const GOOGLE_API_KEY=null
const GOOGLE_SHORTENER_API="https://www.googleapis.com/urlshortener/v1/url"
const GOOGLE_SHORTENER_URI="http://goo.gl/"
const ITEM_SLOTS = [
	"Chest",
	"Legs",
	"Head",
	"Shoulder",
	"Feet",
	"Hands",
	"Tool",
	"Weapon Attachment",
	"Support System",
	"Key",
	"Implant",
	"Gadget",
	"Energy Shield",
	"Weapon",
]
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
		urlparams[decodeURIComponent(match[1])] =
			decodeURIComponent(match[2]);
	}

	return urlparams;
}

function isValidSlot(num) {
	if (isNaN(num))
		return true;
	else
		return (parseInt(num)-1) < ITEM_SLOTS.length;
}

function getSlotName(num) {
	if (isNaN(num))
		return num;
	else
		return ITEM_SLOTS[parseInt(num)-1];
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
	window.location.assign(getLocalUrl('view.html?' + query.slice(1)));
}

function loadItems(obj){
	var section = document.getElementById('main'),
	table = document.createElement('table'),
	thead = document.createElement('thead'),
	tbody = document.createElement('tbody'),
	button = document.createElement('button'),
	share = document.createElement('p'),
	link = document.createElement('input'),
	error = document.createElement('p');

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

	error.id = 'shareerror';

	share.id = 'share';
	share.appendChild(button);
	share.appendChild(link);

	section.appendChild(table);
	section.appendChild(share);
	share.appendChild(error);

	for (var key in obj) {
		if (!isValidSlot(key))
			continue;

		var tr = document.createElement('tr');
		slot = document.createElement('td'),
		it = document.createElement('td'),
		a = document.createElement('a');

		slot.className = 'slot';
		slot.appendChild(document.createTextNode(getSlotName(key)));

		a.className = 'item';
		a.href='http://' + JH_HOST + '/items/i-' + obj[key];
		a.appendChild(document.createTextNode(obj[key]));

		it.className = 'item';
		it.appendChild(a);

		tr.appendChild(slot);
		tr.appendChild(it);

		tbody.appendChild(tr);
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
	    link = document.getElementById("sharelink"),
	    error = document.getElementById("shareerror"),
	    share = document.getElementById("share"),
	    params = {};

	xmlhttp.onreadystatechange = function (){
		if (xmlhttp.readyState == 4) {
		    	if (xmlhttp.status == 200)
			{
				var l = JSON.parse(xmlhttp.responseText),
					parser = document.createElement('a');
				parser.href = l['id'];
				link.setAttribute('value',
					getRemoteUrl('v.html?'
						+ parser.pathname.substr(1))
				);
				link.style.visibility = 'visible';
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

	xmlhttp.open('POST',GOOGLE_SHORTENER_API,true);

	xmlhttp.setRequestHeader("Accept","application/json");
	xmlhttp.setRequestHeader("Content-type","application/json");

	params['longUrl'] = window.location.href;
	if (GOOGLE_API_KEY != null)
		params['key'] = GOOGLE_API_KEY;
	xmlhttp.send(JSON.stringify(params));
}

function getItemsPageParams(params) {
	if (!window.XMLHttpRequest) {
		alert("XMLHttpRequest is disabled, please use a recent browser");
		return
	}

	if (params.length > 1)
		return;


	var xmlhttp = new XMLHttpRequest(),
	    	error = document.getElementById("error"),
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
			whitebg: true,
		};
		loadItems(loadParams());
	});
}

function initRedirect() {
	addLoadEvent(function (){
		params = getItemsPageParams(loadParams())
		if (params)
			window.location.assign(getLocalUrl('view.html' + params));
	});
}
