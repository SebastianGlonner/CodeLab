/**
 * @class gx.bootstrap.FileUploader
 * @description Creates a file uploader control.
 * @extends gx.ui.Container
 *
 * @option {string} uploadUrl Php script url to handle the upload.
 * @option {integer} maxHeight Max progress container height.
 * @option {integer} maxFileCount Max file count.
 * @option {integer} maxFileSize Max file size in mb.
 * @option {array} existingFiles Throw dublicate error if upload file which is inside this array.
 * @option {function} createRequestData Method to edit data send with the request.
 *
 * @event queueComplete Called after all all files has been processed.
 *
 * @sample FileUploader Simple file uploader example
 */
gx.bootstrap.FileUploader = new Class({
	gx: 'gx.bootstrap.FileUploader',
	Extends: gx.ui.Container,
	options: {
		'uploadUrl'         : 'upload.php',
		'inputname'         : 'file',
		'maxHeight'         : 600,
		'maxFileCount'      : 100,
		'maxFileSize'       : 50,
		'existingFiles'     : [],
		'createRequestData' : null, /*default: function(data) {
			return data;
		}*/
	},

	_total     : 0,
	_inprogress: 0,
	_error     : 0,
	_success   : 0,

	_progresses: {},

	initialize: function(display, options) {
		var root = this;
		try {
			this.parent(display, options);

			this._ui.root.addClass('bs-fileuploader');

			this._ui.frame = new Element('div', {'styles': {

			}});

			this._ui.status   = new Element('div');
			this._ui.progress = new Element('div', {
				'class': 'clear',
				'styles': {
					'max-height': this.options.maxHeight,
					'overflow-y': 'scroll'
				}
			});
			this._ui.footer   = new Element('div');

			this._ui.frame.adopt([this._ui.status, this._ui.progress, this._ui.footer]);

			this._ui.root.adopt(this._ui.frame);

			this.createStatusBar(this._ui.status);
			this.createFooter(this._ui.footer);
			this.updateCounter();
		} catch(e) { gx.util.Console('gx.bootstrap.FileUploader->initialize', e.message); }
	},

	createStatusBar: function(elem) {
		this._ui.total = new Element('span.right');
		this._ui.inprogress = new Element('span.right');
		this._ui.error = new Element('span.right');
		this._ui.success = new Element('span.right');

		this._ui.counter = new Element('div', {
			'class' : 'bs-counterbar'
		});

		this._ui.counter.adopt([
			__({'class': 'right', 'children': [
					{ 'children': [
						new Element('span.left', {'html': 'Error:&nbsp;'}),
						this._ui.error
					]},
					{'class':'clear'},
					{'children': [
						new Element('span.left', {'html': 'Success:&nbsp;'}),
						this._ui.success
					]}
				]
			}),
			__({'class': 'right mright-20', 'children': [
					{ 'children': [
						new Element('span.left', {'html': 'Total:&nbsp;'}),
						this._ui.total
					]},
					{'class':'clear'},
					{'children': [
						new Element('span.left', {'html': 'Progressing:&nbsp;'}),
						this._ui.inprogress
					]}
				]
			})
		]);

		elem.adopt([
			new Element('h3', {
				'class': 'left',
				'html': 'Queue (' + this.options.maxFileSize +' MB / file)'
			}),
			this._ui.counter
		]);
	},

	createFooter: function(elem) {
		elem.setStyles({
			'position': 'relative'
		});
		var select = __({
			'tag'     : 'input',
			'type'    : 'file',
			'class'   : 'bs-fileInput',
			'multiple': 'multiple',
		});

		var selectBtn = __({
			'tag'     : 'button',
			'class'   : 'bs-fileBtn btn btn-primary',
			'html'    : '<i class="icon-white icon-upload"></i> Select'
		});

		var self = this;
		select.addEvent('change', function(){
			self.handleFileSelect(this);
		});

		elem.adopt([
			select,
			selectBtn
		]);
	},

	updateCounter: function() {
		this._ui.total.set('html', this._total);
		this._ui.inprogress.set('html', this._inprogress);
		this._ui.error.set('html', this._error);
		this._ui.success.set('html', this._success);
	},

	handleFileSelect: function(fileInput) {
		var max = this.options.maxFileSize * 1024 * 1024;
		var files = fileInput.files;

		this._total += files.length;
		for ( var i = 0; i < files.length; i++ ) {
			var file = files[i];
			var progressBar = new this.ProgressBar(this, file, {});

			$(progressBar).inject(this._ui.progress);

			var prog = {}
			prog.bar = progressBar;
			prog.file = file;

			this._progresses[file.name] = prog;

			this._inprogress++;

			if ( file.size > max )
				this.uploadError(file, 'Exceed max file size!');

			else if ( this.options.existingFiles.contains(file.name) )
				this.uploadError(file, 'Exceed max file size!');

			else {
				this.startFileUpload(file);
			}

			this.updateCounter();
		}
	},

	startFileUpload: function(file) {
		var Request = new XMLHttpRequest();

		var self = this;
		Request.onload = function() {
			this.status == 200 ? self.parseResponse(file, this.responseText) : self.uploadError(file, this.statusText);
		};

		Request.onerror = function(event) {
			self.uploadError(file, 'Http response status: ' + this.status);
		};

		Request.upload.onprogress = function(pEvent) {
			pEvent.lengthComputable && self.updateProgress(file, pEvent.total, pEvent.loaded);
		}.bind(this);

		this._progresses[file.name].request = Request;

		Request.open('POST', this.options.uploadUrl);

		var data = new FormData();
		data.append(this.options.inputname, file);
		if ( typeof this.options.createRequestData == 'function' )
			data = this.options.createRequestData(data);

		Request.send(data)

		this._progresses[file.name].bar.setStatus(null, 'info');
	},

	parseResponse: function(file, response) {
		var res;
		try {
			res = JSON.decode(response);
		} catch (e) {
			this.uploadError(file, 'Could not parse server response: ' + response);
			return;
		}

		var t = typeOf(res);
		if (t == 'object') {
			if (res.error != null) {
				this.uploadError(file, 'Server error: ' + res.error);
			} else {
				this.uploadSucces(file);
			}
		} else {
			this.uploadError(file, 'Invalid server response! Server returned "' + t + '", Object expected!');
		}

		if ( this._inprogress == 0 )
			this.fireEvent('queueComplete');
	},

	uploadSucces: function(file, response) {
		this.updateProgress(file, file.size, file.size);
		this._progresses[file.name].bar.setStatus(null, 'success');
		delete this._progresses[file.name];

		this._inprogress--;
		this._success++;
		this.updateCounter();
	},

	updateProgress: function(file, total, loaded) {
		var p = loaded * 100 / total;
		this._progresses[file.name].bar.setPercent(p, loaded);
		//this.cancelFile(file);
	},

	cancelFile: function(file) {
		var prog = this._progresses[file.name];
		prog.request.abort();
		this.uploadError(file, 'Abort');
	},

	uploadError: function(file, error) {
		this._progresses[file.name].bar.setStatus('Error: ' + error, 'danger');
		delete this._progresses[file.name];

		this._inprogress--;
		this._error++;
		this.updateCounter();
	},

	cancelAll: function() {
		var anyProgressing = false;
		for ( var i in this._progresses ) {
			if ( !this._progresses.hasOwnProperty(i) )
				continue;

			this.cancelFile(this._progresses[i].file);
			anyProgressing = true;
		}

		if ( anyProgressing )
			this.fireEvent('queueComplete');
	},

	reset: function() {
		this._total = 0;
		this._inprogress = 0;
		this._error = 0;
		this._success = 0;

		this._progresses = {};

		this._ui.progress.empty();
		this.updateCounter();
	},

	ProgressBar: new Class({
		Extends: gx.ui.Container,
		options: {

		},

		_states: [
			'info',
			'success',
			'danger'
		],

		initialize: function(fileUploader, file, options) {
			this.parent(null, options);
			this._fileUploader = fileUploader;

			this._ui.root.addClass('alert alert-info');

			this._total = parseFloat(parseInt(file.size) / (1024 * 1024)).toFixed(3);

			this._ui.name   = new Element('div', {

			});
			this._ui.title  = new Element('strong', {
				'html': file.name
			});
			this._ui.cancel = __({
				'tag'     : 'button',
				'style'   : 'float: right;',
				'class'   : 'btn btn-mini btn-danger',
				'html'    : '<i class="icon-white icon-remove"></i>'
			});
			this._ui.cancel.addEvent('click', function() {
				fileUploader.cancelFile(file);

			});

			this._ui.status = new Element('div', {
				'class': 'clear',
				'html' : '&nbsp;'
			});
			this._ui.text = new Element('div', {
				'class': 'a_c',
				'style': 'margin-bottom: -20px; color: black;',
				'html' : '&nbsp;'
			});
			this._ui.progress = new Element('div', {
				'class': 'progress progress-striped active'
			});
			this._ui.bar = new Element('div.bar', {
				'styles': {
					'width': '1%'
				}
			});

			this._ui.name.adopt(this._ui.title, this._ui.cancel);
			this._ui.root.adopt([this._ui.name, this._ui.status, this._ui.text, this._ui.progress.adopt(this._ui.bar)]);
		},

		setPercent: function(p, current, total) {
			this._current = parseFloat(parseInt(current) / (1024 * 1024)).toFixed(3);
			this._ui.bar.setStyle('width', p + '%');

			this._ui.text.set('html', this._current + ' / ' + this._total + ' (' + parseFloat(p).toFixed(2) + '%)')
		},

		setStatus: function(text, type) {
			for ( var i = 0; i < this._states.length; i++ ) {
				this._ui.progress.removeClass('progress-' + this._states[i]);
				this._ui.root.removeClass('alert-' + this._states[i]);
			}

			if ( type == 'danger' || type == 'success' )
				this._ui.progress.removeClass('active');
			else
				this._ui.progress.addClass('active');

			this._ui.progress.addClass('progress-' + type);
			this._ui.root.addClass('alert-' + type);
			if ( text != null && text != '' )
				this._ui.status.set('html', text);
			else
				this._ui.status.set('html', '&nbsp;');
		}
	})
});
