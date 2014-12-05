/**
 * @class gx.com.InPlaceEditor
 * @description Adds edit-in-place functionality to DOM elements.
 *
 * @event focus(String text, Element target, gx.com.InPlaceEditor editor, Event event)
 * @event blur(String text, Element target, gx.com.InPlaceEditor editor, Event event)
 * @event change(String text, Element target, gx.com.InPlaceEditor editor, Event event)
 *
 * @option {string} cssClass
 * @option {string} attributeName
 */
gx.com.InPlaceEditor = new Class({

	gx: 'gx.com.InPlaceEditor',

	Implements: [ Events, Options ],

	options: {
		'cssClass'     : 'inplace-editing',
		'attributeName': 'data-inplace',
		'plainText'    : true
	},

	handlers: {},

	initialize: function (options) {
		this.setOptions(options);

		var me   = this;

		this.handlers = {
			'blur': function (event) {
				event.stop();

				this
					.removeClass(me.options.cssClass)
					.erase('contenteditable');

				var text = this.get('text');
				var eventData = [ text, this, me, event ];

				me.fireEvent('blur', eventData);

				var html = this.get('html');
				if ( this.getProperty(me.options.attributeName) === html )
					return;

				if ( me.options.plainText )
					this.set('text', text);

				me.fireEvent('change', eventData);
			},

			'click': function (event) {
				event.stop();
				me.focus.apply(me, [ this ]);
			},

			'keyPress': function (event) {
				switch ( event.key ) {
					case 'enter':
						event.stop();
						this.blur();
						break;

					case 'esc':
						event.stop();
						this
							.set('html', this.getProperty(me.options.attributeName))
							.blur();
						break;
				}

			}
		};
	},

	updateHandlers: function (method, target, live) {
		var $target;
		var handlers;

		if ( live ) {
			$target = $(
				( (typeof(live) === 'string') || (live instanceof Element) )
				? live
				: document.body
			);
			handlers = {};
			handlers['click:relay('+target+')']    = this.handlers.click;
			handlers['blur:relay('+target+')']     = this.handlers.blur;
			handlers['keypress:relay('+target+')'] = this.handlers.keyPress;
		} else {
			$target = $$(target);
			handlers = {
				'click'   : this.handlers.click,
				'blur'    : this.handlers.blur,
				'keypress': this.handlers.keyPress
			};
		}

		$target[method](handlers);

		return this;
	},

	/**
	 * Attaches all event handlers to the specified targets.
	 *
	 * @param {String} target
	 * @param {Boolean|String|Element} live Optional. Set to true to attach
	 *     delegated event handlers. When supplying a string or an element, it
	 *     will be used as the anchor for delegation. Default is false.
	 * @type gx.com.InPlaceEditor
	 */
	attach: function (target, live) {
		return this.updateHandlers('addEvents', target, live);
	},

	/**
	 * Detaches all event handlers from the specified targets.
	 *
	 * @param {String} target
	 * @param {Boolean|String|Element} live Optional. Set to true to detach
	 *     delegated event handlers. When supplying a string or an element, it
	 *     will be used as the anchor for delegation. Default is false.
	 * @type gx.com.InPlaceEditor
	 */
	detach: function (target, live) {
		return this.updateHandlers('removeEvents', target, live);
	},

	focus: function (element, event) {
		this.fireEvent('focus', [ element.get('text'), element, this, event ]);
		element
			.addClass(this.options.cssClass)
			.setProperty('contenteditable', 'true')
			.setProperty(this.options.attributeName, element.get('html'))
			.focus();

		return this;
	}

});
