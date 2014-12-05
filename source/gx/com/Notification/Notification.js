/**
 * @class gx.com.Notification
 * @description Displays notifications
 * @sample Notification An example demonstrating notifications
 *
 * @author Huy Hoang Nguyen <hnguyen@cms-it.de>
 * @copyright Copyright (C) 2009 - 2011, CMS IT-Consulting GmbH. All rights reserved.
 * @package PROCABS
 *
 * @param {string|node} display
 *
 * @option {int} messageWidth The width of the message
 * @option {float} opacity The opacity of the message
 * @option {int} duration The duration the message will stay
 * @option {bool} blend Apply a blend effect
 * @option {bool} fixed Set the message fixed
 * @option {string} x The x-value of the message's position
 * @option {string} y The y-value of the message's position
 */

/**
 * Closure
 */
(function () {

	/**
	 * Provides notification message functions.
	 */
	var Notification = {

		/**
		 * Default options.
		 *
		 * @type Hash
		 */
		options: {
			'wrapper'    : undefined,
			'button'     : undefined,

			/**
			 * The MooTools {@link Element} that contains the list.
			 *
			 * @type Element
			 */
			'container'  : undefined,

			'minHeight'  : 16,

			/**
			 * A MooTools {@link Element} referring to the "<ul>" holding the messages.
			 *
			 * @type Element
			 */
			'list'       : undefined,

			/**
			 * Defines the types of notification messages by mapping the type name to a caption.
			 *
			 * @type Array
			 */
			'types'      : {},

			/**
			 * Specifies the default type for {@link add} if no type is specified.
			 *
			 * @type String
			 */
			'defaultType': undefined,

			/**
			 * Defines the delay in milliseconds after which to hide a message.
			 * Optional. Default is 3500 (3.5 seconds).
			 *
			 * @type Number
			 * @see Notification#add()
			 */
			'hideDelay'  : 3500,

			/**
			 * The color to use for highlighting newly added messages.
			 *
			 * @type String
			 */
			'highlightColor': '#ffee00',

			/**
			 * A function to call when {@link Notification#update()} is invoked.
			 * Optional.
			 *
			 * @type function
			 */
			'onChange'   : undefined
		},

		/**
		 * Indicates whether the notification message container is open.
		 *
		 * @type Boolean
		 */
		open: false,

		/**
		 * Initializes the notification class.
		 *
		 * @type {void}
		 */
		initialize: function (options) {
			Object.append(this.options, options);

			if ( typeOf(this.options.container) != 'element' )
				return;

			this.options.button.addEvent('click', this.toggle.bind(this));

			// Hide shadow on mouse-over to avoid obscuring interactive elements (links etc.)
			var shadow = this.options.container.getFirst('.shadow');
			this.options.list.addEvents({
				'mouseenter': function () { shadow.hide(); },
				'mouseleave': function () { shadow.show(); }
			});

			this.update();
		},

		/**
		 * Hides or reveals the title bar of the message container, depending on whether there are messages in it.
		 *
		 * @type {void}
		 */
		update: function () {
			var elements = this.options.list.getChildren('tr');

			if ( !elements || elements.length == 0 )
				this.options.wrapper.hide();
			else
				this.options.wrapper.reveal();

			this.options.container.scrollTo(0, 0);

			if ( this.options.onChange )
				this.options.onChange();

			if ( this.options.wrapper.hasClass('expanded') )
				this.slide('in');
		},

		/**
		 * Hides a notification message if it has the CSS class "new" and removes that class.
		 *
		 * @type {void}
		 */
		autoHide: function () {
			// "this" refers to the "<li>" element.
			if ( this.hasClass('new') )
				this.removeClass('new');
		},

		/**
		 * Toggles the visibility of the notification messages.
		 *
		 * @type {void}
		 * @see Notification#open
		 */
		toggle: function () {
			this.options.wrapper.toggleClass('expanded');
			this.slide( this.options.wrapper.hasClass('expanded') ? 'in' : 'out' );
		},

		slide: function (type) {
			this.options.container.morph({
				'height': ( type === 'in' ? this.options.container.scrollHeight : 0 )
			});
		},

		/**
		 * Adds a notification message.
		 * The message will be hidden automatically after the time specified in
		 * {@link options.hideDelay} if the message container is currently closed.
		 *
		 * @param {String} message
		 * @param {String} type Optional. Default is {@link options.defaultType}.
		 * @param {String} id Optional. Default is undefined.
		 * @type {void}
		 * @see Notification#autoHide()
		 */
		add: function (message, type, id) {
			if ( !type )
				type = this.options['defaultType'];

			var title = 'Error';
			if ( this.options['types'] && this.options['types'][type] )
				title = this.options['types'][type];

			var attributes = {};
			if ( id )
				attributes.id = id;

			var element = (new Element('tr'))
				.inject(this.options.list, 'top')
				.addClass(type)
				// This must be set *after* injecting the element into the table,
				// otherwise the "<td>" tags will get lost (might be a MooTools or
				// a browser bug).
				.set('html', '<td class="title">'+title+'</td><td class="text">'+message+'</td>');

			// Make it disappear automatically
			if ( !this.open && this.options.hideDelay ) {
				element.addClass('new');
				this.autoHide.delay(this.options.hideDelay, element);
			}

			this.options.button.highlight(this.options.highlightColor);
			element.highlight(this.options.highlightColor);

			this.update();
		}

	};

	gx.com.Notification = new Class({

		Implements: [ Events ],

		initialize: function(options) {
			var notificationElement = new Element('div', {
				'class': 'clear',
				'html' :
					'<div id="notification_wrapper" class="expanded">'+
						'<div id="notification_container_button_wrap"><div id="notification_container_button">'+
							'<div class="left">Notifications</div><div class="expandicon"></div>'+
						'</div></div>'+
						'<div id="notification_container">'+
							'<div class="shadow"></div>'+
							'<table id="notification_list" cellpadding="0" cellspacing="0"><tbody>'+
							'</tbody></table>'+
						'</div>'+
					'</div>'
			}).inject(document.body);

			Notification.initialize(Object.append({
				'wrapper'       : $('notification_wrapper'),
				'container'     : $('notification_container'),
				'button'        : $('notification_container_button'),
				'list'          : $('notification_list').getFirst('tbody'),
				'types'         : {
					'message'   : 'Message',
					'info'      : 'Notice',
					'warning'   : 'Warning',
					'error'     : 'Error'
				},
				'defaultType'   : gx.com.Notification.TYPE_ERROR,
				'hideDelay'     : 3500,
				'highlightColor': '#ffee00',
				'onChange'      : function () {
					this.fireEvent('change', arguments);
				}.bind(this)
			}, options));
		},

		add: function () {
			Notification.add.apply(Notification, arguments);
		}

	}).extend({
		TYPE_MESSAGE: 'message',
		TYPE_INFO   : 'info',
		TYPE_WARNING: 'warning',
		TYPE_ERROR  : 'error'
	});

})();
