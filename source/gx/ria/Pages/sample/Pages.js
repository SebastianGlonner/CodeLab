var pages;
$(document).addEvent('domready', function () {
	pages = new gx.ria.Pages('pages');
	//pages = new gx.ria.Pages(document.body);
	var page1 = pages.addPage('page1', {
		loadContent: function () {
			return 'ich bin die erste seite<br><span style="color:red;" onclick="pages.show(\'page2\')">page2</span><br><span style="color:blue;" onclick="pages.show(\'page3\')">page3</span>';
		},
		classes: 'page_class'
	});
	pages.show('page1'); // first show => get base page

	pages.addPage('page2', {
		loadContent: function () {
			return $('page2');
		},
		parentPage: 'page1',
		classes: 'page_class'
	});
	pages.addPage('page3', {
		loadContent: function () {
			return 'ich bin die page 3';
		},
		parentPage: page1,
		classes: 'page_class'
	});
});
