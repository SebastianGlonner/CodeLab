/**
 * @class gx.nav.SlidingContent
 * @description Creates content with the gx.com.OC_Container component.
 * @extends gx.nav.Content
 * @implements gx.com.OC_Container
 */
gx.nav.FadingContent = new Class({
	Extends: gx.nav.SlidingContent,

	options: {
		'effect': 'Fading'
	}
});