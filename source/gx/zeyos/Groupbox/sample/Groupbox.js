window.addEvent('domready', function () {
	var myGroupbox1 = new gx.zeyos.Groupbox('conGroupbox1', {'title': 'First Groupbox', 'show': true});
	var myGroupbox2 = new gx.zeyos.Groupbox('conGroupbox2', {'title': 'Second Groupbox'});
	var myGroupbox3 = new gx.zeyos.Groupbox(__({'html': 'Hello world'}), {'title': 'Third'});
	$(document.body).adopt(myGroupbox3.toElement());
});
