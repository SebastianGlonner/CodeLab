window.addEvent('domready',function(){

	var form = new gx.form.Form({
		'submit': false,
		'reset': false,
	});
	form.createFields([{
		type: 'Text',
		att: {
			name: 'title',
			value: '',
			id: 'title'
		},
		name: 'title',
		label: 'Titel',
		options: { mandatory: true }
	},{
		type: 'ID',
		att: {
			name: 'id',
			value: '',
			id: 'id'
		},
		name: 'id',
		label: 'Id',
		options: { mandatory: true }
	},{
		type: 'Number',
		att: {
			name: 'number',
			value: '',
			id: 'number'
		},
		name: 'number',
		label: 'Nummer',
		options: { mandatory: true }
	},{
		type: 'Date',
		att: {
			name: 'date',
			id: 'date'
		},
		name: 'date',
		label: 'Datum'
	},{
		type: 'Textarea',
		att: {
			name: 'description',
			value: '',
			id: 'description'
		},
		name: 'description',
		label: 'Beschreibung'
	}]);

	var select = form.createField(
		'AdvSelect',
		{
			name: 'select',
			value: '',
			id: 'select'
		},
		'Select',
		{ mandatory: true }
	);

	var options = [
		/*
		{'name': 'option', 'value': 'option1', 'selected': true},
		{'name': 'einandereswort', 'value': 'option2', 'selected': true},
		{'name': 'fernsehen', 'value': 'option3', 'selected': true },
		{'name': 'irgendwas', 'value': 'option4', 'selected': true},
		{'name': 'computer', 'value': 'option5', 'selected': true},
		*/
		{'name': 'aquarium', 'value': 'option6'},
		{'name': 'mäusekäfig', 'value': 'option7'},
		{'name': 'wasserbett', 'value': 'option8'},
		{'name': 'wandschrank', 'value': 'option8'},
		{'name': 'kleiderschrank', 'value': 'option8'},
		{'name': '1234567', 'value': 'option8'},
	];
	select.createOptions(options);

	form.getBuilder().options.fieldNames = {
		id: 'id',
		description: 'description'
	}

	$('myForm').adopt(form.build());

});
