/**
 * @class gx.animate.TodoList
 * @description Animated todo list
 * @extends gx.ui.Container
 * @implements gx.animate.Checkbox
 *
 * @author Sebastian Glonner <sebastian.glonner@zeyon.net>
 * @version 1.00
 * @package Gx
 * @copyright Copyright (c) 2010, Sebastian Glonner
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 */
gx.animate.TodoList = new Class({
	Extends: gx.ui.Container,

	options: {
		delay: 100,
		animate: true,
	},

	_theme: {
		root: 'gxAnimateTodoList'
	},

	_currentTodo: 0,
	_currentCheck: 0,
	_todos: [],
	_wrappers: [],
	_checks: [],
	initialize: function(display, options) {
		this.parent(display, options);

		this._ui.root.addClass(this._theme.root);

		this.build(this._ui.root);
	},
	build: function(parent) {
		var todos = this.options.todos;
		var l = todos.length, i, t, c, w;

		for ( i = 0; i < l; i++) {
			t = new gx.animate.Speller(null, {
				'text': todos[i]
			});

			c = this.buildCheckbox();

			w = new Element('div.wrapper');

			if (!this.options.animate) {
				w.addClass('active');
				t.showHard();
			}

			parent.adopt(
				w.adopt(
					t,
					new Element('div.checkContainer').adopt(c)
				)
			);

			this._wrappers.push(w);
			this._todos.push(t);
			this._checks.push(c);
		}
	},

	buildCheckbox: function() {
		return new gx.animate.Checkbox(null, {
			'clickable': false
		});
	},

	doShow: function(i, all) {
		this._todos[i].show();
		this._wrappers[i].addClass('active');

		if ( all === false )
			return;

		if (this._todos[i + 1]) {
			setTimeout(function() {
				this.doShow(i + 1);
			}.bind(this), this.options.delay);
		}
	},

	doCheck: function(i, all) {
		this._checks[i].set(true);

		if ( all === false )
			return;

		if (this._checks[i + 1]) {
			setTimeout(function() {
				this.doCheck(i + 1);
			}.bind(this), this.options.delay);
		}
	},

	showAll: function() {
		this.doShow(this._currentTodo);
	},

	checkAll: function() {
		this.doCheck(this._currentCheck);
	},

	showNext: function() {
		this.doShow(this._currentTodo++, false);
	},

	checkNext: function() {
		this.doCheck(this._currentCheck++, false);
	}
});
