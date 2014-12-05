window.addEvent('domready',function(){
	var progressBar = new gx.com.ProgressBar('barInHere', {text:true, start:75});

	$('setPercent').addEvent('click', function () {
		progressBar.setPercent($('percent').value);
	});
});
