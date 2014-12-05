$(document).addEvent('domready', function () {
	var myTabbox = new gx.zeyos.Tabbox('conTabs', {
		'height': 150,
		'frames': [
			{'name': 'tab1', 'title': 'First Tab', 'content': $('conTab1')},
			{'name': 'tab2', 'title': 'Second Tab', 'content': $('conTab2')},
			{'name': 'tab3', 'title': 'Third Tab', 'content': $('conTab3')}
		]
	});
});
