/**
 * @class gx.zeyos.Dropdown
 * @description Create ZeyOS drop down menu.
 * @extends gx.core.Settings
 * @implements gx.zeyos.Factory
 * @implements gx.ui.Blend
 *
 * @param {html element} display Html element to adopt the panel.
 * @param {object} Options
 * @option {string} label The name of the field.
 * @option {object} items Html element to adopt the panel.
 * @option {boolean} resettable Add item to reset dropdown -> Set no value.
 * @option {string} resetprefix Prefix string for the reset item name = resetprefix + name.
 * @option {boolean} compact Create more compact dropdown. Hide label and tick img.
 *
 * @sample Dropdown Simple Dropdown example.
 */
(function() {
	var drpRegistry = [];
	window.addEvent('click', function(event) {
		for ( var i in drpRegistry ) {
			if ( !drpRegistry.hasOwnProperty(i) )
				continue;
			var drp = drpRegistry[i],
				close = true;
			var check = event.target;
			for ( var e = 0; e < 4; e++ ) {
				if ( check == undefined )
					break;

				if ( check == drp._display.frame ) {
					close = false;
					break;
				}
				check = check.getParent();
			}
			if ( close )
				drp.close();
		}
	});

	gx.zeyos.Dropdown = new Class({
		gx: 'gx.zeyos.Dropdown',

		Extends: gx.ui.Container,

		options: {
			width: null,
			resettable: false,
			emptyCaption: null,
			label: false,
			compact: false,
			upside: false
		},

		_selected: null,
		_items: {},
		_resetItem: null,

		initialize: function(display, options) {
			this.parent(display, options);

			var root = this;

			this._display.frame = new Element('div', {
				'class': 'drp'
			});
			this._display.button = new Element('button', {'type': 'button', 'html': this.options.label ? this.options.label : ''}).addEvent('click', function(event) {
				event.preventDefault();
				root.toggle();
			});

			if ( options.compact )
				this._display.frame.addClass('compact');

			this._display.section = new Element('section');
			this._display.root.adopt([
				this._display.frame.adopt([
					this._display.button,
					this._display.section
				])
			]);

			if ( this.options.items != undefined ) {
				this.setItems(this.options.items);
				if ( this._resetItem )
					this._resetItem.addClass('act');
			}

			if ( this.options.width != null ) {
				this._display.button.setStyles({
					'width': this.options.width,
					'overflow': 'hidden',
					'text-overflow': 'ellipsis'
				});
			}

			drpRegistry.push(this);
		},

		setItems: function(items) {
			this._items = {};
			var root = this;
			this._display.section.empty();

			if ( this.options.resettable ) {
				this._resetItem = new Element('fieldset', {
					'class': 'drp_item',
					'html': '<span style="font-style:italic;">' + (
						this.options.emptyCaption
						? this.options.emptyCaption
						: 'Empty'
					) + '</span>',
					'data-value': ''
				});
				this._resetItem.addEvent('click', function(event) {
					root.reset();
					event.stop();
				});
				this._display.section.adopt(this._resetItem);
			}

			var addLink = function(link, value, text) {
				link.addEvent('click', function(event){
					root.selectItem(value, text);
					event.stop();
				});
			}

			var text, html, clickfunc;
			for ( var value in items ) {
				if ( !items.hasOwnProperty(value) )
					continue;

				if (typeof items[value] == 'object') {
					text      = items[value].text;
					html      = items[value].html;
					clickfunc = items[value].onClick == null ? false : items[value].onClick
				} else {
					text      = items[value];
					html      = items[value];
					clickfunc = false;
				}

				var element = __({
					'tag'        : 'fieldset',
					'class'      : 'drp_item',
					'child'      : html,
					'data-value' : value
				});

				this._items[value] = element;

				if (!clickfunc)
					addLink(element, value, text);
				else
					element.addEvent('click', clickfunc);

				this._display.section.adopt(element);
			}

			return this;
		},

		selectItem: function(value, text) {
			if ( this._selected )
				this._selected.removeClass('act');
			if ( this._resetItem )
				this._resetItem.removeClass('act');

			this._display.frame.set('data-value', value);
			this._display.button.empty();
			if ( !this.options.compact && this.options.label)
				this._display.button.adopt(new Element('b', {'html': this.options.label + ': '}));

			// this._display.button.adopt(document.createTextNode(text));
			this._display.button.set('html', this._display.button.get('html') + text);
			this._display.button.set('title', text);

			this._selected = this._items[value];
			if ( this._selected )
				this._selected.addClass('act');

			if ( !this.options.compact )
				this._display.button.set('data-ico-b', gx.zeyos.Factory.Icon('checked'));

			this.close();

			this.fireEvent('change', [ value, text, this ]);

			return this;
		},

		reset: function() {
			if ( this._selected ) {
				this._selected.removeClass('act');
				this._selected = null;
			}
			if ( this._resetItem )
				this._resetItem.addClass('act');

			this._display.button.empty();
			this._display.button.set('html', this.options.label);
			this._display.button.erase('data-ico-b');
			this._display.button.erase('title');
			this.close();

			this.fireEvent('change', [ null, this.options.emptyCaption, this ]);

			return this;
		},

		getSelected: function() {
			return {
				'value': this._selected.get('data-value'),
				'label': this._selected.get('text')
			}
		},

		getValue: function() {
			if ( !this._selected )
				return '';

			return this._selected.get('data-value');
		},

		show: function() {
			this._display.frame.addClass('act');
			if (this.options.upside) {
				this._display.section.setStyle('top', (this._display.section.getSize().y + 1) * -1);
			}
			return this;
		},

		close: function(){
			this._display.frame.removeClass('act');
			return this;
		},

		toggle: function() {
			if ( this._display.frame.hasClass('act') )
				return this.close();
			else
				return this.show();
		}
	});
})();
