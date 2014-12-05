window.addEvent('domready',function(){
	// var myBlend = new gx.ui.Blend('body', {'loader': true});
	var myBlend = new gx.bootstrap.FileUploader($('uploaderProgress'), {
		'uploadUrl': './src/js/bootstrap/FileUploader/Sample/index.php'
	});
});
