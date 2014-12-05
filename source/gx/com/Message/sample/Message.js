window.addEvent('domready',function(){
	var myMessage = new gx.com.Message($(document.body), {'messageWidth': 400});
	myMessage.addEvent('click', function() {
		myMessage.clear();
	});
	$('btnAddMessage').addEvent('click', function(e) {
		myMessage.addMessage($('txtMessageText').get('value'), $('txtMessageType').get('value'), true);
	});
	$('btnAddMessageBlend').addEvent('click', function(e) {
		myMessage.addMessage($('txtMessageText').get('value'), $('txtMessageType').get('value'), true, true);
	});
	$('btnClear').addEvent('click', function(e) {
		myMessage.clear();
	});
	$('btnStatusBar').addEvent('click', function(e) {
		myMessage.showStatus(0.7, 'Loading', 1);
		myMessage.hideStatus.delay(2000, myMessage);
	});
	$('btnHideStatus').addEvent('click', function(e) {
		myMessage.hideStatus();
	});
});
