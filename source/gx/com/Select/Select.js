/**
 * @class gx.com.Select
 * @description Advanced input select element
 * @extends gx.ui.Container
 * @implements gx.ui.List
 *
 * @param {string|node} display The input element.
 * @param {json object} options
 *
 * @option {string} cssClassPrefix Prefix for all css class names in use.
 * @option {string} separator String which separators selected values while using multiple select.
 * @option {boolean} searchMode Activate search mode.
 * @option {boolean} touchpad Activate touchpad usability mode.
 * @option {boolean} multiple Allow multiple selections.
 * @option {boolean} autoTextarea Use textarea instead of input field. This textarea will automatically scale with selected values.
 * @option {boolean} fixedList Dont move the selection list while the textarea expand.
 * @option {integer} size The size of the selection list.
 * @option {integer} hideDelay (Milliseconds) The delay before hide selection list.
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package com
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 *
 * @sample Select A advanced select example.
 */
gx.com.Select = new Class({
	Extends: gx.ui.Container,

	options: {
		cssClassPrefix: 'gxComSelect',
		separator: ', ',
		createOption: function (option) {
			option.li.addEvent('click', this.select.bind(this));
			if ( option.item.selected )
				option.li.addClass(this.options.cssClassPrefix + 'Selected');

			return option.item.name;
		},
		searchMode: true,
		touchpad: false,
		multiple: true,
		autoTextarea: false,
		fixedList: true,
		size: false,
		hideDelay: 500
	},

	_options: [
		{
			item: {'name': 'a_name1', 'value': 'a_value1'},
			item: {'name': 'a_name2', 'value': 'a_value2', 'selected': true}
		}
	],
	_timer: null,
	_ffBug: true,

	initialize: function(display, attributes, optionTags, options) {
		try {
		this.parent(display, options);

		var input, list;
		var shadow = false;

		if ( !this.options.autoTextarea ) {
			input = new Element('input', {
				'class': this.options.cssClassPrefix + 'InputText',
			});
		} else {
			input = new Element('textarea', {
				'class': this.options.cssClassPrefix + 'InputArea',
				'rows': 1,
				'style': 'overflow-y:visible;',
			});
			input.addEvent('update', this.sizeArea.bind(this));
			// This container is not meant to be seen
			shadow = new Element('div', {
				'class': this.options.cssClassPrefix + 'InputArea',
				'style': 'position:absolute; left:-9000px; top:-900px',
				'html': 'T'
			});
		}
		input.set(attributes);
		this._ui.input = input;
		this._ui.shadow = shadow;

		if ( !this.options.searchMode )
			input.set('readonly', 'readonly');
		else {
			// Implement searching through options
			this._ui.input.addEvent('keyup', function (e) {
				var text = this._ui.input.value;
				if ( text != '' ) {
					this._list.applyFilter([{
						'name': 'name',
						'condition': 'like',
						'expression': '.*'+text+'.*',
						'flags': 'i'
					}]);
				} else {
					this._list.removeFilter();
				}
			}.bind(this));

			this._ui.searchImg = new Element('div', {
				'class': this.options.cssClassPrefix + 'SearchImg'
			}).addEvent('click', function (event) {
				var input = this._ui.input;
				input.value = '';
				input.focus()
				input.fireEvent('click', [ event ]);
			}.bind(this));
			//this._ui.searchImg.set('src', this._ui.searchImg.getStyle('background-image'));
		}

		if ( this.options.id != undefined )
			input.id = this.options.id;

		this._list = new gx.ui.List(
			new Element('div', {
				'style': 'display: none; position:absolute; opacity:0;'
			}),
			{
				'cssClassPrefix': this.options.cssClassPrefix,
				'createItem': this.options.createOption.bind(this)
			}
		);

		list = this._list.getDisplay();
		this._ui.list = list;
		if ( Browser.safari ) {
			list.setStyles({
				'margin-top': '-2px',
				'margin-left': '2px',
			});
		}
		this._options = this._list._items;

		this._ui.root.adopt(input);
		if ( this.options.searchMode ) {
			this._ui.root.adopt(this._ui.searchImg);
		}
		if ( shadow )
			document.getElement('body').adopt(shadow);
		this._ui.root.adopt(list);

		input.addEvent('click', this.show.bind(this) );
		input.addEvent('blur', this.removeFilter.bind(this) );

		if ( optionTags != undefined )
			this.createOptions(optionTags);

		if ( this.options.touchpad ) {
			var accept = new Element('div', {'class': this.options.cssClassPrefix + 'Accept'})
			accept.setStyle('top', -(Math.floor(input.getStyle('height').toInt() / 2 ) + 8 + input.getStyle('border-bottom-width').toInt()));
			accept.addEvent('click', this.close.bind(this));
			list.adopt(accept);
		} else {
			this._ui.root.addEvent('mouseleave', this.addTimer.bind(this) );
			this._ui.root.addEvent('mouseenter', this.removeTimer.bind(this) );
		}
		} catch (e) {
	alert(e)
}
	},

	/**
	 * @method getInput
	 * @description Return the input html element.
	 */
	getInput: function () {
		return this._ui.input;
	},

	/**
	 * @method createOptions
	 * @description Create the selection list.
	 * @param {json array} options  Options: [{item: {'name': 'a_name2', 'value': 'a_value2', 'selected': true}}]
	 */
	createOptions: function ( options ) {
		var items = new Array();
		for ( var i in options ) {
			if ( !options.hasOwnProperty(i) )
				continue;

			if ( options[i].selected == undefined )
				options[i].selected = false;
			items.push({
				item: options[i]
			});
		}
		this._list.addAll(items);

		if ( this.options.size ) {
			this._ui.list.getElement('ul').setStyles({
				'overflow-y': 'scroll',
				'height': this._options[0].li.getStyle('height').toInt() * this.options.size
			});
		}
		this.updateInput();
	},

	/**
	 * @method show
	 * @description Show the selection list
	 */
	show: function () {
		this._ui.list.get('tween').removeEvent('complete', this.hide);
		this._ui.list
			.set('tween', {
				duration: 'short'
			})
			.show()
			.fade(1);
	},

	/**
	 * @method close
	 * @description Hide selection list. Remove search filter. Update content.
	 */
	close: function () {
		this._ui.list
			.set('tween', {
				duration: 'normal',
				onComplete: this.hide
			})
			.fade(0);
		this.removeFilter();
	},

	hide: function (ele) {
		ele.hide();
	},

	/**
	 * @method removeFilter
	 * @description Remove search filter. Update content.
	 */
	removeFilter: function () {
		if ( this._list.filterActive )
			this._list.removeFilter();
		this.updateInput();
	},

	/**
	 * @method select
	 * @description (Event) called while click on option.
	 */
	select: function (e) {
		e.stop();
		var li = e.target;
		var selected = li.retrieve('item');
		if ( !this.options.multiple ) {
			for ( var i in this._options ) {
				if ( !this._options.hasOwnProperty(i) )
					continue;

				var option = this._options[i];
				if ( selected.name != option.item.name ) {
					option.item.selected = false;
					option.li.removeClass(this.options.cssClassPrefix + 'Selected');
				} else {
					option.item.selected = true;
					option.li.addClass(this.options.cssClassPrefix + 'Selected');
				}
			}
			this.close();
		} else {
			if ( selected.selected ) {
				selected.selected = false;
				li.removeClass(this.options.cssClassPrefix + 'Selected');
			} else {
				selected.selected = true;
				li.addClass(this.options.cssClassPrefix + 'Selected');
			}
		}
		this.removeFilter();
	},

	/**
	 * @method updateInput
	 * @description Update input element with selected values. Fire event 'update'
	 */
	updateInput: function () {
		var names = this.getSelectedNames();
		this._ui.input.value = names.join(this.options.separator);
		this._ui.input.fireEvent('update');
	},

	/**
	 * @method getSelectedValues
	 * @description Get array with values of all selected options.
	 */
	getSelectedValues: function () {
		var values = new Array();
		for ( var i in this._options ) {
			if ( !this._options.hasOwnProperty(i) )
				continue;

			var option = this._options[i];
			if ( option.item.selected )
				values.push(option.item.value);
		}
		return values;
	},

	/**
	 * @method getSelectedNames
	 * @description Get array with names of all selected options.
	 */
	getSelectedNames: function () {
		var names = new Array();
		for ( var i in this._options ) {
			if ( !this._options.hasOwnProperty(i) )
				continue;

			var option = this._options[i];
			if ( option.item.selected )
				names.push(option.item.name);
		}
		return names;
	},

	addTimer: function() {
		this._timer = this.close.bind(this).delay(this.options.hideDelay);
	},

	removeTimer: function() {
		clearTimeout(this._timer);
	},

	/**
	 * @method sizeArea
	 * @description Resize height of textarea. Called at event update.
	 */
	sizeArea: function () {
		var input = this._ui.input;
		var shadow = this._ui.shadow
		shadow.show();


		//this._ui.shadow.hide();

		// firefox bug fix set explicity height
		var styles = input.getStyles(
			'height',
			'padding-top',
			'padding-bottom'
		);
		var heightAdds = parseInt(styles['padding-top']) + parseInt(styles['padding-bottom']);
		var innerHeight = parseInt(styles.height) - heightAdds;


		var rows = input.rows;
		if ( Browser.firefox && this._ffBug ) {
			rows = 2;
			this._ffBug = false;
		} else if ( Browser.firefox ) {
			rows--;
		}
		var rowHeight = innerHeight / rows;

		var rowHeight = shadow.getStyle('height').toInt() + 1;

		var area = input.getStyle('width').toInt();
		rows = 1;
		var values = this.getSelectedNames();
		var i = 0, j = 0;
		var length, textLength;
		while( values[j] != undefined ) {
			length = '';
			for( i = 0; i <= j; i++ ) {
				length += this.options.separator + values[i];
			}
			shadow.set('html', length.substr(this.options.separator.length) );
			textLength = shadow.getStyle('width').toInt() + 10;
			if ( textLength > area ) {
				rows++;
				values.splice(0, j);
				j = 0;
			}
			j++;
		}
		input.setStyle('height', (rows * rowHeight) + heightAdds);
		if ( this.options.autoTextarea && this.options.fixedList )
			this._ui.list.setStyle('margin-top', -(--rows * rowHeight) - input.getStyle('padding-bottom').toInt());
		if ( Browser.firefox )
			input.set('rows', rows + 1);
		else
			input.set('rows', rows);

	}

});
