window.addEvent('domready', function () {
	var myDropdown = new gx.zeyos.Dropdown('conDropdown', {
		'label': 'Sample menu',
		'items': {
			'test1': 'Test 1',
			'test2': 'Test 2',
			'test3': 'Test 3',
			'test4': 'Test 4',
			'test5': 'Test 5',
			'test6': 'Test 6'
		}
	});
});
