/**
 * @class gx.bootstrap.Form
 * @description Creates a fieldset
 * @extends gx.ui.Container
 *
 * @param {element|string} display The display element
 *
 * @option {string} title The title for the primary fieldset
 * @option {object} fields The list of fields
 * @option {object} actions All action items & buttons
 */
gx.bootstrap.Form = new Class({
	gx: 'gx.bootstrap.Form',
	Extends: gx.ui.Container,
	options: {
		'size': 'regular',
		'label': '',
		'value': false
	},
	_fieldsets: [],
	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display == null ? new Element('form', {'class': 'form-horizontal'}) : display, options);

			if (typeOf(this.options.fields) == 'object')
				this.addFieldset(new gx.bootstrap.Fieldset(null, {'fields': this.options.fields, 'title': this.options.title}));

			if (this.options.actions != null)
				this.addActions(this.options.actions);

		} catch(e) { gx.util.Console('gx.bootstrap.Form->initialize', e.message); }
	},
	/**
	 * @method Add the action bar
	 * @param content
	 * @return {void}
	 */
	addActions: function(content) {
		if (this._ui.actions == null) {
			this._ui.actions = new Element('div', {'class': 'form-actions'});
			this._ui.root.adopt(this._ui.actions);
		}

		switch (typeOf(content)) {
			case 'array':
				content.each(function(c) {
					this._ui.actions.adopt(__(c));
				}.bind(this));
				break;
			case 'element':
				this._ui.actions.adopt(content);
				break;
			default:
				this._ui.actions.adopt(__(content));
				break;
		}
	},
	/**
	 * @method addFieldset
	 * @param {gx.bootstrap.Fieldset} fieldset
	 * @return gx.bootstrap.Fieldset
	 */
	addFieldset: function(fieldset) {
		if (typeOf(fieldset) == 'object') {
			if (!instanceOf(fieldset, gx.bootstrap.Fieldset))
				fieldset = new gx.bootstrap.Fieldset(null, Object.clone(fieldset));
		}

		this._fieldsets.push(fieldset);

		if (this._ui.actions == null)
			this._ui.root.adopt($(fieldset));
		else
			$(fieldset).inject(this._ui.actions, 'before');

		return fieldset;
	},
	/**
	 * @method getValue
	 * @description Get the value from the fieldsets
	 * @param field
	 * @returns
	 */
	getValue: function(field) {
		var value;
		for (var i = 0, l = this._fieldsets.length; i < l; i++) {
			value = this._fieldsets[i].getValue(field);
			if (value != null)
				return value;
		}

		return null;
	},
	/**
	 * @method getValues
	 * @returns {object}
	 */
	getValues: function() {
		var values = {};
		this._fieldsets.each(function(fs) {
			values = Object.merge(values, fs.getValues());
		});

		return values;
	},
	/**
	 * @method getField
	 * @description Gets a single field object
	 * @param fieldid
	 * @returns {object} The field object {field, frame, controls, type}
	 */
	getField: function(fieldid) {
		var field;
		this._fieldsets.each(function(fs) {
			if (field)
				return;
			field = fs.getField(fieldid);
		});
		return field;
	},
	/**
	 * @method setValue
	 * @description Sets a single form value
	 * @param {string} fieldid
	 * @param {mixed} value
	 */
	setValue: function(fieldid, value) {
		this._fieldsets.each(function(fs) {
			if (fs.getField(fieldid) != null)
				fs.setValue(fieldid, value);
		});
	},
	/**
	 * @method setValues
	 * @description Sets multiple form values
	 * @param {object} values
	 */
	setValues: function(values) {
		this._fieldsets.each(function(fs) {
			fs.setValues(values);
		});
	},
	/**
	 * @method setHighlights
	 * @description Sets the highlights for all fields
	 * @param {object} highlights The highlight properties {fieldid: message|object|false, ...}
	 * @param {string} type The default highlight type
	 * @return {int} Number of active highlights
	 */
	setHighlights: function(highlights, type) {
		var count = 0;

		this._fieldsets.each(function(fs) {
			count += fs.setHighlights(highlights, type);
		});

		return count;
	},
	/**
	 * @method reset
	 * @description Reset all form fields
	 */
	reset: function() {
		this._fieldsets.each(function(fs) {
			fs.reset();
			fs.setHighlights();
		});
	}
});
