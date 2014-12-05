/**
 * @method MasterData
 * @description Create master data panel
 *
 * @extends gx.ui.Container
 *
 * @param {html element} display Html element to adopt the master data panel.
 * @param {string|html element} title Title of the panel.
 * @param {string|html element} content Content of the panel.
 * @param {array} buttons Array of html elements.
 */
gx.zeyos.MasterPanel = new Class({
	gx: 'gx.zeyos.MasterPanel',
	Extends: gx.ui.Container,

	initialize: function(display, title, content, buttons) {
		this._title = new Element('h2');
		this._content = new Element('div', {
			'class': 'bg-W b_l-25 b_r-25 of-h'
		});
		this._buttons = new Element('div', {
			'class': ' fb mi_b-7 p_t-7'
		});

		this.parent(display);

		this.toElement().adopt([
			// head
			new Element('div', {
				'class': 'fix_t'
			}).adopt(
				new Element('section', {
					'class': 'm_l-10 m_r-10'
				}).adopt([

					this._title,
					new Element('div', {
						'class': 'bg-E p_l-7 p_r-7 p_t-7'
					}).adopt(
						new Element('div', {
							'class': 'bg-W b_b-25'
						})
					)

				])
			),

			// content
			new Element('div', {
			'class': 'bg-E m_l-10 m_r-10 p_l-7 p_r-7'
			}).adopt(
				this._content
			),

			//footer
			new Element('div', {
			'class': 'fix_b'
			}).adopt(
				new Element('div', {
					'class': 'm_l-10 m_r-10'
				}).adopt(
					new Element('div', {
						'class': 'bg-E br_b-5 bsd-3',
					}).adopt([

						new Element('div', {
							'class': 'bg-W b_t-25 m_l-7 m_r-7'
						}),
						this._buttons
					])
				)
			),
		]);

		if ( title != null )
			this.setTitle(title);

		if ( content != null )
			this.setContent(content);

		if ( buttons != null )
			this.setButtons(buttons);
	},

	setTitle: function(title) {
		if ( isString(title) ) {
			this._title.set('html', title);
		} else {
			this._title.empty();
			this._title.adopt(title);
		}
	},

	setContent: function(content) {
		if ( isString(content) ) {
			this._content.set('html', content);
		} else {
			this._content.empty();
			this._content.adopt(content);
		}
	},

	setButtons: function(buttons) {
		this._buttons.empty();
		this._buttons.adopt(buttons);
	}
});
