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
 * @option {array} horizontal Define this fields horizontal, false | bootstrap grid classes for label and input: ['col-md-2', 'col-md-6']
 * @option {boolean} columns Display the fields 2 columned
 * @option {bool} highlighteffect Use effect for highlighting
 * @option {array} shakeOnInvalidation Use these array of elements to shake if form validation fails.
 * @option {array} moohints Define which method should be used to set field errors after mootoosl form validator validation.
 */

Form.Validator.add('validate-regexp', {
	test: function(field, props) {
		return field.get('value').match(new RegExp(props.regex, props.flags)) !== null;
	}
});

Form.Validator.add('minRange', {
	test: function(field, props) {
		return parseFloat(field.get('value')) >= props.minRange;
	}
});

Form.Validator.add('maxRange', {
	test: function(field, props) {
		return parseFloat(field.get('value')) <= props.maxRange;
	}
});

Form.Validator.add('dateFrom', {
	test: function(field, props) {
		var value = Date.parse(field.get('value'));
		if ( value instanceof Date )
			return value.getTime() > props.dateFrom;

		return false;
	}
});

Form.Validator.add('dateTo', {
	test: function(field, props) {
		var value = Date.parse(field.get('value'));
		if ( value instanceof Date )
			return value.getTime() < props.dateTo;

		return false;
	}
});

gx.bootstrap.Form = new Class({
	gx: 'gx.bootstrap.Form',
	Extends: gx.ui.Container,
	options: {
		'size': 'regular',
		'label': '',
		'value': false,
		'horizontal' : ['col-md-3', 'col-md-9'],
		'columns' : false,
		'hintpos' : 'right',
		'hintobject'      : 'auto', // | 'label' | 'control'
		'highlighteffect' : true,
		'highlightlocation': 'control', // | 'field'
		'shakeOnInvalidation': [],
		'moohints': 'setHintHighlights',
	},

	_hasPasswords: false,
	_pwField: null,
	_confirmField: null,

	_mooFormValidator: null,
	_fieldsets: [],
	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display == null ? new Element('form') : display, options);

			if (typeOf(this.options.fields) == 'object') {
				this.addFieldset({'fields': this.options.fields, 'title': this.options.title});
			}

			if (typeOf(this.options.fieldsets) == 'array') {
				for ( var i = 0, l = this.options.fieldsets.length; i < l; i++ ) {
					this.addFieldset(this.options.fieldsets[i]);
				}
			}

			if (this.options.actions != null)
				this.addActions(this.options.actions);

			this.prepareShakeOnInvalidation();
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
			this._ui.actions.adopt(new Element('div.clear'));
			this._ui.root.adopt(this._ui.actions);
		}

		switch (typeOf(content)) {
			case 'array':
				content.each(function(c) {
					$(c).inject(this._ui.actions, 'top');
				}.bind(this));
				break;
			case 'element':
				content.inject(this._ui.actions, 'top');
				break;
			default:
				$(content).inject(this._ui.actions, 'top');
				break;
		}
	},
	/**
	 * @method addFieldset
	 * @param {gx.bootstrap.Fieldset} fieldset
	 * @return gx.bootstrap.Fieldset
	 */
	addFieldset: function(fieldset) {
		if ( fieldset.horizontal == null )
			fieldset.horizontal = this.options.horizontal;

		if ( fieldset.columns == null )
			fieldset.columns = this.options.columns;

		if ( fieldset.hintpos == null )
			fieldset.hintpos = this.options.hintpos;

		if ( fieldset.hintobject == null )
			fieldset.hintobject = this.options.hintobject;

		if ( fieldset.highlighteffect == null )
			fieldset.highlighteffect = this.options.highlighteffect;

		if ( fieldset.moohints == null )
			fieldset.moohints = this.options.moohints;

		if ( fieldset.highlightlocation == null )
			fieldset.highlightlocation = this.options.highlightlocation;

		if (typeOf(fieldset) == 'object') {
			if (!instanceOf(fieldset, gx.bootstrap.Fieldset))
				fieldset = new gx.bootstrap.Fieldset(null, fieldset);
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
	 * @method getFieldsets
	 * @description Gets all fieldsets
	 * @returns {array}
	 */
	getFieldsets: function() {
		return this._fieldsets;
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
	 * Call Form.Validator validation on form fields. But use custom
	 * messages instead of mootools localization.
	 * @return {bool} False if any error exists!
	 */
	doMooValidation: function() {
		var values = {};
		this._fieldsets.each(function(fs) {
			Object.merge(values, fs.doMooValidation());
		});
		var result;
		if (this._hasPasswords &&
			this._pwField.getValue() !== this._confirmField.getValue()) {
			this._pwField[this.options.moohints](
				_('error.password_no_match'),
				'error'
			);

			this._confirmField[this.options.moohints](
				_('error.password_no_match'),
				'error'
			);

			result = false;
		}

		if (result !== false)
			result = Object.getLength(values) === 0;

		if ( result !== true )
			this.shakeOnInvalidation();

		return result;
	},

	/**
	 * Set mootools Form.Validator attributes for various fields.
	 * @see gx.bootstrap.Field.setMooValidatorAttributes() and
	 * @see gx.bootstrap.Field.doMooValidation().
	 * @param {array} fields
	 */
	setMooValidator: function(fields) {
		for (var i = 0, l = this._fieldsets.length; i < l; i++) {
			this._fieldsets[i].setMooValidator(fields);
		}
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

		if ( count !== 0 )
			this.shakeOnInvalidation();

		return count;
	},
	setHintHighlights: function(highlights, type) {
		var count = 0;

		this._fieldsets.each(function(fs) {
			count += fs.setHintHighlights(highlights, type);
		});

		if ( count !== 0 )
			this.shakeOnInvalidation();

		return count;
	},

	prepareShakeOnInvalidation: function() {
		if ( !isArray(this.options.shakeOnInvalidation) ) {
			this.options.shakeOnInvalidation = [];
		} else {
			// $$(this.options.shakeOnInvalidation).addClass('webkitCssOnlyShake');
		}
	},

	shakeOnInvalidation: function() {
		if ( this.options.shakeOnInvalidation.length > 0 ) {
			var elements = $$(this.options.shakeOnInvalidation);
			elements.addClass('shakingElements');
			(function() {
				elements.removeClass('shakingElements');
			}).delay(300);
		}
	},

	setPasswordEqualityValidation: function(pwField, confirmField) {
		this._hasPasswords = true;
		this._pwField = this.getField(pwField);
		this._confirmField = this.getField(confirmField);
	},

	/**
	 * @method reset
	 * @description Reset all form fields
	 */
	reset: function() {
		this._fieldsets.each(function(fs) {
			fs.reset();
			fs.setHighlights();
			fs.setHintHighlights();
		});
	},

	/**
	 * Return object
	 * @return {[type]} [description]
	 */
	getLabels: function() {
		var labels = {};
		this._fieldsets.each(function(fs) {
			labels = Object.merge(labels, fs.getLabels());
		});

		return labels;
	}
});

gx.bootstrap.Form.extend({
	getFormValidator: function() {
	if ( !this._mooFormValidator )
	 	this._mooFormValidator = new Form.Validator();

		return this._mooFormValidator;
	}
});
