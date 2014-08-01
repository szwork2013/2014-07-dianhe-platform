var wlcJS = new (function () {
	window.l = window.console.log.bind(window.console);
	window.w = window.console.warn.bind(window.console);
	window.e = window.console.error.bind(window.console);
	_l = window.console.log.bind(window.console);
	_w = window.console.warn.bind(window.console);
	_e = window.console.error.bind(window.console);
	this.dom = new WLC_DOM();


	Number.prototype.format = function (in_n, in_sp) {

		// n: every Nth digi
		// sp: separator

		var n = (typeof in_n !== 'number' || Math.round(in_n) <= 0) ? in_n : 3;
		var sp = in_sp ? in_sp : ',';
		var source = this.toString();
		var result = '';


		var signPos = Math.max(0, source.indexOf('-') + 1, source.indexOf('+') + 1);
		var sign = source.slice(0, signPos);
		if (sign == '+') sign = '';

		var dotPos = source.indexOf('.');

		var str_restPart = '';
		if (dotPos === -1) {
			dotPos = source.length;
		} else {
			str_restPart = source.slice(dotPos, source.length);
		}

		if (dotPos === source.length - 1) {
			str_restPart = '.0';
			// str_restPart = '';
		}

		var str_unsignedInteger = '';
		if (dotPos === signPos) {
			str_unsignedInteger = '0';
		} else {
			str_unsignedInteger = source.slice(signPos, dotPos);
		}

		if (str_unsignedInteger === 0) sign = '';

		var uintLength = str_unsignedInteger.length;
		var firstPos = uintLength % n;
		if (firstPos === 0) firstPos = n;

		var pos1 = 0;
		var pos2 = firstPos;
		result = sign + str_unsignedInteger.slice(pos1, pos2);

		while (pos2 < uintLength) {
			pos1 = pos2;
			pos2 += n;
			result += sp + str_unsignedInteger.slice(pos1, pos2);
		}

		result += str_restPart;

		return result;
	}

	Number.prototype.padding = function (in_minDigisCount) {
		if (isNaN(in_minDigisCount)) {
			e('Invalid input for digits count: use an integer instead.');
			return false;
		}
		var _maxDigitsCount = 50;
		var minDigisCount = Math.min(_maxDigitsCount, in_minDigisCount);
		if (in_minDigisCount>_maxDigitsCount) {
			_w('Too large value for digits count: trunced to '+_maxDigitsCount+'.');
		}
		var value = Number(this);
		var absValue = Math.abs(value);
		var sign = value === absValue ? '' : '-';
		var abs = absValue.toString();
		var zerosCount = Math.max(0, minDigisCount - abs.length);
		for (var i = 0; i < zerosCount; i++) {
			abs = '0' + abs;
		}

		return sign + abs;
	}

	Math.randomBetween = function ( in_a, in_b ) {
		var a = isNaN(Number(in_a)) ? 0 : in_a;
		var b = isNaN(Number(in_b)) ? 1 : in_b;
		return ( Math.random()*(b - a) + a);
	}

	Math.randomAround = function ( in_center, in_radius ) {
		var a = isNaN(Number(in_center)) ? 0 : in_center;
		var b = isNaN(Number(in_radius)) ? 0.5 : in_radius;
		return ( (Math.random()-0.5)*2*in_radius + in_center);
	}

	Math.remapDegreeInto_0_360 = function ( in_degree ) {
		var turns = Math.floor(in_degree / 360);
		return in_degree - 360* turns;
	}


	Object.defineProperty(String.prototype, 'E', { // E means Empty
		get: function () { return this.length === 0; }
	});

	Object.defineProperty(String.prototype, 'NE', { // NE means Not Empty
		get: function () { return this.length > 0; }
	});

	String.prototype.randomizeUrl = function (in_allowed) {
		if (!in_allowed) return String(this);
		return this + ((this.indexOf('?')>=0) ? '&' : '?') + 'wRandom=' + Math.round( Math.random() * 100000 );
	}



	function WLC_DOM() {

		window.doc = document;				// doc or window.doc
		this.doc = document;				// dom.doc

		window.head = document.head;		// head or window.head
		this.head = document.head;			// dom.head

		window.body = document.body;		// body or window.body
		this.body = document.body;			// dom.body

		window.id = function (in_htmlId) {
			return document.getElementById(in_htmlId);
		}

		this.isDomNode = _isDomNode;
		this.isDomElement = _isDomElement;
		this.isDom = _isDom;

		function _isDomNode (o){
			// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
			// Returns true if it is a DOM node
			return (
				typeof Node === "object" ? o instanceof Node : 
				o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
			);
		}

		function _isDomElement (o){
			// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
			// Returns true if it is a DOM element    
			return (
				typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
			);
		}

		function _isDom (o) {
			return _isDomNode(o) || _isDomElement(o);
		}

		function _addDom ( tagName, classNames, id, uri ) {

			if (window.id(id)) {
				w('Element of id ['+id+'] already exists!');
			}

			_tagName = tagName ? tagName : 'div';

			var dom_new = null;
			switch (_tagName) {
				case 'text':
				case 'textNode':
					dom_new = document.createTextNode(arguments[1]);
					break;

				case 'comment':
					break;

				default:
					dom_new = document.createElement(_tagName);
			}

			if (id) dom_new.id = id;
			if (classNames) dom_new.className = classNames;

			if (_tagName === 'script') {
				// dom_new.type = 'text/javascript';
			}

			if (_tagName === 'link') {
				// dom_new.type = 'text/css';
				dom_new.rel = 'stylesheet';
			}

			if (uri) {
				switch (_tagName) {
					case 'script':
					case 'img':
						dom_new.src = uri;
					case 'a':
					case 'link':
					case 'css':
						dom_new.href = uri;
				}
			}

			return dom_new;
		}

		window.add = _addDom;
		document.add = _addDom;

		window.isDomNode = _isDomNode;
		window.isDomElement = _isDomElement;
		window.isDom = _isDom;
		this.PopupWindow = PopupWindow;

		Element.prototype.take = function ( dom ) {
			this.appendChild( dom );
			return this;
		}

		Element.prototype.add = function ( tagName, classNames, id, uri ) {
			var dom_new = _addDom( tagName, classNames, id, uri )
			this.take(dom_new);
			return dom_new;
		}

		Element.prototype.die = function () {
			this.parentNode.removeChild(this);
		}

		Element.prototype.isChildOf = function (in_dom_pseudoParentNode, in_recursive) {
			var recursive = !in_recursive ? false : true;
			var isChild = false;

			var arr_dom_allChildren = in_dom_pseudoParentNode.childNodes;
			if (recursive) {
				arr_dom_allChildren = in_dom_pseudoParentNode.querySelectorAll('*');
			}

			for (var i = 0; i < arr_dom_allChildren.length; i++) {
				if (isChild = this === arr_dom_allChildren[i]) break;
			}

			return isChild;
		}

		Element.prototype.centerTo = function ( inDomRef, inAllowX, inAllowY, inOffsetX, inOffsetY ) {
			// inDomRef being set to any thing other than
			//	1) window or
			//	2) nearest parentNode whose position is among 'relative', 'absolute' and 'fixed'
			// is NOT implemented yet.

			// inDomRef: default = window;
			// inAllowX: default = true;
			// inAllowY: default = true;
			// inOffsetX: default = 0;
			// inOffsetY: default = 0;

			// so document.getElementById('myElement').centerTo() means 'myElement' center to Window in both X and Y axes.

			var computedStyle = window.getComputedStyle(this,null);
			if (computedStyle.position === 'static') {
				w(this, '\nThe element is about to be centered, but it\'s "position" attribute is set to "static".' );
			}

			var domRef = (inDomRef && inDomRef!==document && inDomRef!==document.body) ? inDomRef : window;
			var marginsMin = thisApp.popupWindows.settings;
			var allowX = (typeof inAllowX === 'undefined' || inAllowX === null) ? true : inAllowX;
			var allowY = (typeof inAllowY === 'undefined' || inAllowY === null) ? true : inAllowY;

			if (allowX) {
				var selfWidth = parseInt( computedStyle.width );
				if (typeof this.computedWidthBeforeCenterTo === 'undefined') {
					this.computedWidthBeforeCenterTo = selfWidth;
					this.computedWidthComesFromInlineDefinition = this.style.width.NE;
				} else {
					// always try to use original value
					selfWidth = this.computedWidthBeforeCenterTo;
				}

				var refWidth = (domRef === window) ? domRef.innerWidth : domRef.clientWidth;
				var maxAllowedWidth = refWidth - marginsMin.marginLeftMin - marginsMin.marginRightMin;

				var forcedOffsetX = (typeof inOffsetX === 'undefined' || inOffsetX === null) ? 0 : inOffsetX;

				if ( selfWidth>maxAllowedWidth ) {
					this.style.width = maxAllowedWidth + 'px';
					selfWidth = maxAllowedWidth;
				} else {
					//restore original settings
					if (this.computedWidthBeforeCenterTo) {
						this.style.width = this.computedWidthComesFromInlineDefinition ? this.computedWidthBeforeCenterTo+'px' : '';
					}
				}

				var left = (maxAllowedWidth - selfWidth) / 2 + marginsMin.marginLeftMin + forcedOffsetX;
				this.style.left = left + 'px';
			}

			if (allowY) {
				var selfHeight = parseInt( computedStyle.height );
				if (typeof this.computedHeightBeforeCenterTo === 'undefined') {
					this.computedHeightBeforeCenterTo = selfHeight;
					this.computedHeightComesFromInlineDefinition = this.style.height.NE;
				} else {
					// always try to use original value
					selfHeight = this.computedHeightBeforeCenterTo;
				}

				var refHeight = (domRef === window) ? domRef.innerHeight : domRef.clientHeight;
				var maxAllowedHeight = refHeight - marginsMin.marginTopMin - marginsMin.marginBottomMin;

				var forcedOffsetY = (typeof inOffsetY === 'undefined' || inOffsetY === null) ? 0 : inOffsetY;

				if ( selfHeight>maxAllowedHeight ) {
					this.style.height = maxAllowedHeight + 'px';
					selfHeight = maxAllowedHeight;
				} else {
					//restore original settings
					if (this.computedHeightBeforeCenterTo) {
						this.style.height = this.computedHeightComesFromInlineDefinition ? this.computedHeightBeforeCenterTo+'px' : '';
					}
				}

				var top = (maxAllowedHeight - selfHeight) / 2 + marginsMin.marginTopMin + forcedOffsetY;
				this.style.top = top + 'px';
			}

			return {width: selfWidth, height: selfHeight, left: left, top: top};
		}


	    Object.defineProperty(Element.prototype, 'realStyle', {
	    	get: function () { return window.getComputedStyle(this, null); }
	    });

	    Object.defineProperty(Element.prototype, 'cssMatrix', {
	    	get: function () {
		        var oStyle = this.realStyle;
				var cssMatrixString = '';
				var cssMatrix = null;

		        if (cssMatrixString.E && oStyle['transform'])            cssMatrixString = oStyle['transform'];
		        if (cssMatrixString.E && oStyle['-webkit-transform'])    cssMatrixString = oStyle['-webkit-transform'];
		        if (cssMatrixString.E && oStyle['-moz-transform'])       cssMatrixString = oStyle['-moz-transform'];

		        eval( 'var cssMatrix = [' + cssMatrixString.slice( 'matrix('.length, -1 ) + '];' );
		        return cssMatrix;
	    	}
	    });

	    Object.defineProperty(Element.prototype, 'realWidth', {
	    	get: function () { return this.realStyle.width; }
	    });

	    Object.defineProperty(Element.prototype, 'realHeight', {
	    	get: function () { return this.realStyle.height; }
	    });

	    Object.defineProperty(Element.prototype, 'realLeft', {
	    	get: function () { return this.realStyle.left; }
	    });

	    Object.defineProperty(Element.prototype, 'realTop', {
	    	get: function () { return this.realStyle.top; }
	    });

	    Object.defineProperty(Element.prototype, 'real2DRotationAngle', {
	    	get: function () {
	    		var cssMatrix = this.cssMatrix;
		        var angle = Math.atan2( cssMatrix[0], cssMatrix[1] )/Math.PI* -180 + 90;
		        angle = angle<0 ? angle+360 : angle;
		        return angle;
	    	}
	    });

	    Element.prototype.rotateAngle2D = function ( cssMatrix ) {

	    }



		function PopupWindow ( in_domWindow, in_settings ) {

			_thisWindow = this;
			_domThisWindow = null;
			_domButtonsWhoShowMe = [];
			_domButtonsWhoHideMe = [];
			_domButtonsWhoToggleMe = [];

			_centerToWindow = true;
			_offsetX = 0;
			_offsetY = 0;
			
			_showingDuration_mm = 800;
			_closingDuration_mm = 800;

			_doesAutoDisappear = false;
			_autoDisappearDelayDuration_mm = 1500;

			this.domWindowShow = function () {
				// console.log('original domWindowShow();', this);
				this.style.display = '';
			}

			this.domWindowHide = function () {
				// console.log('original domWindowHide();', this);
				this.style.display = 'none';
			}

			this.domUpdateWindowContent = function (inContentHtml) {
				// console.log('original domUpdateWindowContent();', this);
				this.innerHTML = inContentHtml;
			}

			this.refresh = function () {
			}

			Object.defineProperty(this, 'dom', {
				get: function () { return _domThisWindow; },
				set: function (in_domWindow) {
					if ( typeof in_domWindow.style === 'undefined' || typeof in_domWindow.style.backgroundImage !== 'string' ) {
						e( 'Invalid dom for a {PopupWindow} Object.' );
						return;
					}
					_domThisWindow = in_domWindow;
					this.refresh();
				}
			});

			Object.defineProperty(this, 'domButtonsWhoShowMe', {
				get: function () { return _domButtonsWhoShowMe; },
				set: function (in_dom_or_domsArray) {

					var addedButtonsCountThisTime = 0;

					if ( typeof in_dom_or_domsArray === 'undefined' || in_dom_or_domsArray === null ) {
						return addedButtonsCountThisTime;
					}

					if (Array.isArray(in_dom_or_domsArray)) {
						var domsArray = in_dom_or_domsArray;
					} else {
						var domsArray = [].push(in_dom_or_domsArray);
					}

					for (var lI_button = 0; lI_button < domsArray.length; lI_button++) {
						var domButton = domsArray[ lI_button ];
						if ( _isDom(domButton) ) {
							_domButtonsWhoShowMe.push( domButton );
							addedButtonsCountThisTime++;
						} else {
							w( 'Invalid dom for a button of a {PopupWindow}. Ignored.' );
							continue;
						}
					};

					return addedButtonsCountThisTime;
				}
			});

			Object.defineProperty(this, 'domButtonsWhoHideMe', {
				get: function () { return _domButtonsWhoHideMe; },
				set: function (in_dom_or_domsArray) {

					var addedButtonsCountThisTime = 0;

					if ( typeof in_dom_or_domsArray === 'undefined' || in_dom_or_domsArray === null ) {
						return addedButtonsCountThisTime;
					}

					if (Array.isArray(in_dom_or_domsArray)) {
						var domsArray = in_dom_or_domsArray;
					} else {
						var domsArray = [].push(in_dom_or_domsArray);
					}

					for (var lI_button = 0; lI_button < domsArray.length; lI_button++) {
						var domButton = domsArray[ lI_button ];
						if ( _isDom(domButton) ) {
							_domButtonsWhoHideMe.push( domButton );
							addedButtonsCountThisTime++;
						} else {
							w( 'Invalid dom for a button of a {PopupWindow}. Ignored.' );
							continue;
						}
					};

					return addedButtonsCountThisTime;
				}
			});

			Object.defineProperty(this, 'domButtonsWhoToggleMe', {
				get: function () { return _domButtonsWhoToggleMe; },
				set: function (in_dom_or_domsArray) {

					var addedButtonsCountThisTime = 0;

					if ( typeof in_dom_or_domsArray === 'undefined' || in_dom_or_domsArray === null ) {
						return addedButtonsCountThisTime;
					}

					if (Array.isArray(in_dom_or_domsArray)) {
						var domsArray = in_dom_or_domsArray;
					} else {
						var domsArray = [].push(in_dom_or_domsArray);
					}

					for (var lI_button = 0; lI_button < domsArray.length; lI_button++) {
						var domButton = domsArray[ lI_button ];
						if ( _isDom(domButton) ) {
							_domButtonsWhoToggleMe.push( domButton );
							addedButtonsCountThisTime++;
						} else {
							w( 'Invalid dom for a button of a {PopupWindow}. Ignored.' );
							continue;
						}
					};

					return addedButtonsCountThisTime;
				}
			});

			(function () {
				this.dom = in_domWindow;
				this.domWindowHide();
			}).apply(this);
		} // CLASS:PopupWindow


	} // Class: WLC_DOM ()

}); // new operator
