$(document).addEvent('domready', function () {
	var myPopup = new gx.zeyos.Popup({
		'width': 300
	});
	$('btnPopup').addEvent('click', function() {
		myPopup.setContent($('txtPopup').value);
		myPopup.show();
	});
});
