/**
 *
 * @class gx.form.Field
 * @description Represents one field of a formular
 * @extends gx.core.Settings
 * @implements gx.form.Validator
 * @implements gx.form.Indicator
 *
 * @param {string|node} display The input element.
 * @param {json object} options
 *
 * @option {string} default The fields default value.
 * @option {string} cssPrefix Css class prefix.
 * @option {string} MSG_INVALID Custom message return while field input is invalid.
 * @option {boolean} validate If the field have to be validated or not.
 * @option {object} visible If the field have to be visible or not.
 * @option {string} buildFunction The function which will be called from gx.form.FieldBuilder() to build field.
 * @option {boolean} mandatory Field is mandatory?.
 * @option {boolean} editabel Field can be edit?.
 *
 * @author Peter-Christoph Haider <peter.haider@zeyon.net>, Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample Field A small formular example.
 */
gx.form.Field = new Class({
	Extends: gx.core.Settings,
	options: {
		default: '',
		cssPrefix: 'gxFormField',
		MSG_INVALID: '',
		validate: true,
		visible: true,
		buildFunction: 'Common',
		mandatory: false,
		editable: true,
	},

	_ui: {},
	_validator: null,
	_indicator: null,
	_indicatorHandler: null,
	_label: '',
	_name: '',
	_helpText: '', // TODO

	_myForm: null,

	initialize: function(attributes, label, validator, indicator, options) {
		try {
			this.parent(options);
			this._label = label;
			this.declare();
			this.setIndicatorHandler(indicator);
			this.setValidator(validator);
			this._ui.input.set(attributes);
			this.reset();			
		} catch(e) { gx.util.Console('gx.form.Field->initialize', e.message); }
	},

	declare: function() {
		var css = this.options.cssPrefix;
		this._ui.input = new Element('input'); // May be changed in special fields
		this._indicator = new Element('div');
		this._ui.label = this._label;
		this._ui.edit = this._ui.input;
	},

	getInput: function () {
		return this._ui.input;
	},

	getEdit: function () {
		return this._ui.edit;
	},

	setEditCon: function (element) {
		this._ui.editCon = element;
	},

	getEditCon: function () {
		return this._ui.editCon;
	},

	getLabel: function () {
		return this._ui.label;
	},

	setLabelCon: function (element) {
		this._ui.labelCon = element;
	},

	getLabelCon: function () {
		return this._ui.labelCon;
	},

	setLine: function (element) {
		this._ui.line = element;
	},

	getLine: function () {
		return this._ui.line;
	},

	getIndicator: function () {
		return this._indicator;
	},

	getForm: function() {
		return this._myForm;
	},

	setForm: function (form) {
		this._myForm = form;
	},

	getName: function () {
		return this._name;
	},

	setName: function (name) {
		this._name = name;
	},

	setValidator: function(validator) {
		this._validator = validator;
	},

	getValidator: function () {
		return this._validator;
	},

	setIndicatorHandler: function (indicator) {
		indicator.setField(this);
		this._indicatorHandler = indicator;
	},
	getIndicatorHandler: function () {
		return this._indicatorHandler;
	},

	get: function (param) {
		return this.getInput().get(param);
	},

	set: function (param) {
		return this.getInput().set(param);
	},

	/**
	 * @method validate
	 * @description Validate field and return error if value is invalid.
	 */
	validate: function() {
		try {
			var valid = this._validator.validate(this.getValue());
			if ( valid === true )
				return true;

			return this._validator.getErrors();
		} catch(e) { gx.util.Console('gx.form.Field->validate', e.message); return false; }
	},

	/**
	 * @method setValue
	 * @description Set field value.
	 */
	setValue: function(value) {
		var root = this;
		try {
			if (value == null)
				this._ui.input.set('value', this.options.default);
			else
				this._ui.input.set('value', value);
		} catch(e) { gx.util.Console('gx.form.Field->setValue', e.message); }
	},

	/**
	 * @method getValue
	 * @description Get field value.
	 */
	getValue: function() {
		var root = this;
		try {
			return this._ui.input.get('value');
		} catch(e) { gx.util.Console('gx.form.Field->getValue', e.message); }
	},

	/**
	 * @method reset
	 * @description Reset field value.
	 */
	reset: function () {
		this._ui.input.set('value', this.options.default);
	},

	/**
	 * @method getDisplayValue
	 * @description Get field display value which may differ from the hidden value.
	 */
	getDisplayValue: function() {
		return this.getValue();
	},

	/**
	 * @method disable
	 * @description Disable field.
	 */
	disable: function() {
		this._ui.input.set('disabled', true);
	},
	/**
	 * @method enable
	 * @description Enable field.
	 */
	enable: function() {
		this._ui.input.set('disabled', false);
	}
});
