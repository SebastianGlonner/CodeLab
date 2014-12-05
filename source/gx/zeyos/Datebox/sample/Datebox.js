$(document).addEvent('domready', function () {
	var myDatebox = new gx.zeyos.Datebox('myDatebox', {

	});
	var d = new Date();
	$('myDateboxTS').set('value', d.getTime())
	$('btnDateboxSet').addEvent('click', function() {
		myDatebox.set($('myDateboxTS').get('value'));
	});
	$('btnDateboxGet').addEvent('click', function() {
		alert(myDatebox.get());
	});
});
