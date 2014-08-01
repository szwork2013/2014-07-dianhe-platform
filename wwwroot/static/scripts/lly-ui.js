function LLYUI() { var _llyUI = this; }
var llyUI = new LLYUI;


LLYUI.prototype.Basic = {
	newInput: function (options) {
		// 	options = {
		//		type:		string,		default = 'text';
		//		required:	boolean, 	default = false;
		//		checked:	boolean,	default = false;
		//		name:		string,		default = '';
		//		id:			string,		default = '';
		//		classNames:	string,		default = '';
		//		value:		string,		default = '';
		//		label:		string,		default = '';
		//	}

		var _ = options ? options : {};


		if (!_.type)
			_.type = 'text'
		else
			_.type = String(_.type).toLowerCase();

		if (!_.classNames) _.classNames = '';
		if (!_.value) _.value = '';
		if (!_.name) _.name = '';
		// if (!_.id) _.id = _.name ? _.name : '';
		if (!_.id) _.id = '';


		_.required = !!_.required	|| _.type === 'password';
		_.checked = !!_.checked		&& _.type != 'radio'	&& _.type != 'checkbox';


		// if (_.required) _.value = '';
		if (!_.name) w('No name for input [type="'+_.type+'"] element.');
		if (!_.id) w('No  ID  for input [type="'+_.type+'"] element, or the <label> won\'t be able to serve it.');

		return [
			'<input type="'+_.type+'"',
				_.required ?	' required'					: '',
				_.checked ?		' checked'					: '',
				_.name ?		' name="'+_.name+'"'		: '',
				_.value ?		' value="'+_.value+'"'		: '',
				_.id ?			' id="'+_.id+'"'			: '',
				_.classNames ?	' class="'+_.classNames+'"'	: '',
			'/>'
		].join('');
	},

	newButton: function (options) {
		// 	options = {
		//		name:		string,		default = '';
		//		id:			string,		default = '';
		//		classNames:	string,		default = '';
		//		label:		string,		default = '';
		//	}

		var _ = options ? options : {};


		if (!_.name) _.name = '';
		if (!_.id) _.id = '';
		if (!_.classNames) _.classNames = '';
		if (!_.label) _.label = 'button';


		return [
			'<button ',
				_.name ?		' name="'+_.name+'"'		: '',
				_.id ?			' id="'+_.id+'"'			: '',
				_.classNames ?	' class="'+_.classNames+'"'	: '',
			'>',
				_.label,
			'</button>'
		].join('');
	}
}



LLYUI.prototype.FormList = function (dom, options) {
	// 	options = {
	//		id:			string, default = '';
	//		name:		string, default = '';
	//		method:		string, default = '';
	//		action:		string, default = '';
	//		target:		string, default = '';
	// 	}

	var _formList = this;

	if (!wlcJS.dom.isDom(dom)) {
		e('Invalid dom for formList!');
		return false;
	}

	if (dom.tagName.toLowerCase() === 'form') {
		this.dom = dom;
	} else {
		this.dom = dom.add('form');
	}

	var _ = options ? options : {};

	if (_.id)		this.dom.id		= _.id;
	if (_.name)		this.dom.name	= _.name;
	if (_.method)	this.dom.method	= _.method;
	if (_.action)	this.dom.action	= _.action;
	if (_.target)	this.dom.target	= _.target;





	this.addRow = function (options) {
		// 	options = {
		//		classNames:	string, default = '';
		//		col1Html:	string, default = '';
		//		col2Html:	string, default = '';
		//		info: [
		//			/* arrayOfStrings */
		//		];
		//		required: boolean, default = false;
		// 	}

		var _ = options ? options : {};
		_.required = !!_.required;

		if (!_.classNames) { _.classNames = ''; }
		if (!_.col1Html) { _.col1Html = ''; }
		if (!_.col2Html) { _.col2Html = ''; }
		if (!_.info) { _.info = []; }

		var infoHtmlsArray = [];
		for (var i = 0; i < _.info.length; i++) {
			infoHtmlsArray.push('<p class="desc">'+_.info[i]+'</p>');
		}

		_.classNames += _.required ? ((_.classNames ? ' ' : '') + 'required show-hint') : '';
		_.classNames += (_.classNames ? ' ' : '') + 'row';

		var _classString = _.classNames ? (' class="'+_.classNames+'"') : '';

		this.dom.innerHTML += [
			'<div',
				_classString,
			'>',
				'<aside class="col-1">',
					_.col1Html,
				'</aside>',
				'<aside class="col-2">',
					_.col2Html,
					infoHtmlsArray.join(''),
				'</aside>',
			'</div>'
		].join('');

		return true;
	}

	this.addRowInputs = function (options) {
		// 	options = {
		//		legend:				string,		default = '';
		//		inputs: [
		//			{
		//				type:		string,		default = 'text';
		//				required:	boolean,	default = false;
		//				checked:	boolean,	default = false;
		//				name:		string,		default = '';
		//				id:			string,		default = '';
		//				classNames: string,		default = '';
		//				value:		string,		default = '';
		//				label:		string,		default = '';
		//			}
		//		],
		//		info: [
		//			/* arrayOfStrings */
		//		]
		// 	}			
		
		var _ = options ? options : {};

		if (!_.legend)	_.legend	= '';
		if (!_.inputs)	_.inputs	= [];
		if (!_.info)	_.info		= [];



		var _hasRequiredInput = false;
		var _col2Htmls = [];

		for (var i = 0; i < _.inputs.length; i++) {
			var _iO = _.inputs[i];
			
			if (!_iO.type)
				_iO.type = 'text'
			else
				_iO.type = String(_iO.type).toLowerCase();

			if (!_iO.id) _iO.id = '';
			_iO.required = !!_iO.required || _iO.type === 'password';

			if (_iO.required) _hasRequiredInput = true;

			_col2Htmls.push(llyUI.Basic.newInput(_iO));

		};

		var _singleInputAndItHasNoLabel = _.inputs.length === 1 && !_.inputs[0].label 
		var _legendIsLabelOfTheOnlyInput = _singleInputAndItHasNoLabel && _.inputs[0].id.length > 0;

		_.required = _hasRequiredInput;

		var _col1Html = '';
		if (_.legend) {
			_col1Html = _legendIsLabelOfTheOnlyInput ?
					'<label for="'+_.inputs[0].id+'">'+_.legend+'</label>'
				:	_.legend;
		}

		return this.addRow({
			col1Html:	_col1Html,
			col2Html:	_col2Htmls.join(''),
			info:		_.info,
			required:	_.required
		});
	}

	this.addRowButtons = function (options) {
		// 	options = {
		//		legend:				string,		default = '';
		//		buttons: [
		//			{
		//				name:		string,		default = '';
		//				id:			string,		default = '';
		//				classNames: string,		default = '';
		//				label: 		string,		default = 'button';
		//			}
		//		],
		//		info: [
		//			/* arrayOfStrings */
		//		]
		// 	}			
		
		var _ = options ? options : {};

		if (!_.legend)	_.legend	= '';
		if (!_.buttons)	_.buttons	= [];
		if (!_.info)	_.info		= [];

		var _col2Htmls = [];

		for (var i = 0; i < _.buttons.length; i++) {
			if ( typeof _.buttons[i] === 'string' ) {
				_col2Htmls.push(_.buttons[i]);
			} else {
				_col2Htmls.push(llyUI.Basic.newButton(_.buttons[i]));
			}
		};

		var _col1Html = '';
		if (_.legend) _col1Html = _.legend;

		return this.addRow({
			classNames:		'buttons-section',
			col1Html:		_col1Html,
			col2Html:		_col2Htmls.join(''),
			info:			_.info,
			required:		_.required
		});
	}

	this.presets = {

		userName: function (options) {
			// 	options = {
			//		legend:		string, default = '用户名'
			//		name:		string,	default = 'userName';
			//		id:			string,	default = 'input-user-name';
			//		classNames: string,	default = '';
			//		value:		string,	default = '';
			//		info: [
			//			/* arrayOfStrings */
			//		]
			// 	}			

			var _pO = options ? options : {};
			
			if (!_pO.legend) { _pO.legend = '用户名'; }

			var _ = {
				legend: _pO.legend,
				inputs: [
					{
						required:	true,
						type:		'text',
						name:		'userName',
						id:			'input-user-name',
						classNames:	_pO.classNames,
						valu:		_pO.value,
						label:		'',
					}
				],
				info: _pO.info
			}

			return _formList.addRowInputs(_);
		},

		password: function (options) {
			// 	options = {
			//		legend:		string, default = '密码'
			//		name:		string,	default = 'password1';
			//		id:			string,	default = 'input-password1';
			//		classNames: string,	default = '';
			//		value:		string,	default = '';
			//		info: [
			//			/* arrayOfStrings */
			//		]
			// 	}			

			var _pO = options ? options : {};
			
			if (!_pO.legend) { _pO.legend = '密码'; }

			var _ = {
				legend: _pO.legend,
				inputs: [
					{
						required:	true,
						type:		'password',
						name:		'password1',
						id:			'input-password1',
						classNames:	_pO.classNames,
						valu:		_pO.value,
						label:		'',
					}
				],
				info: _pO.info
			}

			return _formList.addRowInputs(_);
		},

		passwords2: function (options) {
			// 	options = {
			//		legend:		string, default = '密码'
			//		name1:		string,	default = 'password1';
			//		name2:		string,	default = 'password2';
			//		id1:		string,	default = 'input-password1';
			//		id2:		string,	default = 'input-password2';
			//		classNames: string,	default = '';
			//		value:		string,	default = '';
			//		info: [
			//			/* arrayOfStrings */
			//		]
			// 	}			

			var _pO = options ? options : {};
			
			if (!_pO.legend) { _pO.legend = '密码'; }

			var _ = {
				legend: _pO.legend,
				inputs: [
					{
						required:	true,
						type:		'password',
						name:		'password1',
						id:			'input-password1',
						classNames:	_pO.classNames,
						valu:		_pO.value,
						label:		'',
					},
					{
						required:	true,
						type:		'password',
						name:		'password2',
						id:			'input-password2',
						classNames:	_pO.classNames,
						valu:		_pO.value,
						label:		'',
					}
				],
				info: _pO.info
			}

			return _formList.addRowInputs(_);
		}
	}
}




LLYUI.prototype.Nav = function (dom, inOptions) {}

