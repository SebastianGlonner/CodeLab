/**
 * Gx JavaScript Library for MooTools
 *
 * @author Peter-Christoph Haider <peter.haider@zeyon.net>
 * @version 1.00
 * @package Gx
 * @copyright Copyright (c) 2010, Peter Haider
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 */

/**
 * @extends gx
 */
gx.version = '1.000';

/**
 * @extends gx
 */
gx.core = {};

/* ========================== Utility Functions ========================== */

/**
 * @method isFunction
 * @description Returns true if param is a function
 * @param a
 */
function isFunction(a) {
	return typeof a == 'function';
}
/**
 * @method isNull
 * @description Returns true if param is null
 * @param a
 */
function isNull(a) {
	return a == null;
}
/**
 * @method isNumber
 * @description Returns true if param is a finite number
 * @param a
 */
function isNumber(a) {
	return typeof a == 'number' && isFinite(a);
}
/**
 * @method isObject
 * @description Returns true if param is an object or a function
 * @param a
 */
function isObject(a) {
	return (typeof a == 'object' && a) || isFunction(a);
}
/**
 * @method isString
 * @description Returns true if param is a string
 * @param a
 */
function isString(a) {
	return (typeof a === 'string' || (typeof a == 'object' && a instanceof String));
}
/**
 * @method isArray
 * @description Returns true if param is an array
 * @param a
 */
function isArray(a) {
	return (typeof a == 'object' && a instanceof Array);
}
/**
 * @method isDate
 * @description Returns true if param is a date
 * @param a
 */
function isDate(a) {
	return (typeof a == 'object' && a instanceof Date);
}
/**
 * @method isBoolean
 * @description Returns true if param is boolean
 * @param a
 */
function isBoolean(a) {
	return typeof a == 'boolean';
}
/**
 * @method isNode
 * @description Returns true if param is a node
 * @param a
 */
function isNode(a) {
	if ( isObject(a) && a.nodeType )
		return a.nodeType == 1;
	return false;
}

gx.util = new Object();

/**
 * @method gx.util.Console
 * @description Displays message as an alert
 * @param {string} source The source of the message
 * @param {string} message The message text
 */
gx.util.Console = function (source, message) {
	console.error(source + ': ' + message);
	alert(source + ': ' + message);
}

/**
 * @method gx.util.parseError
 * @description Parse catched errors to string.
 * @param {object} e The error object.
 * @param {string} spr (optional) The separator string between the error infos.
 */
gx.util.parseError = function (e) {
	var spr = '\n';
	if ( arguments[1] !== undefined )
		spr = arguments[1];

	var infos = new Array();
	if ( e.fileName != undefined )
		infos.push('File: ' + e.fileName);

	if ( e.lineNumber != undefined )
		infos.push('Line: ' + e.lineNumber);

	if( e.message != undefined )
		infos.push('Message: ' + e.message);

	var txt = '';
	for (var i = 0; i < infos.length; i++) {
		txt += infos[i] + spr;
	}
	return txt;
}

/**
 * @method gx.util.setEleContentByType
 * @description Adopt or set content to type depending on its type.
 * @param {object} ele The element which gets the content.
 * @param {string} content The content. Can be type of element, string, object
 */
gx.util.setElementContentByType = function (ele, content) {
	switch (typeOf(content)) {
		case 'string':
			ele.set('html', content);
			break;
		case 'element':
			ele.empty();
			ele.adopt(content);
			break;
		case 'array':
			ele.empty();
			ele.adopt(content);
			break;
		case 'object':
			ele.empty();
			ele.adopt(__(content));
			break;
	}
	return ele;
},

/**
 * @method objLen
 * @description Returns the length of an object
 * @param {string} obj The object in question
 */
function objLen(obj) {
	try {
		var c = 0;
		for (var i in obj)
	    	c++;
		return c;
	} catch(e) {
		gx.util.Console('gx.util.countObj', e.message);
		throw e;
	}
}

/**
 * @method printf
 * @description Inserts a single or multiple values into a string
 *
 * Sample:
 * var forecast = "On %arg% the wheather is %arg%";
 * alert(gx.util.printf(forecast, ['Sunday', 'sunny']));
 *
 * @param {string} subject Target string, where the values are inserted
 * @param {string|array} values A single value (string) or multiple values inside an array
 */
function printf(subject, values) {
	try {
		if ( typeOf(values) == 'string' || typeOf(values) == 'number' )
			values = [values];
		if ( typeOf(values) == 'array' ) {
			var sections = subject.split("%arg%");
			subject = '';
			var i = 0;
			if ( values != null )
				while (i < values.length) {
					subject = subject + ' ' + sections[i];
					if ( typeOf(sections[i]) == 'string' )
						subject = subject + values[i];
					else if ( typeOf(sections[i]) == 'number' )
						subject = subject + values[i].toString();
					i++;
				}
			while (i < sections.length) {
				subject = subject + sections[i];
				i++;
			}
			return subject;
		} else
			return subject;
	} catch(e) {
		gx.util.Console('gx.util.printf', e.message);
		throw e;
	}
}

function initValue(obj, key, def) {
	return obj[key] == null ? def : obj[key];
}

function parseResult(json) {
	var res = JSON.decode(json);
	var t = $type(res);
	if ( t == 'object' ) {
		if ( res.error != null )
			msg.show('Server error: ' + String(res.error).htmlSpecialChars(), 'error');
		else if ( res.result == null )
			msg.show('Undefined result', 'error');
		else
			return res.result;
	} else {
		msg.show('parseResult: Invalid data type: ' + String(t).htmlSpecialChars(), 'error');
	}

	return null;
}

String.implement({

	htmlSpecialChars: function () {
		return this
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

});

Element.implement({

	getClasses: function (regexp) {
		var classes = (
			this['classList']
			? this.classList
			: this.getProperty('class').split(/\s+/)
		);

		if ( !regexp )
			return classes;

		var result = [];
		for (var i = 0; i < classes.length; i++) {
			if ( classes[i].match(regexp) )
				result.push(classes[i]);
		}
		return result;
	},

	getClass: function (regexp) {
		var classes = this.getClasses(regexp);
		return classes[0];
	},

	removeClasses: function (regexp) {
		var cssClasses = this.getClasses(regexp);
		var count = cssClasses.length;
		for (var i = 0; i < count; i++)
			this.removeClass(cssClasses[i]);
		return this;
	}

});
