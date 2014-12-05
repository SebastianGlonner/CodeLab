/**
 *
 * @class gx.form.Validator
 * @description Validate input fields.
 * @extends gx.core.Settings
 *
 * @param {json array} rules
 * @param {json object} options
 *
 * @option {function} onInvalid Function called after testing all rules and one of it was invalid.
 * @option {function} onValid Function called after testing all rules and all where valid.
 * @option {RegExp} emailRegExp RegExp object to test emails.
 * @option {string} emailExample Example text while getting invalid email test.
 * @option {json object} dateRegExp RegExp objects to test date with different format.
 * @option {json object} dateExample Example text while getting invalid date test.
 * @option {json object} msg Messages which will be collect while getting invalid test.
 *
 * @author Peter-Christoph Haider <peter.haider@zeyon.net>, Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample Validator A small validator example.
 */

gx.form.Validator = new Class({
	Extends: gx.core.Settings,
	options: {
		'onInvalid': null,
		'onValid': null,

		'emailRegExp': new RegExp('[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}'),
		'emailExample': 'example@domain.de',

		'dateRegExp': {
			'yyyymmdd': /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])($| [01][0-9]:[0-5][0-9](|:[0-5][0-9])| 2[0-3]:[0-5][0-9](|:[0-5][0-9]))$/,
			'ddmmyyyy': /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d($| [01][0-9]:[0-5][0-9](|:[0-5][0-9])| 2[0-3]:[0-5][0-9](|:[0-5][0-9]))$/
		},
		'dateExample': {
			'yyyymmdd': 'yyyy.mm.dd | yyyy-mm-dd | yyyy mm dd | yyyy/mm/dd, (HH:MM:SS)',
			'ddmmyyyy': 'dd.mm.yyyy | dd-mm-yyyy | dd mm yyyy | dd/mm/yyyy, (HH:MM:SS)'
		},

		'msg': {
			'err_mandatory': 'You must enter a value.',
			'err_minLength': 'You must at least enter more than %arg% characters.',
			'err_maxLength': 'You must not enter more than %arg% characters.',
			'err_number': 'You must enter a number.',
			'err_string': 'You must enter a string.',
			'err_positive': 'You must enter a positive number.',
			'err_negative': 'You must enter a negative number.',
			'err_bigger': 'You must enter a value bigger than %arg%.',
			'err_biggerEqual': 'You must enter a value bigger or equal %arg%',
			'err_smaller': 'You must enter a value smaller than %arg%',
			'err_smallerEqual': 'You must enter a value smaller or equal %arg%',
			'err_regexp': 'The value does not match the required pattern.',
			'err_email': 'You must enter a valid E-Mail (%arg%).',
			'err_date': 'You must enter a valid date\n(format: %arg%).',
			'err_range': 'You must enter a number between %arg% and %arg%.'
		}
	},

	_rules: [
		/*
		['mandatory', null],
		['minLength', null],
		['maxLength', null],
		['number', null],
		['positive', null],
		['negative', null],
		['bigger', null],
		['biggerEqual', null],
		['smaller', null],
		['smallerEqual', null],
		['regexp', null],
		['email', null],
		['date', null],
		['range',null],
		*/
	],

	_errors: [],

	initialize: function(rules, options) {
		if ( options != undefined && options.msg != undefined )
			options.msg = Object.merge({}, this.options.msg, options.msg);
		this.parent(options);
		if ( rules != undefined )
			this._rules = rules;
	},

	/**
	 * @method validate
	 * @description Validate the value with all saved rules.
	 * @param {mixed} value The value which will be tested.
	 */
	validate: function(value) {
		this._errors = new Array();
		var result = true;
		for (var i = 0; i < this._rules.length; i++ ) {
			var rule = this._rules[i];
			if ( !this.callValidationFunc(rule[0], value, rule[1]) ) {
				result = false;
			}
		}
		if ( result )
			this.fireEvent('valid');
		else
			this.fireEvent('invalid', this._errors);

		return result;
	},

	/**
	 * @method addRule
	 * @description Add rule.
	 * @param {json object} rule
	 */
	addRule: function (rule) {
		this._rules.push(rule);
	},

	/**
	 * @method addRules
	 * @description Add rules.
	 * @param {json object} rules
	 */
	addRules: function (rules) {
		for (var i = 0; i < rules.length; i++ ) {
			this.addRule(this._rules[i]);
		}
	},

	/**
	 * @method setRules
	 * @description Set rules.
	 * @param {array} rules The rules which will be called.
	 */
	setRules: function(rules) {
		this._rules = rules;
	},

	/**
	 * @method parseRules
	 * @description Set rules.
	 * @param {json object} rules The rules which will be called.
	 */
	/* TODO
	parseRules: function(parse) {
		var parsed = {};
		rules = rules;
	},
	*/

	callValidationFunc: function(func, value, rule) {
		try {
			var message;
			var result = this[func](value, rule);
			if( result === true ) {
				return true;

			} else if ( result === false ) {
				message = this.getMessage('err_' + func, rule)

			} else if ( typeof result == 'string' ) {
				message = result;
			}
			this._errors.push(message);
			return false;

		} catch(e) { gx.util.Console('gx.form.Validator->callValidationFunc', e.message); return false; }
	},

	/**
	 * @method alertValidation
	 * @description Validate and alert all occured errors.
	 * @param {mixed} message The message
	 */
	alertValidation: function(value) {
		if ( !this.validate(value) ) {
			alert(this._errors.join('\n'));
		}
	},

	/**
	 * @method getErrors
	 * @description Return all occurred errors.
	 */
	getErrors: function () {
		return this._errors;
	},

	/**
	 * @method setLang
	 * @description Set error msg language.
	 * @param {json object} lang Error message strings.
	 */
	setLang: function (lang) {
		this.options.msg = lang;
	},

	/**************************************
	 *      validation functions
	 **************************************/
	mandatory: function(value) {
		if ( value === null || value == '' )
			return false;

		return true;
	},

	minLength: function(value, minLength) {
		try {
			if ( value.length < minLength )
				return false;

			return true;
		} catch(e) { gx.util.Console('gx.form.Validator->minLength', e.message); return false; }
	},

	maxLength: function(value, maxLength) {
		try {
			if ( value.length > maxLength )
				return false;

			return true;
		} catch(e) { gx.util.Console('gx.form.Validator->maxLength', e.message); return false; }
	},

	number: function(value) {
		try {
			if ( value == '' || typeof value == 'number' || ( typeof value == 'string' && !isNaN(value) ) )
				return true;

			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->number', e.message); return false; }
	},

	string: function(value) {
		try {
			if ( value == '' || isNaN(value) )
				return true;

			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->number', e.message); return false; }
	},

	positive: function(value) {
		try {
			if ( value == '' )
				return true;

			if ( this.number(value) ) {
				var temp = parseFloat(value);
				if ( temp >= 0 )
					return true;
			}
			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->positive', e.message); return false; }
	},

	negative: function(value) {
		try {
			if ( value == '' )
				return true;

			if ( this.number(value) ) {
				var temp = parseFloat(value);
				if ( temp <= 0 )
					return true;
			}
			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->negative', e.message); return false; }
	},

	bigger: function(value, bigger) {
		try {
			if ( value == '' || value > bigger )
				return true;

			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->bigger', e.message); return false; }
	},

	biggerEqual: function(value, biggerEqual) {
		try {
			if ( value == '' || value >= biggerEqual )
				return true;

			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->biggerEqual', e.message); return false; }
	},

	smaller: function(value, smaller) {
		try {
			if ( value == '' || value < smaller )
				return true;

			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->smaller', e.message); return false; }
	},

	smallerEqual: function(value, smallerEqual) {
		try {
			if ( value == '' || value <= smallerEqual )
				return true;

			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->smallerEqual', e.message); return false; }
	},

	regexp: function(value, regexp) {
		try {
			if ( value == '' || regexp.test(value) )
				return true;

			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->regexp', e.message); return false; }
	},

	email: function(value) {
		try {
			if ( value == '' || this.regexp(value, this.options.emailRegExp) )
				return true;

			return this.getMessage('err_email', this.options.emailExample);
		} catch(e) { gx.util.Console('gx.form.Validator->email', e.message); return false; }
	},

	date: function(value, format) {
		try {
			if ( value == '' || this.regexp(value, this.options.dateRegExp[format]) )
				return true;

			return this.getMessage('err_date', this.options.dateExample[format]);
		} catch(e) { gx.util.Console('gx.form.Validator->date', e.message); return false; }
	},

	range: function(value, range) {
		try {
			if ( value == '' || (value >= range[0] && value <= range[1]) )
				return true;

			return false;
		} catch(e) { gx.util.Console('gx.form.Validator->range', e.message); return false; }
	},
});
