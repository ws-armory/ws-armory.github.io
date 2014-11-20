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

function loadItems(obj){
	var section = document.getElementById('main'),
	table = document.createElement('table'),
	thead = document.createElement('thead'),
	tbody = document.createElement('tbody'),
	button = document.createElement('button'),
	share = document.createElement('p'),
	link = document.createElement('a');

	table.setAttribute('id','items');
	thead.appendChild(document.createElement('tr'));
	thead.firstChild.appendChild(document.createElement('th'));
	thead.firstChild.childNodes[0].appendChild(document.createTextNode('Slot'));
	thead.firstChild.childNodes[0].setAttribute('class','slot');
	thead.firstChild.appendChild(document.createElement('th'));
	thead.firstChild.childNodes[1].appendChild(document.createTextNode('Item'));
	thead.firstChild.childNodes[1].setAttribute('class','item');

	table.appendChild(thead);
	table.appendChild(tbody);

	link.setAttribute('id','share');
	link.setAttribute('href','#');

	button.appendChild(document.createTextNode('Share'));
	button.setAttribute('onclick','share()');

	share.appendChild(button);
	share.appendChild(link);

	section.appendChild(table);
	section.appendChild(share);

	for (var key in obj) {
		var tr = document.createElement('tr');
		tbody.appendChild(tr);
		var slot = document.createElement('td');
		slot.appendChild(document.createTextNode(key));
		slot.setAttribute('class','slot');
		tr.appendChild(slot);
		var item = document.createElement('td');
		item.appendChild(document.createElement('a'));
		item.firstChild.appendChild(document.createTextNode(obj[key]));
		item.firstChild.href='http://' + JH_HOST + '/items/' + obj[key];
		item.firstChild.setAttribute('class','item');
		item.setAttribute('class','item');
		tr.appendChild(item);
	}
}

function share() {
	alert("Share!");
}

function initView() {
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
