$(document).addEvent('domready', function () {
	var mySelect = new gx.zeyos.Select('divSelect', {
		'url': window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + 'src/js/zeyos/Select/sample/data.json',
		'width': '300px'
	});
	$('btnSelectValue').addEvent('click', function() {
		alert(JSON.encode(mySelect.getSelected()));
	});
	$('btnSelectReset').addEvent('click', function() {
		mySelect.set();
	});
});
