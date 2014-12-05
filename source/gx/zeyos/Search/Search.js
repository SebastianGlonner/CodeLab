/**
 * @class gx.zeyos.Search
 * @description Creates a search box
 * @extends gx.ui.Container
 *
 */
gx.zeyos.Search = new Class({

	Extends: gx.ui.Container,

	Implements: [ Events ],

	initialize: function () {
		var root = this;

		var container = new Element('div', { 'class': 'att' });
		this.parent(container);

		this._ui.searchBox = new Element('input', {
			'placeholder': 'Search',
			'x-webkit-speech': '',
			'value': ''
		})
			.addEvents({
				'input': function (event) {
					root.fireEvent('input', [ root, this, event ]);
				},
				'keypress': function (event) {
					root.fireEvent('keypress', [ root, this, event ]);
				}
			});

		this._ui.button = gx.zeyos.Factory.Button('', '', 'search')
			.addEvent('click', function (event) {
				root.fireEvent('click', [ root, this, event ]);
			});

		container.adopt(
			this._ui.searchBox,
			this._ui.button
		);
	},

	get: function () {
		return this._ui.searchBox.value;
	}

});
