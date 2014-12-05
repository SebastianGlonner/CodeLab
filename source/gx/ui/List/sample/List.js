window.addEvent('domready',function(){

	var form = new gx.form.FormListFilter({
		'submit': false,
		'reset': false
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

	//var filterList =

	var myData = [
		{item: {'id': 1, 'title': 'HyperFlyer', 'number': '1003', 'date': '1220454105', 'description': ''}},
		{item: {'id': 2, 'title': 'InScreen Design', 'number': '1004', 'date': '1220454283', 'description': ''}},
		{item: {'id': 3, 'title': 'GlobalSpin Travel Agency', 'number': '1005', 'date': '1220454466', 'description': 'test'}},
		{item: {'id': 4, 'title': 'nTronic AG', 'number': '1001', 'date': '1220453517', 'description': ''}},
		{item: {'id': 5, 'title': 'CleanTexx', 'number': '1002', 'date': '1220454105', 'description': ''}},
	];

	var gxList = new gx.ui.List($('gxList'), {
		createItem: function (item) {
			var item = item.item;
			return __({
				'tag': 'table',
				'cellpadding': 0,
				'cellspacing': 0,
				'class': 'table',
				'children': [
					{'tag': 'tr', 'children': [
						{'tag': 'td', 'rowspan': 3, 'class': 'listCell', 'html': '#'+item.id},
						{'tag': 'td', 'colspan': 2, 'class': 'listCell', 'html': item.title},
					]},
					{'tag': 'tr', 'children': [
						{'tag': 'td', 'class': 'listCell', 'html': item.number},
						{'tag': 'td', 'class': 'listCell', 'html': new Date(parseInt(item.date)*1000).format('%d.%m.%Y %H:%M')},
					]},
				]
			});
		},
		createHead: function (item) {
			return 'Ein beliebiger Kopf';
		}
	});
	gxList.addAll(myData);


});
