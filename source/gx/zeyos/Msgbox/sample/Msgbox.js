$(document).addEvent('domready', function () {
	var myMsgbox = new gx.zeyos.Msgbox();
	$('btnMsgbox').addEvent('click', function() {
		myMsgbox.show($('txtMsgbox').value, $('selMsgbox').value);
	});
});
