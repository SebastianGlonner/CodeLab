window.addEvent('domready',function(){
	var myBar = new gx.com.Statusbar('myField', {
		'message': 'Hello! I am a statusbar!',
		'progress': 1
	});

	$('btnReset').addEvent('click', function(e) {
		myBar.setProgress(0.1, 'I am a status bar at 10 percent.', 0);
	});
	$('incProgress').addEvent('click', function(e) {
		myBar.incProgress(0.2, 'Loading some more');
	});
});
