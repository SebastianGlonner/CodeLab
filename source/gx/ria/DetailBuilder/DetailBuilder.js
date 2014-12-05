/**
 *
 * @class gx.ria.DetailBuilder
 * @description Build detail view of a gx.form.Form. Specialised for mobile devices.
 * @extends gx.form.Builder
 * @implements gx.form.Form
 * @implements gx.form.Field
 * @implements gx.form.FieldBuilder
 *
 * @param {string|node} display The element which will contain the form.
 * @param {json object} options
 *
 * @author Sebastian Glonner <sglonner@zeyon.net>
 * @version 1.00
 * @package form
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 * @sample Form A small formular example.
 */
gx.ria.DetailBuilder = new Class({
	Extends: gx.form.Builder,
	options: {
		fieldsPerRow: 2,
		cssPrefix: 'gxForm',
		rootTag: 'table', // TODO: possibility to set html objects here
		lineTag: 'tr',
		fieldTag: 'td',
		name2Img: {
			'label': 'myImgPath'
		},

		fieldNames: {
			'id': 'ID',
			'title': 'title',
			'lastmodified': 'lastmodified',
			'info': 'classID',
			'description': 'description'
		}
	},

	initialize: function(display, options) {
		if ( options != undefined && options.fieldNames != undefined )
			options = Object.merge({}, this.options, options);
		this.parent(display, options);
	},

	build: function (form) {
		try {
			var orgFields = form.getFields();
			var i, fields = new Object();

			// Low copy, because Mootools Object.clone() would result in endless loop
			// because fields contain reference to there form which contain reference to all fields and so on
			for ( i in orgFields ) {
				if ( !orgFields.hasOwnProperty(i) )
					continue;

				fields[i] = orgFields[i];
			}
			var root = this.getRoot();

			this._ui.root.adopt(this.buildHead(fields));
			this._ui.root.adopt(this.buildName(fields));
			this._ui.root.adopt(this.buildDesc(fields));

			fields = this.removeSpecialFields(fields);

			var field;
			var line = this.getLine();
			var perRow = this.options.fieldsPerRow;
			var rowCount = 0;
			for ( i in fields ) {
				if ( !fields.hasOwnProperty(i) )
					continue;

				field = fields[i];
				if ( !field.options.visible )
					continue;

				if ( rowCount == perRow ) {
					rowCount = 0;
					root.adopt(line);
					line = this.getLine();
				}

				line.adopt(this.buildField(i, field));
				rowCount++;
			}

			root.adopt(line);
			this._ui.root.adopt(root);
			return this._ui.root;
		} catch (e) { gx.util.Console('gx.ria.DetailFormBuilder->buildHead', e.message); }
	},

	buildField: function (name, field) {
		try {
			var td = new Element(this.options.fieldTag + '.' + this.options.cssPrefix + 'Cell');
			var img = new Element('img', {
				src: this.options.name2Img[name],
				style: 'vertical-align:middle;'
			});
			var span = new Element('span', {
				html: field.getDisplayValue(),
				style: 'vertical-align:middle;'
			});
			td.adopt(img,span);
			return td;
		} catch (e) { gx.util.Console('gx.ria.DetailFormBuilder->buildHead', e.message); }
	},

	buildHead: function (fields) {
		try {
			var head = new Element('div', {
				'class': this.options.cssPrefix + 'Head'
			});

			head.adopt(__({
				'tag': 'table',
				'cellpadding': 0,
				'cellspacing': 0,
				'width': '100%',
				'children': [
					{'tag': 'tr', 'children': [
						{'tag': 'td', 'html': '#' + fields[this.options.fieldNames.id].getDisplayValue() + ' ' + fields[this.options.fieldNames.info].getDisplayValue()},
						{'tag': 'td', 'style': 'text-align:right;'}
					]}
				]
			}));

			var img = new Element('img', {
				src: this.options.name2Img[fields[this.options.fieldNames.lastmodified].getName()],
				style: 'vertical-align:middle;'
			});
			var span = new Element('span', {
				html: fields[this.options.fieldNames.lastmodified].getDisplayValue(),
				style: 'vertical-align:middle;'
			});
			var td = head.getElements('td');
			td[1].adopt(img, span);
			return head;
		} catch (e) { gx.util.Console('gx.ria.DetailFormBuilder->buildHead', e.message); }
	},

	buildName: function (fields) {
		try {
			var name = new Element('div', {
				'class': this.options.cssPrefix + 'Name',
				'html': fields[this.options.fieldNames.title].getDisplayValue()
			});
			return name;
		} catch (e) { gx.util.Console('gx.ria.DetailFormBuilder->buildName', e.message); }
	},

	buildDesc: function (fields) {
		try {
			var field = fields[this.options.fieldNames.description];
			var value = field.getDisplayValue();
			var desc = new Element('div', {
				'class': this.options.cssPrefix + 'Description'
			});
			var element = 'div';
			if ( value != '' )
				element += '.labelArrow';
			var arrow = new Element(element, {
				'html': field.getLabel()
			});
			var body = new Element('div', {
				'html': value
			});
			desc.adopt(arrow, body);
			arrow.set('slide');
			body.slide('hide');
			desc.addEvent('click', function () {
				body.slide();
			});
			return desc;
		} catch (e) { gx.util.Console('gx.ria.DetailFormBuilder->buildDesc', e.message); }
	},

	getRoot: function () {
		return new Element(this.options.rootTag, {
			'class': this.options.cssPrefix + 'Container',
			'cellpadding': 0,
			'cellspacing': 0,
		});
	},

	getLine: function () {
		return new Element(this.options.lineTag, {
			'class': this.options.cssPrefix + 'Line'
		});
	},


});
