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
	window.location.assign('view.html?' + query.slice(1));
}

function loadItems(obj){
	var section = document.getElementById('main'),
	table = document.createElement('table'),
	thead = document.createElement('thead'),
	tbody = document.createElement('tbody'),
	button = document.createElement('button'),
	share = document.createElement('p'),
	link = document.createElement('a');

	table.setAttribute('id','items');
	table.appendChild(thead);
	table.appendChild(tbody);

	thead.appendChild(document.createElement('tr'));
	thead.firstChild.appendChild(document.createElement('th'));
	thead.firstChild.childNodes[0].appendChild(document.createTextNode('Slot'));
	thead.firstChild.childNodes[0].setAttribute('class','slot');
	thead.firstChild.appendChild(document.createElement('th'));
	thead.firstChild.childNodes[1].appendChild(document.createTextNode('Item'));
	thead.firstChild.childNodes[1].setAttribute('class','item');

	link.setAttribute('id','share');
	link.setAttribute('href','#');

	button.setAttribute('onclick','share()');
	button.appendChild(document.createTextNode('Share'));

	share.appendChild(button);
	share.appendChild(link);

	section.appendChild(table);
	section.appendChild(share);

	for (var key in obj) {
		if (!isValidSlot(key))
			continue;

		var tr = document.createElement('tr');
		slot = document.createElement('td'),
		item = document.createElement('td');

		slot.setAttribute('class','slot');
		slot.appendChild(document.createTextNode(getSlotName(key)));
		tr.appendChild(slot);

		item.setAttribute('class','item');
		item.appendChild(document.createElement('a'));
		item.firstChild.appendChild(document.createTextNode(obj[key]));
		item.firstChild.setAttribute('class','item');
		item.firstChild.href='http://' + JH_HOST + '/items/' + obj[key];
		tr.appendChild(item);

		tbody.appendChild(tr);
	}
}

function share() {
	alert("Share!");
}



function initIndex() {
	loadGoogleAnalytics();
}

function initView() {
	loadGoogleAnalytics();
	addLoadEvent(function (){
		JH_options = {
			colors: true,
			names: true,
			whitebg: true,
			preload: true
		};
		loadItems(loadParams());
	});
}
