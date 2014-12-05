window.addEvent('domready',function(){

	var v1 = new gx.form.Validator([
		['mandatory', true]
	]);

	var v2 = new gx.form.Validator([
		['minLength', 6],
	]);

	var v3 = new gx.form.Validator([
		['maxLength', 4]
	]);

	var v4 = new gx.form.Validator([
		['number', true]
	]);

	var v5 = new gx.form.Validator([
		['positive', true]
	]);

	var v6 = new gx.form.Validator([
		['negative', true],
	]);

	var v7 = new gx.form.Validator([
		['bigger', 5],
	]);

	var v8 = new gx.form.Validator([
		['smallerEqual', 10],
	]);

	var v9 = new gx.form.Validator([
		['email', true],
	]);

	var v10 = new gx.form.Validator([
		['date', 'ddmmyyyy'],
	]);

	var v11 = new gx.form.Validator([
		['string', true],
	]);

	var v12 = new gx.form.Validator([
		['regexp', new RegExp(/^test$/i)],
	],{
		'msg':{'regexp':'A custom message'}
	});

	var v13 = new gx.form.Validator([
		['range', new Array(10, 200)]
	]);

	$('validate').addEvent('click', function() {

		var message = new Array();

		message.push('Errors:')

		v1.validate($('input1').value);
		message.push('1. ' + v1.getErrors().join(", "));

		v2.validate($('input2').value);
		message.push('2. ' + v2.getErrors().join(", "));

		v3.validate($('input3').value);
		message.push('3. ' + v3.getErrors().join(", "));

		v4.validate($('input4').value);
		message.push('4. ' + v4.getErrors().join(", "));

		v5.validate($('input5').value);
		message.push('5. ' + v5.getErrors().join(", "));

		v6.validate($('input6').value);
		message.push('6. ' + v6.getErrors().join(", "));

		v7.validate($('input7').value);
		message.push('7. ' + v7.getErrors().join(", "));

		v8.validate($('input8').value);
		message.push('8. ' + v8.getErrors().join(", "));

		v9.validate($('input9').value);
		message.push('9. ' + v9.getErrors().join(", "));

		v10.validate($('input10').value);
		message.push('10. ' + v10.getErrors().join(", "));

		v11.validate($('input11').value);
		message.push('11. ' + v11.getErrors().join(", "));

		v12.validate($('input12').value);
		message.push('12. ' + v12.getErrors().join(", "));

		v13.validate($('input13').value);
		message.push('13. ' + v13.getErrors().join(", "));

		alert(message.join("\n"));

	});
});
