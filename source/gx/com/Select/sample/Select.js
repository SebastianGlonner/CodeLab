window.addEvent('domready',function(){
	var options = [
		{'name': 'option1', 'value': 'option1', 'selected': true},
		{'name': 'einandereswort', 'value': 'einandereswort', 'selected': true},
		{'name': 'fernsehen', 'value': 'fernsehen', 'selected': true },
		{'name': 'irgendwas', 'value': 'irgendwas', 'selected': true},
		{'name': 'computer', 'value': 'computer', 'selected': true},
		{'name': 'aquarium', 'value': 'aquarium'},
		{'name': 'mäusekäfig', 'value': 'mäusekäfig'},
		{'name': 'wasserbett', 'value': 'wasserbett'},
		{'name': 'wandschrank', 'value': 'wandschrank'},
		{'name': 'kleiderschrank', 'value': 'kleiderschrank'},
		{'name': '1234567', 'value': '1234567'},
	];


	var select2 = new gx.com.Select('select2', 'select2', options);
	var select3 = new gx.com.Select('select3', 'select3', options.slice(), {autoTextarea: true});
	var select4 = new gx.com.Select('select4', 'select4', options.slice(), {touchpad: true});
});
