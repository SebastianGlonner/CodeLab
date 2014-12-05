/**
 * @extends gx.core
 */
gx.zeyos = {};

// Calculate Browser scroll bar width
window.addEvent('domready', function() {
	var html = $$('html');
	var lang = html.get('lang');

	if ( lang == null || lang == '') {
		html.set('lang', 'ltr-en')
	}
});
