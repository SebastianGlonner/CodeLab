$(document).addEvent('domready', function () {
	var myChecklist = new gx.zeyos.Checklist('divChecklist', {
		'data': [
			{'ID': 0, 'label': 'Test1'},
			{'ID': 1, 'label': 'Test2'},
			{'ID': 2, 'label': 'Test3'}
		]
	});
	$('btnChecklist').addEvent('click', function() {
		alert(JSON.encode(myChecklist.getValues()));
	});
});
