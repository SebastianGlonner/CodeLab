window.addEvent('domready', function() {
	var myTableData = [
		{'customername': 'HyperFlyer', 'customernum': '1003', 'lastmodified': '1220454105'},
		{'customername': 'InScreen Design', 'customernum': '1004', 'lastmodified': '1220454283'},
		{'customername': 'GlobalSpin Travel Agency', 'customernum': '1005', 'lastmodified': '1220454466'},
		{'customername': 'nTronic AG', 'customernum': '1001', 'lastmodified': '1220453517'},
		{'customername': 'CleanTexx', 'customernum': '1002', 'lastmodified': '1220454105'},
	];
	var myTable = new gx.bootstrap.Table('myTable', {
		'cols': [
			{'label': 'Name', 'id': 'customername'},
			{'label': 'Number', 'id': 'customernum'},
			{'label': 'Last change', 'id': 'lastmodified'}
		],
		'structure': function(row) {
			return [
				row.customername,
				row.customernum,
				new Date(row.lastmodified * 1000).format('%d.%m.%Y %H:%M')
			];
		},
		'data': myTableData,
		'onClick': function(row) {
			alert(JSON.encode(row));
		},
		'onFilter': function(col) {
			alert(JSON.encode(col));
		}
	});
	myTable._display.tableDiv.setStyle('max-height', '300px');

	$('btnTableEmpty').addEvent('click', function() {
		myTable.empty();
	});
	$('btnTableSet').addEvent('click', function() {
		myTable.setData(myTableData);
	});
	$('btnAddData').addEvent('click', function() {
		var temp = myTableData.append(myTableData);
		temp.push({'customername': 'Another One', 'customernum': '1003943295792836012345719837632809467', 'lastmodified': '1220454105'});
		myTable.setData(myTableData);
	});
});
