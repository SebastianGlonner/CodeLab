/**
 * Gx Components Library
 *
 * @authors Peter-Christoph Haider, Hoang Nguyen, Sebastian Glonner, Franz Berwein
 * @copyright Copyright 2011-2013 Zeyon (www.zeyon.net)
 * @version 2.00 (2012-05-16)
 * @package Gx
 */

var gx = {
	Browser: {
		scrollBar: {
			width: undefined
		}
	}
};

// Calculate Browser scroll bar width
window.addEvent('domready', function() {
	var div = new Element('div', {
		'style': 'width: 50px; position:absolute; left: -200px; top: -200px;'
	});
	div.inject(document.body, 'top');
	var d = new Element('div', {
		'html': '&nbsp;'
	});
	div.adopt(d);

    var w1 = d.getStyle('width').toInt();
    div.setStyle('overflow-y', 'scroll');
    gx.Browser.scrollBar.width = (w1 - d.getStyle('width').toInt());
    div.dispose();
});
