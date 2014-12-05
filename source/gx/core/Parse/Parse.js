/**
 * @method gx.core.Parse
 * @description Helper function to parse an element tree
 * @implements gx.ui.Container
 * @param {object} obj The object to parse
 *
 * @author Peter-Christoph Haider <peter.haider@zeyon.net>
 * @version 1.00
 * @package com
 * @copyright Copyright (c) 2011-2013, Zeyon (www.zeyon.net)
 */

gx.core.Parse = function(obj) {
	switch (typeOf(obj)) {
		case 'object':
			if ( gx && gx.ui && gx.ui.Container &&
				 instanceOf(obj, gx.ui.Container) && typeOf(obj.display) == 'function')
				return obj.display();

			obj.tag = obj.tag == null ? 'div' : obj.tag;
			var elem = new Element(obj.tag);
			for (var prop in obj) {
				switch (prop) {
					case 'styles':
						elem.setStyles(obj.styles);
						break;
					case 'classes':
						if (typeOf(obj.classes) == 'array')
							obj.classes.each(function(className) { elem.addClass(className) });
						else
							elem.addClass(obj.classes)
						break;
					case 'child':
						elem.adopt(gx.core.Parse(obj.child));
						break;
					case 'children':
						var names = [];
						for (var name in obj.children) {
							var child = gx.core.Parse(obj['children'][name]);
							elem.adopt(child);
							elem['_' + name] = (typeOf(child.retrieve) == 'function' && child.retrieve('com')) ? child.retrieve('com') : child;
							names.push(name);
						}
						elem.store('children', names);
						break;
					case 'tag':
						break;
					default:
						if (prop.length > 5 && prop.substring(0, 2) == 'on' && prop.substring(2, 3) == prop.substring(2, 3).toUpperCase())
							elem.addEvent(prop.substring(2).toLowerCase(), obj[prop]);
						else
							elem.set(prop, obj[prop]);
						break;
				}
			}
			return elem;
		case 'string':
			return document.createTextNode(obj);
		case 'element':
			return obj;
	}

	return false;
};

// Add the shortcut function
var __ = gx.core.Parse;
