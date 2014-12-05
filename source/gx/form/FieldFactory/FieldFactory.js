/**
 *
 * @class gx.form.FieldFactory
 * @description Build form with given gx.form.Fields.
 * @extends gx.core.Settings
 * @implements gx.form.FSelect
 * @implements gx.form.FDate
 * @implements gx.form.FTextarea
 *
 * @param {json object} options
 *
 * @option {obejct} validator The validator class to use. gx.form.Validator() by default.
 * @option {obejct} Indicator The indicator class to use. gx.form.Indicator() by default.
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample Form A small formular example.
 */
gx.form.FieldFactory = new Class({
	Extends: gx.core.Settings,
	options: {
		validator: gx.form.Validator,
		indicator: gx.form.Indicator,
	},

	initialize: function(options) {
		this.parent(options);
	},

	build: function (type, att, label, options, validator, indicator) {
		try {
			if ( options == undefined )
				options = {};

			if ( validator == undefined )
				validator = new this.options.validator();

			if ( indicator == undefined )
				indicator = new this.options.indicator();

			var field = this[type](att, label, options, validator, indicator);

			if ( field.options.mandatory )
				validator.addRule(['mandatory', true]);

			return field;
		} catch(e) { gx.util.Console('gx.form.FieldFactory->build', e.message); return false; }
	},

	Text: function (att, label, options, validator, indicator) {
		return new gx.form.Field(att, label, validator, indicator, options);
	},

	ID: function (att, label, options, validator, indicator) {
		validator.addRule(['number', true]);
		return new gx.form.Field(att, label, validator, indicator, options);
	},

	Textarea: function (att, label, options, validator, indicator) {
		return new gx.form.FTextarea(att, label, validator, indicator, options);
	},

	Number: function (att, label, options, validator, indicator) {
		validator.addRule(['number', true]);
		if ( options.default == undefined )
			options.default = 0;
		return new gx.form.Field(att, label, validator, indicator, options);
	},

	String: function (att, label, options, validator, indicator) {
		validator.addRule(['string', true]);
		return new gx.form.Field(att, label, validator, indicator, options);
	},

	Email: function (att, label, options, validator, indicator) {
		validator.addRule(['email', true]);
		return new gx.form.Field(att, label, validator, indicator, options);
	},

	Date: function (att, label, options, validator, indicator) {
		return new gx.form.FDate(att, label, validator, indicator, options);
	},

	AdvSelect: function (att, label, options, validator, indicator) {
		return new gx.form.FSelect(att, label, validator, indicator, options);
	},

	GxListFilter: function (att, label, options, validator, indicator) {
		return new gx.form.FGxListFilter(att, label, validator, indicator, options);
	},
});
