'no use strict';
!(function(e) {
	function t(e, t) {
		var n = e,
			r = '';
		while (n) {
			var i = t[n];
			if (typeof i == 'string') return i + r;
			if (i)
				return (
					i.location.replace(/\/*$/, '/') + (r || i.main || i.name)
				);
			if (i === !1) return '';
			var s = n.lastIndexOf('/');
			if (s === -1) break;
			(r = n.substr(s) + r), (n = n.slice(0, s));
		}
		return e;
	}
	if (typeof e.window != 'undefined' && e.document) return;
	if (e.require && e.define) return;
	e.console ||
		((e.console = function() {
			var e = Array.prototype.slice.call(arguments, 0);
			postMessage({ type: 'log', data: e });
		}),
		(e.console.error = e.console.warn = e.console.log = e.console.trace =
			e.console)),
		(e.window = e),
		(e.ace = e),
		(e.onerror = function(e, t, n, r, i) {
			postMessage({
				type: 'error',
				data: {
					message: e,
					data: i.data,
					file: t,
					line: n,
					col: r,
					stack: i.stack
				}
			});
		}),
		(e.normalizeModule = function(t, n) {
			if (n.indexOf('!') !== -1) {
				var r = n.split('!');
				return (
					e.normalizeModule(t, r[0]) +
					'!' +
					e.normalizeModule(t, r[1])
				);
			}
			if (n.charAt(0) == '.') {
				var i = t
					.split('/')
					.slice(0, -1)
					.join('/');
				n = (i ? i + '/' : '') + n;
				while (n.indexOf('.') !== -1 && s != n) {
					var s = n;
					n = n
						.replace(/^\.\//, '')
						.replace(/\/\.\//, '/')
						.replace(/[^\/]+\/\.\.\//, '');
				}
			}
			return n;
		}),
		(e.require = function(r, i) {
			i || ((i = r), (r = null));
			if (!i.charAt)
				throw new Error(
					'worker.js require() accepts only (parentId, id) as arguments'
				);
			i = e.normalizeModule(r, i);
			var s = e.require.modules[i];
			if (s)
				return (
					s.initialized ||
						((s.initialized = !0),
						(s.exports = s.factory().exports)),
					s.exports
				);
			if (!e.require.tlns) return console.log('unable to load ' + i);
			var o = t(i, e.require.tlns);
			return (
				o.slice(-3) != '.js' && (o += '.js'),
				(e.require.id = i),
				(e.require.modules[i] = {}),
				importScripts(o),
				e.require(r, i)
			);
		}),
		(e.require.modules = {}),
		(e.require.tlns = {}),
		(e.define = function(t, n, r) {
			arguments.length == 2
				? ((r = n),
				  typeof t != 'string' && ((n = t), (t = e.require.id)))
				: arguments.length == 1 &&
				  ((r = t), (n = []), (t = e.require.id));
			if (typeof r != 'function') {
				e.require.modules[t] = { exports: r, initialized: !0 };
				return;
			}
			n.length || (n = ['require', 'exports', 'module']);
			var i = function(n) {
				return e.require(t, n);
			};
			e.require.modules[t] = {
				exports: {},
				factory: function() {
					var e = this,
						t = r.apply(
							this,
							n.map(function(t) {
								switch (t) {
									case 'require':
										return i;
									case 'exports':
										return e.exports;
									case 'module':
										return e;
									default:
										return i(t);
								}
							})
						);
					return t && (e.exports = t), e;
				}
			};
		}),
		(e.define.amd = {}),
		(require.tlns = {}),
		(e.initBaseUrls = function(t) {
			for (var n in t) require.tlns[n] = t[n];
		}),
		(e.initSender = function() {
			var n = e.require('ace/lib/event_emitter').EventEmitter,
				r = e.require('ace/lib/oop'),
				i = function() {};
			return (
				function() {
					r.implement(this, n),
						(this.callback = function(e, t) {
							postMessage({ type: 'call', id: t, data: e });
						}),
						(this.emit = function(e, t) {
							postMessage({ type: 'event', name: e, data: t });
						});
				}.call(i.prototype),
				new i()
			);
		});
	var n = (e.main = null),
		r = (e.sender = null);
	e.onmessage = function(t) {
		var i = t.data;
		if (i.event && r) r._signal(i.event, i.data);
		else if (i.command)
			if (n[i.command]) n[i.command].apply(n, i.args);
			else {
				if (!e[i.command])
					throw new Error('Unknown command:' + i.command);
				e[i.command].apply(e, i.args);
			}
		else if (i.init) {
			e.initBaseUrls(i.tlns),
				require('ace/lib/es5-shim'),
				(r = e.sender = e.initSender());
			var s = require(i.module)[i.classname];
			n = e.main = new s(r);
		}
	};
})(this),
	define('ace/lib/oop', ['require', 'exports', 'module'], function(e, t, n) {
		'use strict';
		(t.inherits = function(e, t) {
			(e.super_ = t),
				(e.prototype = Object.create(t.prototype, {
					constructor: {
						value: e,
						enumerable: !1,
						writable: !0,
						configurable: !0
					}
				}));
		}),
			(t.mixin = function(e, t) {
				for (var n in t) e[n] = t[n];
				return e;
			}),
			(t.implement = function(e, n) {
				t.mixin(e, n);
			});
	}),
	define('ace/range', ['require', 'exports', 'module'], function(e, t, n) {
		'use strict';
		var r = function(e, t) {
				return e.row - t.row || e.column - t.column;
			},
			i = function(e, t, n, r) {
				(this.start = { row: e, column: t }),
					(this.end = { row: n, column: r });
			};
		(function() {
			(this.isEqual = function(e) {
				return (
					this.start.row === e.start.row &&
					this.end.row === e.end.row &&
					this.start.column === e.start.column &&
					this.end.column === e.end.column
				);
			}),
				(this.toString = function() {
					return (
						'Range: [' +
						this.start.row +
						'/' +
						this.start.column +
						'] -> [' +
						this.end.row +
						'/' +
						this.end.column +
						']'
					);
				}),
				(this.contains = function(e, t) {
					return this.compare(e, t) == 0;
				}),
				(this.compareRange = function(e) {
					var t,
						n = e.end,
						r = e.start;
					return (
						(t = this.compare(n.row, n.column)),
						t == 1
							? ((t = this.compare(r.row, r.column)),
							  t == 1 ? 2 : t == 0 ? 1 : 0)
							: t == -1
							? -2
							: ((t = this.compare(r.row, r.column)),
							  t == -1 ? -1 : t == 1 ? 42 : 0)
					);
				}),
				(this.comparePoint = function(e) {
					return this.compare(e.row, e.column);
				}),
				(this.containsRange = function(e) {
					return (
						this.comparePoint(e.start) == 0 &&
						this.comparePoint(e.end) == 0
					);
				}),
				(this.intersects = function(e) {
					var t = this.compareRange(e);
					return t == -1 || t == 0 || t == 1;
				}),
				(this.isEnd = function(e, t) {
					return this.end.row == e && this.end.column == t;
				}),
				(this.isStart = function(e, t) {
					return this.start.row == e && this.start.column == t;
				}),
				(this.setStart = function(e, t) {
					typeof e == 'object'
						? ((this.start.column = e.column),
						  (this.start.row = e.row))
						: ((this.start.row = e), (this.start.column = t));
				}),
				(this.setEnd = function(e, t) {
					typeof e == 'object'
						? ((this.end.column = e.column), (this.end.row = e.row))
						: ((this.end.row = e), (this.end.column = t));
				}),
				(this.inside = function(e, t) {
					return this.compare(e, t) == 0
						? this.isEnd(e, t) || this.isStart(e, t)
							? !1
							: !0
						: !1;
				}),
				(this.insideStart = function(e, t) {
					return this.compare(e, t) == 0
						? this.isEnd(e, t)
							? !1
							: !0
						: !1;
				}),
				(this.insideEnd = function(e, t) {
					return this.compare(e, t) == 0
						? this.isStart(e, t)
							? !1
							: !0
						: !1;
				}),
				(this.compare = function(e, t) {
					return !this.isMultiLine() && e === this.start.row
						? t < this.start.column
							? -1
							: t > this.end.column
							? 1
							: 0
						: e < this.start.row
						? -1
						: e > this.end.row
						? 1
						: this.start.row === e
						? t >= this.start.column
							? 0
							: -1
						: this.end.row === e
						? t <= this.end.column
							? 0
							: 1
						: 0;
				}),
				(this.compareStart = function(e, t) {
					return this.start.row == e && this.start.column == t
						? -1
						: this.compare(e, t);
				}),
				(this.compareEnd = function(e, t) {
					return this.end.row == e && this.end.column == t
						? 1
						: this.compare(e, t);
				}),
				(this.compareInside = function(e, t) {
					return this.end.row == e && this.end.column == t
						? 1
						: this.start.row == e && this.start.column == t
						? -1
						: this.compare(e, t);
				}),
				(this.clipRows = function(e, t) {
					if (this.end.row > t) var n = { row: t + 1, column: 0 };
					else if (this.end.row < e) var n = { row: e, column: 0 };
					if (this.start.row > t) var r = { row: t + 1, column: 0 };
					else if (this.start.row < e) var r = { row: e, column: 0 };
					return i.fromPoints(r || this.start, n || this.end);
				}),
				(this.extend = function(e, t) {
					var n = this.compare(e, t);
					if (n == 0) return this;
					if (n == -1) var r = { row: e, column: t };
					else var s = { row: e, column: t };
					return i.fromPoints(r || this.start, s || this.end);
				}),
				(this.isEmpty = function() {
					return (
						this.start.row === this.end.row &&
						this.start.column === this.end.column
					);
				}),
				(this.isMultiLine = function() {
					return this.start.row !== this.end.row;
				}),
				(this.clone = function() {
					return i.fromPoints(this.start, this.end);
				}),
				(this.collapseRows = function() {
					return this.end.column == 0
						? new i(
								this.start.row,
								0,
								Math.max(this.start.row, this.end.row - 1),
								0
						  )
						: new i(this.start.row, 0, this.end.row, 0);
				}),
				(this.toScreenRange = function(e) {
					var t = e.documentToScreenPosition(this.start),
						n = e.documentToScreenPosition(this.end);
					return new i(t.row, t.column, n.row, n.column);
				}),
				(this.moveBy = function(e, t) {
					(this.start.row += e),
						(this.start.column += t),
						(this.end.row += e),
						(this.end.column += t);
				});
		}.call(i.prototype),
			(i.fromPoints = function(e, t) {
				return new i(e.row, e.column, t.row, t.column);
			}),
			(i.comparePoints = r),
			(i.comparePoints = function(e, t) {
				return e.row - t.row || e.column - t.column;
			}),
			(t.Range = i));
	}),
	define('ace/apply_delta', ['require', 'exports', 'module'], function(
		e,
		t,
		n
	) {
		'use strict';
		function r(e, t) {
			throw (console.log('Invalid Delta:', e), 'Invalid Delta: ' + t);
		}
		function i(e, t) {
			return (
				t.row >= 0 &&
				t.row < e.length &&
				t.column >= 0 &&
				t.column <= e[t.row].length
			);
		}
		function s(e, t) {
			t.action != 'insert' &&
				t.action != 'remove' &&
				r(t, "delta.action must be 'insert' or 'remove'"),
				t.lines instanceof Array ||
					r(t, 'delta.lines must be an Array'),
				(!t.start || !t.end) &&
					r(t, 'delta.start/end must be an present');
			var n = t.start;
			i(e, t.start) || r(t, 'delta.start must be contained in document');
			var s = t.end;
			t.action == 'remove' &&
				!i(e, s) &&
				r(
					t,
					"delta.end must contained in document for 'remove' actions"
				);
			var o = s.row - n.row,
				u = s.column - (o == 0 ? n.column : 0);
			(o != t.lines.length - 1 || t.lines[o].length != u) &&
				r(t, 'delta.range must match delta lines');
		}
		t.applyDelta = function(e, t, n) {
			var r = t.start.row,
				i = t.start.column,
				s = e[r] || '';
			switch (t.action) {
				case 'insert':
					var o = t.lines;
					if (o.length === 1)
						e[r] = s.substring(0, i) + t.lines[0] + s.substring(i);
					else {
						var u = [r, 1].concat(t.lines);
						e.splice.apply(e, u),
							(e[r] = s.substring(0, i) + e[r]),
							(e[r + t.lines.length - 1] += s.substring(i));
					}
					break;
				case 'remove':
					var a = t.end.column,
						f = t.end.row;
					r === f
						? (e[r] = s.substring(0, i) + s.substring(a))
						: e.splice(
								r,
								f - r + 1,
								s.substring(0, i) + e[f].substring(a)
						  );
			}
		};
	}),
	define('ace/lib/event_emitter', ['require', 'exports', 'module'], function(
		e,
		t,
		n
	) {
		'use strict';
		var r = {},
			i = function() {
				this.propagationStopped = !0;
			},
			s = function() {
				this.defaultPrevented = !0;
			};
		(r._emit = r._dispatchEvent = function(e, t) {
			this._eventRegistry || (this._eventRegistry = {}),
				this._defaultHandlers || (this._defaultHandlers = {});
			var n = this._eventRegistry[e] || [],
				r = this._defaultHandlers[e];
			if (!n.length && !r) return;
			if (typeof t != 'object' || !t) t = {};
			t.type || (t.type = e),
				t.stopPropagation || (t.stopPropagation = i),
				t.preventDefault || (t.preventDefault = s),
				(n = n.slice());
			for (var o = 0; o < n.length; o++) {
				n[o](t, this);
				if (t.propagationStopped) break;
			}
			if (r && !t.defaultPrevented) return r(t, this);
		}),
			(r._signal = function(e, t) {
				var n = (this._eventRegistry || {})[e];
				if (!n) return;
				n = n.slice();
				for (var r = 0; r < n.length; r++) n[r](t, this);
			}),
			(r.once = function(e, t) {
				var n = this;
				t &&
					this.addEventListener(e, function r() {
						n.removeEventListener(e, r), t.apply(null, arguments);
					});
			}),
			(r.setDefaultHandler = function(e, t) {
				var n = this._defaultHandlers;
				n || (n = this._defaultHandlers = { _disabled_: {} });
				if (n[e]) {
					var r = n[e],
						i = n._disabled_[e];
					i || (n._disabled_[e] = i = []), i.push(r);
					var s = i.indexOf(t);
					s != -1 && i.splice(s, 1);
				}
				n[e] = t;
			}),
			(r.removeDefaultHandler = function(e, t) {
				var n = this._defaultHandlers;
				if (!n) return;
				var r = n._disabled_[e];
				if (n[e] == t) {
					var i = n[e];
					r && this.setDefaultHandler(e, r.pop());
				} else if (r) {
					var s = r.indexOf(t);
					s != -1 && r.splice(s, 1);
				}
			}),
			(r.on = r.addEventListener = function(e, t, n) {
				this._eventRegistry = this._eventRegistry || {};
				var r = this._eventRegistry[e];
				return (
					r || (r = this._eventRegistry[e] = []),
					r.indexOf(t) == -1 && r[n ? 'unshift' : 'push'](t),
					t
				);
			}),
			(r.off = r.removeListener = r.removeEventListener = function(e, t) {
				this._eventRegistry = this._eventRegistry || {};
				var n = this._eventRegistry[e];
				if (!n) return;
				var r = n.indexOf(t);
				r !== -1 && n.splice(r, 1);
			}),
			(r.removeAllListeners = function(e) {
				this._eventRegistry && (this._eventRegistry[e] = []);
			}),
			(t.EventEmitter = r);
	}),
	define('ace/anchor', [
		'require',
		'exports',
		'module',
		'ace/lib/oop',
		'ace/lib/event_emitter'
	], function(e, t, n) {
		'use strict';
		var r = e('./lib/oop'),
			i = e('./lib/event_emitter').EventEmitter,
			s = (t.Anchor = function(e, t, n) {
				(this.$onChange = this.onChange.bind(this)),
					this.attach(e),
					typeof n == 'undefined'
						? this.setPosition(t.row, t.column)
						: this.setPosition(t, n);
			});
		(function() {
			function e(e, t, n) {
				var r = n ? e.column <= t.column : e.column < t.column;
				return e.row < t.row || (e.row == t.row && r);
			}
			function t(t, n, r) {
				var i = t.action == 'insert',
					s = (i ? 1 : -1) * (t.end.row - t.start.row),
					o = (i ? 1 : -1) * (t.end.column - t.start.column),
					u = t.start,
					a = i ? u : t.end;
				return e(n, u, r)
					? { row: n.row, column: n.column }
					: e(a, n, !r)
					? {
							row: n.row + s,
							column: n.column + (n.row == a.row ? o : 0)
					  }
					: { row: u.row, column: u.column };
			}
			r.implement(this, i),
				(this.getPosition = function() {
					return this.$clipPositionToDocument(this.row, this.column);
				}),
				(this.getDocument = function() {
					return this.document;
				}),
				(this.$insertRight = !1),
				(this.onChange = function(e) {
					if (e.start.row == e.end.row && e.start.row != this.row)
						return;
					if (e.start.row > this.row) return;
					var n = t(
						e,
						{ row: this.row, column: this.column },
						this.$insertRight
					);
					this.setPosition(n.row, n.column, !0);
				}),
				(this.setPosition = function(e, t, n) {
					var r;
					n
						? (r = { row: e, column: t })
						: (r = this.$clipPositionToDocument(e, t));
					if (this.row == r.row && this.column == r.column) return;
					var i = { row: this.row, column: this.column };
					(this.row = r.row),
						(this.column = r.column),
						this._signal('change', { old: i, value: r });
				}),
				(this.detach = function() {
					this.document.removeEventListener('change', this.$onChange);
				}),
				(this.attach = function(e) {
					(this.document = e || this.document),
						this.document.on('change', this.$onChange);
				}),
				(this.$clipPositionToDocument = function(e, t) {
					var n = {};
					return (
						e >= this.document.getLength()
							? ((n.row = Math.max(
									0,
									this.document.getLength() - 1
							  )),
							  (n.column = this.document.getLine(n.row).length))
							: e < 0
							? ((n.row = 0), (n.column = 0))
							: ((n.row = e),
							  (n.column = Math.min(
									this.document.getLine(n.row).length,
									Math.max(0, t)
							  ))),
						t < 0 && (n.column = 0),
						n
					);
				});
		}.call(s.prototype));
	}),
	define('ace/document', [
		'require',
		'exports',
		'module',
		'ace/lib/oop',
		'ace/apply_delta',
		'ace/lib/event_emitter',
		'ace/range',
		'ace/anchor'
	], function(e, t, n) {
		'use strict';
		var r = e('./lib/oop'),
			i = e('./apply_delta').applyDelta,
			s = e('./lib/event_emitter').EventEmitter,
			o = e('./range').Range,
			u = e('./anchor').Anchor,
			a = function(e) {
				(this.$lines = ['']),
					e.length === 0
						? (this.$lines = [''])
						: Array.isArray(e)
						? this.insertMergedLines({ row: 0, column: 0 }, e)
						: this.insert({ row: 0, column: 0 }, e);
			};
		(function() {
			r.implement(this, s),
				(this.setValue = function(e) {
					var t = this.getLength() - 1;
					this.remove(new o(0, 0, t, this.getLine(t).length)),
						this.insert({ row: 0, column: 0 }, e);
				}),
				(this.getValue = function() {
					return this.getAllLines().join(this.getNewLineCharacter());
				}),
				(this.createAnchor = function(e, t) {
					return new u(this, e, t);
				}),
				'aaa'.split(/a/).length === 0
					? (this.$split = function(e) {
							return e.replace(/\r\n|\r/g, '\n').split('\n');
					  })
					: (this.$split = function(e) {
							return e.split(/\r\n|\r|\n/);
					  }),
				(this.$detectNewLine = function(e) {
					var t = e.match(/^.*?(\r\n|\r|\n)/m);
					(this.$autoNewLine = t ? t[1] : '\n'),
						this._signal('changeNewLineMode');
				}),
				(this.getNewLineCharacter = function() {
					switch (this.$newLineMode) {
						case 'windows':
							return '\r\n';
						case 'unix':
							return '\n';
						default:
							return this.$autoNewLine || '\n';
					}
				}),
				(this.$autoNewLine = ''),
				(this.$newLineMode = 'auto'),
				(this.setNewLineMode = function(e) {
					if (this.$newLineMode === e) return;
					(this.$newLineMode = e), this._signal('changeNewLineMode');
				}),
				(this.getNewLineMode = function() {
					return this.$newLineMode;
				}),
				(this.isNewLine = function(e) {
					return e == '\r\n' || e == '\r' || e == '\n';
				}),
				(this.getLine = function(e) {
					return this.$lines[e] || '';
				}),
				(this.getLines = function(e, t) {
					return this.$lines.slice(e, t + 1);
				}),
				(this.getAllLines = function() {
					return this.getLines(0, this.getLength());
				}),
				(this.getLength = function() {
					return this.$lines.length;
				}),
				(this.getTextRange = function(e) {
					return this.getLinesForRange(e).join(
						this.getNewLineCharacter()
					);
				}),
				(this.getLinesForRange = function(e) {
					var t;
					if (e.start.row === e.end.row)
						t = [
							this.getLine(e.start.row).substring(
								e.start.column,
								e.end.column
							)
						];
					else {
						(t = this.getLines(e.start.row, e.end.row)),
							(t[0] = (t[0] || '').substring(e.start.column));
						var n = t.length - 1;
						e.end.row - e.start.row == n &&
							(t[n] = t[n].substring(0, e.end.column));
					}
					return t;
				}),
				(this.insertLines = function(e, t) {
					return (
						console.warn(
							'Use of document.insertLines is deprecated. Use the insertFullLines method instead.'
						),
						this.insertFullLines(e, t)
					);
				}),
				(this.removeLines = function(e, t) {
					return (
						console.warn(
							'Use of document.removeLines is deprecated. Use the removeFullLines method instead.'
						),
						this.removeFullLines(e, t)
					);
				}),
				(this.insertNewLine = function(e) {
					return (
						console.warn(
							"Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead."
						),
						this.insertMergedLines(e, ['', ''])
					);
				}),
				(this.insert = function(e, t) {
					return (
						this.getLength() <= 1 && this.$detectNewLine(t),
						this.insertMergedLines(e, this.$split(t))
					);
				}),
				(this.insertInLine = function(e, t) {
					var n = this.clippedPos(e.row, e.column),
						r = this.pos(e.row, e.column + t.length);
					return (
						this.applyDelta(
							{ start: n, end: r, action: 'insert', lines: [t] },
							!0
						),
						this.clonePos(r)
					);
				}),
				(this.clippedPos = function(e, t) {
					var n = this.getLength();
					e === undefined
						? (e = n)
						: e < 0
						? (e = 0)
						: e >= n && ((e = n - 1), (t = undefined));
					var r = this.getLine(e);
					return (
						t == undefined && (t = r.length),
						(t = Math.min(Math.max(t, 0), r.length)),
						{ row: e, column: t }
					);
				}),
				(this.clonePos = function(e) {
					return { row: e.row, column: e.column };
				}),
				(this.pos = function(e, t) {
					return { row: e, column: t };
				}),
				(this.$clipPosition = function(e) {
					var t = this.getLength();
					return (
						e.row >= t
							? ((e.row = Math.max(0, t - 1)),
							  (e.column = this.getLine(t - 1).length))
							: ((e.row = Math.max(0, e.row)),
							  (e.column = Math.min(
									Math.max(e.column, 0),
									this.getLine(e.row).length
							  ))),
						e
					);
				}),
				(this.insertFullLines = function(e, t) {
					e = Math.min(Math.max(e, 0), this.getLength());
					var n = 0;
					e < this.getLength()
						? ((t = t.concat([''])), (n = 0))
						: ((t = [''].concat(t)),
						  e--,
						  (n = this.$lines[e].length)),
						this.insertMergedLines({ row: e, column: n }, t);
				}),
				(this.insertMergedLines = function(e, t) {
					var n = this.clippedPos(e.row, e.column),
						r = {
							row: n.row + t.length - 1,
							column:
								(t.length == 1 ? n.column : 0) +
								t[t.length - 1].length
						};
					return (
						this.applyDelta({
							start: n,
							end: r,
							action: 'insert',
							lines: t
						}),
						this.clonePos(r)
					);
				}),
				(this.remove = function(e) {
					var t = this.clippedPos(e.start.row, e.start.column),
						n = this.clippedPos(e.end.row, e.end.column);
					return (
						this.applyDelta({
							start: t,
							end: n,
							action: 'remove',
							lines: this.getLinesForRange({ start: t, end: n })
						}),
						this.clonePos(t)
					);
				}),
				(this.removeInLine = function(e, t, n) {
					var r = this.clippedPos(e, t),
						i = this.clippedPos(e, n);
					return (
						this.applyDelta(
							{
								start: r,
								end: i,
								action: 'remove',
								lines: this.getLinesForRange({
									start: r,
									end: i
								})
							},
							!0
						),
						this.clonePos(r)
					);
				}),
				(this.removeFullLines = function(e, t) {
					(e = Math.min(Math.max(0, e), this.getLength() - 1)),
						(t = Math.min(Math.max(0, t), this.getLength() - 1));
					var n = t == this.getLength() - 1 && e > 0,
						r = t < this.getLength() - 1,
						i = n ? e - 1 : e,
						s = n ? this.getLine(i).length : 0,
						u = r ? t + 1 : t,
						a = r ? 0 : this.getLine(u).length,
						f = new o(i, s, u, a),
						l = this.$lines.slice(e, t + 1);
					return (
						this.applyDelta({
							start: f.start,
							end: f.end,
							action: 'remove',
							lines: this.getLinesForRange(f)
						}),
						l
					);
				}),
				(this.removeNewLine = function(e) {
					e < this.getLength() - 1 &&
						e >= 0 &&
						this.applyDelta({
							start: this.pos(e, this.getLine(e).length),
							end: this.pos(e + 1, 0),
							action: 'remove',
							lines: ['', '']
						});
				}),
				(this.replace = function(e, t) {
					e instanceof o || (e = o.fromPoints(e.start, e.end));
					if (t.length === 0 && e.isEmpty()) return e.start;
					if (t == this.getTextRange(e)) return e.end;
					this.remove(e);
					var n;
					return t ? (n = this.insert(e.start, t)) : (n = e.start), n;
				}),
				(this.applyDeltas = function(e) {
					for (var t = 0; t < e.length; t++) this.applyDelta(e[t]);
				}),
				(this.revertDeltas = function(e) {
					for (var t = e.length - 1; t >= 0; t--)
						this.revertDelta(e[t]);
				}),
				(this.applyDelta = function(e, t) {
					var n = e.action == 'insert';
					if (
						n
							? e.lines.length <= 1 && !e.lines[0]
							: !o.comparePoints(e.start, e.end)
					)
						return;
					n &&
						e.lines.length > 2e4 &&
						this.$splitAndapplyLargeDelta(e, 2e4),
						i(this.$lines, e, t),
						this._signal('change', e);
				}),
				(this.$splitAndapplyLargeDelta = function(e, t) {
					var n = e.lines,
						r = n.length,
						i = e.start.row,
						s = e.start.column,
						o = 0,
						u = 0;
					do {
						(o = u), (u += t - 1);
						var a = n.slice(o, u);
						if (u > r) {
							(e.lines = a),
								(e.start.row = i + o),
								(e.start.column = s);
							break;
						}
						a.push(''),
							this.applyDelta(
								{
									start: this.pos(i + o, s),
									end: this.pos(i + u, (s = 0)),
									action: e.action,
									lines: a
								},
								!0
							);
					} while (!0);
				}),
				(this.revertDelta = function(e) {
					this.applyDelta({
						start: this.clonePos(e.start),
						end: this.clonePos(e.end),
						action: e.action == 'insert' ? 'remove' : 'insert',
						lines: e.lines.slice()
					});
				}),
				(this.indexToPosition = function(e, t) {
					var n = this.$lines || this.getAllLines(),
						r = this.getNewLineCharacter().length;
					for (var i = t || 0, s = n.length; i < s; i++) {
						e -= n[i].length + r;
						if (e < 0)
							return { row: i, column: e + n[i].length + r };
					}
					return { row: s - 1, column: n[s - 1].length };
				}),
				(this.positionToIndex = function(e, t) {
					var n = this.$lines || this.getAllLines(),
						r = this.getNewLineCharacter().length,
						i = 0,
						s = Math.min(e.row, n.length);
					for (var o = t || 0; o < s; ++o) i += n[o].length + r;
					return i + e.column;
				});
		}.call(a.prototype),
			(t.Document = a));
	}),
	define('ace/lib/lang', ['require', 'exports', 'module'], function(e, t, n) {
		'use strict';
		(t.last = function(e) {
			return e[e.length - 1];
		}),
			(t.stringReverse = function(e) {
				return e
					.split('')
					.reverse()
					.join('');
			}),
			(t.stringRepeat = function(e, t) {
				var n = '';
				while (t > 0) {
					t & 1 && (n += e);
					if ((t >>= 1)) e += e;
				}
				return n;
			});
		var r = /^\s\s*/,
			i = /\s\s*$/;
		(t.stringTrimLeft = function(e) {
			return e.replace(r, '');
		}),
			(t.stringTrimRight = function(e) {
				return e.replace(i, '');
			}),
			(t.copyObject = function(e) {
				var t = {};
				for (var n in e) t[n] = e[n];
				return t;
			}),
			(t.copyArray = function(e) {
				var t = [];
				for (var n = 0, r = e.length; n < r; n++)
					e[n] && typeof e[n] == 'object'
						? (t[n] = this.copyObject(e[n]))
						: (t[n] = e[n]);
				return t;
			}),
			(t.deepCopy = function s(e) {
				if (typeof e != 'object' || !e) return e;
				var t;
				if (Array.isArray(e)) {
					t = [];
					for (var n = 0; n < e.length; n++) t[n] = s(e[n]);
					return t;
				}
				if (Object.prototype.toString.call(e) !== '[object Object]')
					return e;
				t = {};
				for (var n in e) t[n] = s(e[n]);
				return t;
			}),
			(t.arrayToMap = function(e) {
				var t = {};
				for (var n = 0; n < e.length; n++) t[e[n]] = 1;
				return t;
			}),
			(t.createMap = function(e) {
				var t = Object.create(null);
				for (var n in e) t[n] = e[n];
				return t;
			}),
			(t.arrayRemove = function(e, t) {
				for (var n = 0; n <= e.length; n++)
					t === e[n] && e.splice(n, 1);
			}),
			(t.escapeRegExp = function(e) {
				return e.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
			}),
			(t.escapeHTML = function(e) {
				return e
					.replace(/&/g, '&#38;')
					.replace(/"/g, '&#34;')
					.replace(/'/g, '&#39;')
					.replace(/</g, '&#60;');
			}),
			(t.getMatchOffsets = function(e, t) {
				var n = [];
				return (
					e.replace(t, function(e) {
						n.push({
							offset: arguments[arguments.length - 2],
							length: e.length
						});
					}),
					n
				);
			}),
			(t.deferredCall = function(e) {
				var t = null,
					n = function() {
						(t = null), e();
					},
					r = function(e) {
						return r.cancel(), (t = setTimeout(n, e || 0)), r;
					};
				return (
					(r.schedule = r),
					(r.call = function() {
						return this.cancel(), e(), r;
					}),
					(r.cancel = function() {
						return clearTimeout(t), (t = null), r;
					}),
					(r.isPending = function() {
						return t;
					}),
					r
				);
			}),
			(t.delayedCall = function(e, t) {
				var n = null,
					r = function() {
						(n = null), e();
					},
					i = function(e) {
						n == null && (n = setTimeout(r, e || t));
					};
				return (
					(i.delay = function(e) {
						n && clearTimeout(n), (n = setTimeout(r, e || t));
					}),
					(i.schedule = i),
					(i.call = function() {
						this.cancel(), e();
					}),
					(i.cancel = function() {
						n && clearTimeout(n), (n = null);
					}),
					(i.isPending = function() {
						return n;
					}),
					i
				);
			});
	}),
	define('ace/worker/mirror', [
		'require',
		'exports',
		'module',
		'ace/range',
		'ace/document',
		'ace/lib/lang'
	], function(e, t, n) {
		'use strict';
		var r = e('../range').Range,
			i = e('../document').Document,
			s = e('../lib/lang'),
			o = (t.Mirror = function(e) {
				this.sender = e;
				var t = (this.doc = new i('')),
					n = (this.deferredUpdate = s.delayedCall(
						this.onUpdate.bind(this)
					)),
					r = this;
				e.on('change', function(e) {
					var i = e.data;
					if (i[0].start) t.applyDeltas(i);
					else
						for (var s = 0; s < i.length; s += 2) {
							if (Array.isArray(i[s + 1]))
								var o = {
									action: 'insert',
									start: i[s],
									lines: i[s + 1]
								};
							else
								var o = {
									action: 'remove',
									start: i[s],
									end: i[s + 1]
								};
							t.applyDelta(o, !0);
						}
					if (r.$timeout) return n.schedule(r.$timeout);
					r.onUpdate();
				});
			});
		(function() {
			(this.$timeout = 500),
				(this.setTimeout = function(e) {
					this.$timeout = e;
				}),
				(this.setValue = function(e) {
					this.doc.setValue(e),
						this.deferredUpdate.schedule(this.$timeout);
				}),
				(this.getValue = function(e) {
					this.sender.callback(this.doc.getValue(), e);
				}),
				(this.onUpdate = function() {}),
				(this.isPending = function() {
					return this.deferredUpdate.isPending();
				});
		}.call(o.prototype));
	}),
	define('ace/mode/php/php', ['require', 'exports', 'module'], function(
		e,
		t,
		n
	) {
		var r = { Constants: {} };
		(r.Constants.T_INCLUDE = 257),
			(r.Constants.T_INCLUDE_ONCE = 258),
			(r.Constants.T_EVAL = 259),
			(r.Constants.T_REQUIRE = 260),
			(r.Constants.T_REQUIRE_ONCE = 261),
			(r.Constants.T_LOGICAL_OR = 262),
			(r.Constants.T_LOGICAL_XOR = 263),
			(r.Constants.T_LOGICAL_AND = 264),
			(r.Constants.T_PRINT = 265),
			(r.Constants.T_YIELD = 266),
			(r.Constants.T_DOUBLE_ARROW = 267),
			(r.Constants.T_YIELD_FROM = 268),
			(r.Constants.T_PLUS_EQUAL = 269),
			(r.Constants.T_MINUS_EQUAL = 270),
			(r.Constants.T_MUL_EQUAL = 271),
			(r.Constants.T_DIV_EQUAL = 272),
			(r.Constants.T_CONCAT_EQUAL = 273),
			(r.Constants.T_MOD_EQUAL = 274),
			(r.Constants.T_AND_EQUAL = 275),
			(r.Constants.T_OR_EQUAL = 276),
			(r.Constants.T_XOR_EQUAL = 277),
			(r.Constants.T_SL_EQUAL = 278),
			(r.Constants.T_SR_EQUAL = 279),
			(r.Constants.T_POW_EQUAL = 280),
			(r.Constants.T_COALESCE = 281),
			(r.Constants.T_BOOLEAN_OR = 282),
			(r.Constants.T_BOOLEAN_AND = 283),
			(r.Constants.T_IS_EQUAL = 284),
			(r.Constants.T_IS_NOT_EQUAL = 285),
			(r.Constants.T_IS_IDENTICAL = 286),
			(r.Constants.T_IS_NOT_IDENTICAL = 287),
			(r.Constants.T_SPACESHIP = 288),
			(r.Constants.T_IS_SMALLER_OR_EQUAL = 289),
			(r.Constants.T_IS_GREATER_OR_EQUAL = 290),
			(r.Constants.T_SL = 291),
			(r.Constants.T_SR = 292),
			(r.Constants.T_INSTANCEOF = 293),
			(r.Constants.T_INC = 294),
			(r.Constants.T_DEC = 295),
			(r.Constants.T_INT_CAST = 296),
			(r.Constants.T_DOUBLE_CAST = 297),
			(r.Constants.T_STRING_CAST = 298),
			(r.Constants.T_ARRAY_CAST = 299),
			(r.Constants.T_OBJECT_CAST = 300),
			(r.Constants.T_BOOL_CAST = 301),
			(r.Constants.T_UNSET_CAST = 302),
			(r.Constants.T_POW = 303),
			(r.Constants.T_NEW = 304),
			(r.Constants.T_CLONE = 305),
			(r.Constants.T_EXIT = 306),
			(r.Constants.T_IF = 307),
			(r.Constants.T_ELSEIF = 308),
			(r.Constants.T_ELSE = 309),
			(r.Constants.T_ENDIF = 310),
			(r.Constants.T_LNUMBER = 311),
			(r.Constants.T_DNUMBER = 312),
			(r.Constants.T_STRING = 313),
			(r.Constants.T_STRING_VARNAME = 314),
			(r.Constants.T_VARIABLE = 315),
			(r.Constants.T_NUM_STRING = 316),
			(r.Constants.T_INLINE_HTML = 317),
			(r.Constants.T_CHARACTER = 318),
			(r.Constants.T_BAD_CHARACTER = 319),
			(r.Constants.T_ENCAPSED_AND_WHITESPACE = 320),
			(r.Constants.T_CONSTANT_ENCAPSED_STRING = 321),
			(r.Constants.T_ECHO = 322),
			(r.Constants.T_DO = 323),
			(r.Constants.T_WHILE = 324),
			(r.Constants.T_ENDWHILE = 325),
			(r.Constants.T_FOR = 326),
			(r.Constants.T_ENDFOR = 327),
			(r.Constants.T_FOREACH = 328),
			(r.Constants.T_ENDFOREACH = 329),
			(r.Constants.T_DECLARE = 330),
			(r.Constants.T_ENDDECLARE = 331),
			(r.Constants.T_AS = 332),
			(r.Constants.T_SWITCH = 333),
			(r.Constants.T_ENDSWITCH = 334),
			(r.Constants.T_CASE = 335),
			(r.Constants.T_DEFAULT = 336),
			(r.Constants.T_BREAK = 337),
			(r.Constants.T_CONTINUE = 338),
			(r.Constants.T_GOTO = 339),
			(r.Constants.T_FUNCTION = 340),
			(r.Constants.T_CONST = 341),
			(r.Constants.T_RETURN = 342),
			(r.Constants.T_TRY = 343),
			(r.Constants.T_CATCH = 344),
			(r.Constants.T_FINALLY = 345),
			(r.Constants.T_THROW = 346),
			(r.Constants.T_USE = 347),
			(r.Constants.T_INSTEADOF = 348),
			(r.Constants.T_GLOBAL = 349),
			(r.Constants.T_STATIC = 350),
			(r.Constants.T_ABSTRACT = 351),
			(r.Constants.T_FINAL = 352),
			(r.Constants.T_PRIVATE = 353),
			(r.Constants.T_PROTECTED = 354),
			(r.Constants.T_PUBLIC = 355),
			(r.Constants.T_VAR = 356),
			(r.Constants.T_UNSET = 357),
			(r.Constants.T_ISSET = 358),
			(r.Constants.T_EMPTY = 359),
			(r.Constants.T_HALT_COMPILER = 360),
			(r.Constants.T_CLASS = 361),
			(r.Constants.T_TRAIT = 362),
			(r.Constants.T_INTERFACE = 363),
			(r.Constants.T_EXTENDS = 364),
			(r.Constants.T_IMPLEMENTS = 365),
			(r.Constants.T_OBJECT_OPERATOR = 366),
			(r.Constants.T_LIST = 367),
			(r.Constants.T_ARRAY = 368),
			(r.Constants.T_CALLABLE = 369),
			(r.Constants.T_CLASS_C = 370),
			(r.Constants.T_TRAIT_C = 371),
			(r.Constants.T_METHOD_C = 372),
			(r.Constants.T_FUNC_C = 373),
			(r.Constants.T_LINE = 374),
			(r.Constants.T_FILE = 375),
			(r.Constants.T_COMMENT = 376),
			(r.Constants.T_DOC_COMMENT = 377),
			(r.Constants.T_OPEN_TAG = 378),
			(r.Constants.T_OPEN_TAG_WITH_ECHO = 379),
			(r.Constants.T_CLOSE_TAG = 380),
			(r.Constants.T_WHITESPACE = 381),
			(r.Constants.T_START_HEREDOC = 382),
			(r.Constants.T_END_HEREDOC = 383),
			(r.Constants.T_DOLLAR_OPEN_CURLY_BRACES = 384),
			(r.Constants.T_CURLY_OPEN = 385),
			(r.Constants.T_PAAMAYIM_NEKUDOTAYIM = 386),
			(r.Constants.T_NAMESPACE = 387),
			(r.Constants.T_NS_C = 388),
			(r.Constants.T_DIR = 389),
			(r.Constants.T_NS_SEPARATOR = 390),
			(r.Constants.T_ELLIPSIS = 391),
			(r.Lexer = function(e, t) {
				var n,
					i,
					s = ['INITIAL'],
					o = 0,
					u = function(e) {
						s[o] = e;
					},
					a = function(e) {
						s[++o] = e;
					},
					f = function() {
						--o;
					},
					l =
						t === undefined ||
						/^(on|true|1)$/i.test(t.short_open_tag),
					c = l
						? /^(\<\?php(?:\r\n|[ \t\r\n])|<\?|\<script language\=('|")?php('|")?\>)/i
						: /^(\<\?php(?:\r\n|[ \t\r\n])|\<script language\=('|")?php('|")?\>)/i,
					h = l
						? /[^<]*(?:<(?!\?|script language\=('|")?php('|")?\>)[^<]*)*/i
						: /[^<]*(?:<(?!\?=|\?php[ \t\r\n]|script language\=('|")?php('|")?\>)[^<]*)*/i;
				(labelRegexPart =
					'[a-zA-Z_\\x7f-\\uffff][a-zA-Z0-9_\\x7f-\\uffff]*'),
					(stringRegexPart = function(e) {
						return (
							'[^' +
							e +
							'\\\\${]*(?:(?:\\\\[\\s\\S]|\\$(?!\\{|[a-zA-Z_\\x7f-\\uffff])|\\{(?!\\$))[^' +
							e +
							'\\\\${]*)*'
						);
					}),
					(sharedStringTokens = [
						{
							value: r.Constants.T_VARIABLE,
							re: new RegExp('^\\$' + labelRegexPart + '(?=\\[)'),
							func: function() {
								a('VAR_OFFSET');
							}
						},
						{
							value: r.Constants.T_VARIABLE,
							re: new RegExp(
								'^\\$' +
									labelRegexPart +
									'(?=->' +
									labelRegexPart +
									')'
							),
							func: function() {
								a('LOOKING_FOR_PROPERTY');
							}
						},
						{
							value: r.Constants.T_DOLLAR_OPEN_CURLY_BRACES,
							re: new RegExp(
								'^\\$\\{(?=' + labelRegexPart + '[\\[}])'
							),
							func: function() {
								a('LOOKING_FOR_VARNAME');
							}
						},
						{
							value: r.Constants.T_VARIABLE,
							re: new RegExp('^\\$' + labelRegexPart)
						},
						{
							value: r.Constants.T_DOLLAR_OPEN_CURLY_BRACES,
							re: /^\$\{/,
							func: function() {
								a('IN_SCRIPTING');
							}
						},
						{
							value: r.Constants.T_CURLY_OPEN,
							re: /^\{(?=\$)/,
							func: function() {
								a('IN_SCRIPTING');
							}
						}
					]),
					(data = {
						INITIAL: [
							{
								value: r.Constants.T_OPEN_TAG_WITH_ECHO,
								re: /^<\?=/i,
								func: function() {
									u('IN_SCRIPTING');
								}
							},
							{
								value: r.Constants.T_OPEN_TAG,
								re: c,
								func: function() {
									u('IN_SCRIPTING');
								}
							},
							{ value: r.Constants.T_INLINE_HTML, re: h }
						],
						IN_SCRIPTING: [
							{
								value: r.Constants.T_WHITESPACE,
								re: /^[ \n\r\t]+/
							},
							{
								value: r.Constants.T_ABSTRACT,
								re: /^abstract\b/i
							},
							{ value: r.Constants.T_LOGICAL_AND, re: /^and\b/i },
							{ value: r.Constants.T_ARRAY, re: /^array\b/i },
							{ value: r.Constants.T_AS, re: /^as\b/i },
							{ value: r.Constants.T_BREAK, re: /^break\b/i },
							{
								value: r.Constants.T_CALLABLE,
								re: /^callable\b/i
							},
							{ value: r.Constants.T_CASE, re: /^case\b/i },
							{ value: r.Constants.T_CATCH, re: /^catch\b/i },
							{ value: r.Constants.T_CLASS, re: /^class\b/i },
							{ value: r.Constants.T_CLONE, re: /^clone\b/i },
							{ value: r.Constants.T_CONST, re: /^const\b/i },
							{
								value: r.Constants.T_CONTINUE,
								re: /^continue\b/i
							},
							{ value: r.Constants.T_DECLARE, re: /^declare\b/i },
							{ value: r.Constants.T_DEFAULT, re: /^default\b/i },
							{ value: r.Constants.T_DO, re: /^do\b/i },
							{ value: r.Constants.T_ECHO, re: /^echo\b/i },
							{ value: r.Constants.T_ELSE, re: /^else\b/i },
							{ value: r.Constants.T_ELSEIF, re: /^elseif\b/i },
							{
								value: r.Constants.T_ENDDECLARE,
								re: /^enddeclare\b/i
							},
							{ value: r.Constants.T_ENDFOR, re: /^endfor\b/i },
							{
								value: r.Constants.T_ENDFOREACH,
								re: /^endforeach\b/i
							},
							{ value: r.Constants.T_ENDIF, re: /^endif\b/i },
							{
								value: r.Constants.T_ENDSWITCH,
								re: /^endswitch\b/i
							},
							{
								value: r.Constants.T_ENDWHILE,
								re: /^endwhile\b/i
							},
							{ value: r.Constants.T_EMPTY, re: /^empty\b/i },
							{ value: r.Constants.T_EVAL, re: /^eval\b/i },
							{
								value: r.Constants.T_EXIT,
								re: /^(?:exit|die)\b/i
							},
							{ value: r.Constants.T_EXTENDS, re: /^extends\b/i },
							{ value: r.Constants.T_FINAL, re: /^final\b/i },
							{ value: r.Constants.T_FINALLY, re: /^finally\b/i },
							{ value: r.Constants.T_FOR, re: /^for\b/i },
							{ value: r.Constants.T_FOREACH, re: /^foreach\b/i },
							{
								value: r.Constants.T_FUNCTION,
								re: /^function\b/i
							},
							{ value: r.Constants.T_GLOBAL, re: /^global\b/i },
							{ value: r.Constants.T_GOTO, re: /^goto\b/i },
							{ value: r.Constants.T_IF, re: /^if\b/i },
							{
								value: r.Constants.T_IMPLEMENTS,
								re: /^implements\b/i
							},
							{ value: r.Constants.T_INCLUDE, re: /^include\b/i },
							{
								value: r.Constants.T_INCLUDE_ONCE,
								re: /^include_once\b/i
							},
							{
								value: r.Constants.T_INSTANCEOF,
								re: /^instanceof\b/i
							},
							{
								value: r.Constants.T_INSTEADOF,
								re: /^insteadof\b/i
							},
							{
								value: r.Constants.T_INTERFACE,
								re: /^interface\b/i
							},
							{ value: r.Constants.T_ISSET, re: /^isset\b/i },
							{ value: r.Constants.T_LIST, re: /^list\b/i },
							{
								value: r.Constants.T_NAMESPACE,
								re: /^namespace\b/i
							},
							{ value: r.Constants.T_NEW, re: /^new\b/i },
							{ value: r.Constants.T_LOGICAL_OR, re: /^or\b/i },
							{ value: r.Constants.T_PRINT, re: /^print\b/i },
							{ value: r.Constants.T_PRIVATE, re: /^private\b/i },
							{
								value: r.Constants.T_PROTECTED,
								re: /^protected\b/i
							},
							{ value: r.Constants.T_PUBLIC, re: /^public\b/i },
							{ value: r.Constants.T_REQUIRE, re: /^require\b/i },
							{
								value: r.Constants.T_REQUIRE_ONCE,
								re: /^require_once\b/i
							},
							{ value: r.Constants.T_STATIC, re: /^static\b/i },
							{ value: r.Constants.T_SWITCH, re: /^switch\b/i },
							{ value: r.Constants.T_THROW, re: /^throw\b/i },
							{ value: r.Constants.T_TRAIT, re: /^trait\b/i },
							{ value: r.Constants.T_TRY, re: /^try\b/i },
							{ value: r.Constants.T_UNSET, re: /^unset\b/i },
							{ value: r.Constants.T_USE, re: /^use\b/i },
							{ value: r.Constants.T_VAR, re: /^var\b/i },
							{ value: r.Constants.T_WHILE, re: /^while\b/i },
							{ value: r.Constants.T_LOGICAL_XOR, re: /^xor\b/i },
							{
								value: r.Constants.T_YIELD_FROM,
								re: /^yield\s+from\b/i
							},
							{ value: r.Constants.T_YIELD, re: /^yield\b/i },
							{ value: r.Constants.T_RETURN, re: /^return\b/i },
							{
								value: r.Constants.T_METHOD_C,
								re: /^__METHOD__\b/i
							},
							{ value: r.Constants.T_LINE, re: /^__LINE__\b/i },
							{ value: r.Constants.T_FILE, re: /^__FILE__\b/i },
							{
								value: r.Constants.T_FUNC_C,
								re: /^__FUNCTION__\b/i
							},
							{
								value: r.Constants.T_NS_C,
								re: /^__NAMESPACE__\b/i
							},
							{
								value: r.Constants.T_TRAIT_C,
								re: /^__TRAIT__\b/i
							},
							{ value: r.Constants.T_DIR, re: /^__DIR__\b/i },
							{
								value: r.Constants.T_CLASS_C,
								re: /^__CLASS__\b/i
							},
							{ value: r.Constants.T_AND_EQUAL, re: /^&=/ },
							{
								value: r.Constants.T_ARRAY_CAST,
								re: /^\([ \t]*array[ \t]*\)/i
							},
							{
								value: r.Constants.T_BOOL_CAST,
								re: /^\([ \t]*(?:bool|boolean)[ \t]*\)/i
							},
							{
								value: r.Constants.T_DOUBLE_CAST,
								re: /^\([ \t]*(?:real|float|double)[ \t]*\)/i
							},
							{
								value: r.Constants.T_INT_CAST,
								re: /^\([ \t]*(?:int|integer)[ \t]*\)/i
							},
							{
								value: r.Constants.T_OBJECT_CAST,
								re: /^\([ \t]*object[ \t]*\)/i
							},
							{
								value: r.Constants.T_STRING_CAST,
								re: /^\([ \t]*(?:binary|string)[ \t]*\)/i
							},
							{
								value: r.Constants.T_UNSET_CAST,
								re: /^\([ \t]*unset[ \t]*\)/i
							},
							{ value: r.Constants.T_BOOLEAN_AND, re: /^&&/ },
							{ value: r.Constants.T_BOOLEAN_OR, re: /^\|\|/ },
							{
								value: r.Constants.T_CLOSE_TAG,
								re: /^(?:\?>|<\/script>)(\r\n|\r|\n)?/i,
								func: function() {
									u('INITIAL');
								}
							},
							{ value: r.Constants.T_DOUBLE_ARROW, re: /^=>/ },
							{
								value: r.Constants.T_PAAMAYIM_NEKUDOTAYIM,
								re: /^::/
							},
							{ value: r.Constants.T_INC, re: /^\+\+/ },
							{ value: r.Constants.T_DEC, re: /^--/ },
							{ value: r.Constants.T_CONCAT_EQUAL, re: /^\.=/ },
							{ value: r.Constants.T_DIV_EQUAL, re: /^\/=/ },
							{ value: r.Constants.T_XOR_EQUAL, re: /^\^=/ },
							{ value: r.Constants.T_MUL_EQUAL, re: /^\*=/ },
							{ value: r.Constants.T_MOD_EQUAL, re: /^%=/ },
							{ value: r.Constants.T_SL_EQUAL, re: /^<<=/ },
							{
								value: r.Constants.T_START_HEREDOC,
								re: new RegExp(
									"^[bB]?<<<[ \\t]*'(" +
										labelRegexPart +
										")'(?:\\r\\n|\\r|\\n)"
								),
								func: function(e) {
									(n = e[1]), u('NOWDOC');
								}
							},
							{
								value: r.Constants.T_START_HEREDOC,
								re: new RegExp(
									'^[bB]?<<<[ \\t]*("?)(' +
										labelRegexPart +
										')\\1(?:\\r\\n|\\r|\\n)'
								),
								func: function(e) {
									(n = e[2]), (i = !0), u('HEREDOC');
								}
							},
							{ value: r.Constants.T_SL, re: /^<</ },
							{ value: r.Constants.T_SPACESHIP, re: /^<=>/ },
							{
								value: r.Constants.T_IS_SMALLER_OR_EQUAL,
								re: /^<=/
							},
							{ value: r.Constants.T_SR_EQUAL, re: /^>>=/ },
							{ value: r.Constants.T_SR, re: /^>>/ },
							{
								value: r.Constants.T_IS_GREATER_OR_EQUAL,
								re: /^>=/
							},
							{ value: r.Constants.T_OR_EQUAL, re: /^\|=/ },
							{ value: r.Constants.T_PLUS_EQUAL, re: /^\+=/ },
							{ value: r.Constants.T_MINUS_EQUAL, re: /^-=/ },
							{
								value: r.Constants.T_OBJECT_OPERATOR,
								re: new RegExp(
									'^->(?=[ \n\r	]*' + labelRegexPart + ')'
								),
								func: function() {
									a('LOOKING_FOR_PROPERTY');
								}
							},
							{
								value: r.Constants.T_OBJECT_OPERATOR,
								re: /^->/i
							},
							{ value: r.Constants.T_ELLIPSIS, re: /^\.\.\./ },
							{ value: r.Constants.T_POW_EQUAL, re: /^\*\*=/ },
							{ value: r.Constants.T_POW, re: /^\*\*/ },
							{ value: r.Constants.T_COALESCE, re: /^\?\?/ },
							{
								value: r.Constants.T_COMMENT,
								re: /^\/\*([\S\s]*?)(?:\*\/|$)/
							},
							{
								value: r.Constants.T_COMMENT,
								re: /^(?:\/\/|#)[^\r\n?]*(?:\?(?!>)[^\r\n?]*)*(?:\r\n|\r|\n)?/
							},
							{ value: r.Constants.T_IS_IDENTICAL, re: /^===/ },
							{ value: r.Constants.T_IS_EQUAL, re: /^==/ },
							{
								value: r.Constants.T_IS_NOT_IDENTICAL,
								re: /^!==/
							},
							{
								value: r.Constants.T_IS_NOT_EQUAL,
								re: /^(!=|<>)/
							},
							{
								value: r.Constants.T_DNUMBER,
								re: /^(?:[0-9]+\.[0-9]*|\.[0-9]+)(?:[eE][+-]?[0-9]+)?/
							},
							{
								value: r.Constants.T_DNUMBER,
								re: /^[0-9]+[eE][+-]?[0-9]+/
							},
							{
								value: r.Constants.T_LNUMBER,
								re: /^(?:0x[0-9A-F]+|0b[01]+|[0-9]+)/i
							},
							{
								value: r.Constants.T_VARIABLE,
								re: new RegExp('^\\$' + labelRegexPart)
							},
							{
								value: r.Constants.T_CONSTANT_ENCAPSED_STRING,
								re: /^[bB]?'[^'\\]*(?:\\[\s\S][^'\\]*)*'/
							},
							{
								value: r.Constants.T_CONSTANT_ENCAPSED_STRING,
								re: new RegExp(
									'^[bB]?"' + stringRegexPart('"') + '"'
								)
							},
							{
								value: -1,
								re: /^[bB]?"/,
								func: function() {
									u('DOUBLE_QUOTES');
								}
							},
							{
								value: -1,
								re: /^`/,
								func: function() {
									u('BACKTICKS');
								}
							},
							{ value: r.Constants.T_NS_SEPARATOR, re: /^\\/ },
							{
								value: r.Constants.T_STRING,
								re: /^[a-zA-Z_\x7f-\uffff][a-zA-Z0-9_\x7f-\uffff]*/
							},
							{
								value: -1,
								re: /^\{/,
								func: function() {
									a('IN_SCRIPTING');
								}
							},
							{
								value: -1,
								re: /^\}/,
								func: function() {
									o > 0 && f();
								}
							},
							{ value: -1, re: /^[\[\];:?()!.,><=+-/*|&@^%"'$~]/ }
						],
						DOUBLE_QUOTES: sharedStringTokens.concat([
							{
								value: -1,
								re: /^"/,
								func: function() {
									u('IN_SCRIPTING');
								}
							},
							{
								value: r.Constants.T_ENCAPSED_AND_WHITESPACE,
								re: new RegExp('^' + stringRegexPart('"'))
							}
						]),
						BACKTICKS: sharedStringTokens.concat([
							{
								value: -1,
								re: /^`/,
								func: function() {
									u('IN_SCRIPTING');
								}
							},
							{
								value: r.Constants.T_ENCAPSED_AND_WHITESPACE,
								re: new RegExp('^' + stringRegexPart('`'))
							}
						]),
						VAR_OFFSET: [
							{
								value: -1,
								re: /^\]/,
								func: function() {
									f();
								}
							},
							{
								value: r.Constants.T_NUM_STRING,
								re: /^(?:0x[0-9A-F]+|0b[01]+|[0-9]+)/i
							},
							{
								value: r.Constants.T_VARIABLE,
								re: new RegExp('^\\$' + labelRegexPart)
							},
							{
								value: r.Constants.T_STRING,
								re: new RegExp('^' + labelRegexPart)
							},
							{ value: -1, re: /^[;:,.\[()|^&+-/*=%!~$<>?@{}"`]/ }
						],
						LOOKING_FOR_PROPERTY: [
							{ value: r.Constants.T_OBJECT_OPERATOR, re: /^->/ },
							{
								value: r.Constants.T_STRING,
								re: new RegExp('^' + labelRegexPart),
								func: function() {
									f();
								}
							},
							{
								value: r.Constants.T_WHITESPACE,
								re: /^[ \n\r\t]+/
							}
						],
						LOOKING_FOR_VARNAME: [
							{
								value: r.Constants.T_STRING_VARNAME,
								re: new RegExp(
									'^' + labelRegexPart + '(?=[\\[}])'
								),
								func: function() {
									u('IN_SCRIPTING');
								}
							}
						],
						NOWDOC: [
							{
								value: r.Constants.T_END_HEREDOC,
								matchFunc: function(e) {
									var t = new RegExp(
										'^' + n + '(?=;?[\\r\\n])'
									);
									return e.match(t)
										? [e.substr(0, n.length)]
										: null;
								},
								func: function() {
									u('IN_SCRIPTING');
								}
							},
							{
								value: r.Constants.T_ENCAPSED_AND_WHITESPACE,
								matchFunc: function(e) {
									var t = new RegExp(
											'[\\r\\n]' + n + '(?=;?[\\r\\n])'
										),
										r = t.exec(e),
										i = r ? r.index + 1 : e.length;
									return [e.substring(0, i)];
								}
							}
						],
						HEREDOC: sharedStringTokens.concat([
							{
								value: r.Constants.T_END_HEREDOC,
								matchFunc: function(e) {
									if (!i) return null;
									var t = new RegExp(
										'^' + n + '(?=;?[\\r\\n])'
									);
									return e.match(t)
										? [e.substr(0, n.length)]
										: null;
								},
								func: function() {
									u('IN_SCRIPTING');
								}
							},
							{
								value: r.Constants.T_ENCAPSED_AND_WHITESPACE,
								matchFunc: function(e) {
									var t = e.length,
										r = new RegExp(
											'^' + stringRegexPart('')
										),
										s = r.exec(e);
									return (
										s && (t = s[0].length),
										(r = new RegExp(
											'([\\r\\n])' + n + '(?=;?[\\r\\n])'
										)),
										(s = r.exec(e.substring(0, t))),
										s
											? ((t = s.index + 1), (i = !0))
											: (i = !1),
										t == 0 ? null : [e.substring(0, t)]
									);
								}
							}
						])
					});
				var p = [],
					d = 1,
					v = !0;
				if (e === null) return p;
				typeof e != 'string' && (e = e.toString());
				while (e.length > 0 && v === !0) {
					var m = s[o],
						g = data[m];
					v = g.some(function(t) {
						var n =
							t.matchFunc !== undefined
								? t.matchFunc(e)
								: e.match(t.re);
						if (n !== null) {
							if (n[0].length == 0)
								throw new Error('empty match');
							t.func !== undefined && t.func(n);
							if (t.value === -1) p.push(n[0]);
							else {
								var r = n[0];
								p.push([parseInt(t.value, 10), r, d]),
									(d += r.split('\n').length - 1);
							}
							return (e = e.substring(n[0].length)), !0;
						}
						return !1;
					});
				}
				return p;
			}),
			(r.Parser = function(e, t) {
				var n = this.yybase,
					i = this.yydefault,
					s = this.yycheck,
					o = this.yyaction,
					u = this.yylen,
					a = this.yygbase,
					f = this.yygcheck,
					l = this.yyp,
					c = this.yygoto,
					h = this.yylhs,
					p = this.terminals,
					d = this.translate,
					v = this.yygdefault;
				(this.pos = -1),
					(this.line = 1),
					(this.tokenMap = this.createTokenMap()),
					(this.dropTokens = {}),
					(this.dropTokens[r.Constants.T_WHITESPACE] = 1),
					(this.dropTokens[r.Constants.T_OPEN_TAG] = 1);
				var m = [];
				e.forEach(function(e, t) {
					typeof e == 'object' &&
					e[0] === r.Constants.T_OPEN_TAG_WITH_ECHO
						? (m.push([r.Constants.T_OPEN_TAG, e[1], e[2]]),
						  m.push([r.Constants.T_ECHO, e[1], e[2]]))
						: m.push(e);
				}),
					(this.tokens = m);
				var g = this.TOKEN_NONE;
				(this.startAttributes = { startLine: 1 }),
					(this.endAttributes = {});
				var y = [this.startAttributes],
					b = 0,
					w = [b];
				(this.yyastk = []), (this.stackPos = 0);
				var E, S;
				for (;;) {
					if (n[b] === 0) E = i[b];
					else {
						g === this.TOKEN_NONE &&
							((S = this.getNextToken()),
							(g =
								S >= 0 && S < this.TOKEN_MAP_SIZE
									? d[S]
									: this.TOKEN_INVALID),
							(y[this.stackPos] = this.startAttributes));
						if (
							(((E = n[b] + g) >= 0 &&
								E < this.YYLAST &&
								s[E] === g) ||
								(b < this.YY2TBLSTATE &&
									(E = n[b + this.YYNLSTATES] + g) >= 0 &&
									E < this.YYLAST &&
									s[E] === g)) &&
							(E = o[E]) !== this.YYDEFAULT
						)
							if (E > 0) {
								++this.stackPos,
									(w[this.stackPos] = b = E),
									(this.yyastk[
										this.stackPos
									] = this.tokenValue),
									(y[this.stackPos] = this.startAttributes),
									(g = this.TOKEN_NONE);
								if (E < this.YYNLSTATES) continue;
								E -= this.YYNLSTATES;
							} else E = -E;
						else E = i[b];
					}
					for (;;) {
						if (E === 0) return this.yyval;
						if (E === this.YYUNEXPECTED) {
							if (t !== !0) {
								var T = [];
								for (var N = 0; N < this.TOKEN_MAP_SIZE; ++N)
									if (
										((E = n[b] + N) >= 0 &&
											E < this.YYLAST &&
											s[E] == N) ||
										(b < this.YY2TBLSTATE &&
											(E = n[b + this.YYNLSTATES] + N) &&
											E < this.YYLAST &&
											s[E] == N)
									)
										if (o[E] != this.YYUNEXPECTED) {
											if (T.length == 4) {
												T = [];
												break;
											}
											T.push(this.terminals[N]);
										}
								var C = '';
								throw (T.length &&
									(C = ', expecting ' + T.join(' or ')),
								new r.ParseError(
									'syntax error, unexpected ' + p[g] + C,
									this.startAttributes.startLine
								));
							}
							return this.startAttributes.startLine;
						}
						for (var x in this.endAttributes)
							y[this.stackPos - u[E]][x] = this.endAttributes[x];
						(this.stackPos -= u[E]),
							(E = h[E]),
							(l = a[E] + w[this.stackPos]) >= 0 &&
							l < this.YYGLAST &&
							f[l] === E
								? (b = c[l])
								: (b = v[E]),
							++this.stackPos,
							(w[this.stackPos] = b),
							(this.yyastk[this.stackPos] = this.yyval),
							(y[this.stackPos] = this.startAttributes);
						if (b < this.YYNLSTATES) break;
						E = b - this.YYNLSTATES;
					}
				}
			}),
			(r.ParseError = function(e, t) {
				(this.message = e), (this.line = t);
			}),
			(r.Parser.prototype.getNextToken = function() {
				(this.startAttributes = {}), (this.endAttributes = {});
				var e, t;
				while (this.tokens[++this.pos] !== undefined) {
					e = this.tokens[this.pos];
					if (typeof e == 'string')
						return (
							(this.startAttributes.startLine = this.line),
							(this.endAttributes.endLine = this.line),
							'b"' === e
								? ((this.tokenValue = 'b"'), '"'.charCodeAt(0))
								: ((this.tokenValue = e), e.charCodeAt(0))
						);
					this.line +=
						(t = e[1].match(/\n/g)) === null ? 0 : t.length;
					if (r.Constants.T_COMMENT === e[0])
						Array.isArray(this.startAttributes.comments) ||
							(this.startAttributes.comments = []),
							this.startAttributes.comments.push({
								type: 'comment',
								comment: e[1],
								line: e[2]
							});
					else if (r.Constants.T_DOC_COMMENT === e[0])
						this.startAttributes.comments.push(
							new PHPParser_Comment_Doc(e[1], e[2])
						);
					else if (this.dropTokens[e[0]] === undefined)
						return (
							(this.tokenValue = e[1]),
							(this.startAttributes.startLine = e[2]),
							(this.endAttributes.endLine = this.line),
							this.tokenMap[e[0]]
						);
				}
				return (this.startAttributes.startLine = this.line), 0;
			}),
			(r.Parser.prototype.tokenName = function(e) {
				var t = [
						'T_INCLUDE',
						'T_INCLUDE_ONCE',
						'T_EVAL',
						'T_REQUIRE',
						'T_REQUIRE_ONCE',
						'T_LOGICAL_OR',
						'T_LOGICAL_XOR',
						'T_LOGICAL_AND',
						'T_PRINT',
						'T_YIELD',
						'T_DOUBLE_ARROW',
						'T_YIELD_FROM',
						'T_PLUS_EQUAL',
						'T_MINUS_EQUAL',
						'T_MUL_EQUAL',
						'T_DIV_EQUAL',
						'T_CONCAT_EQUAL',
						'T_MOD_EQUAL',
						'T_AND_EQUAL',
						'T_OR_EQUAL',
						'T_XOR_EQUAL',
						'T_SL_EQUAL',
						'T_SR_EQUAL',
						'T_POW_EQUAL',
						'T_COALESCE',
						'T_BOOLEAN_OR',
						'T_BOOLEAN_AND',
						'T_IS_EQUAL',
						'T_IS_NOT_EQUAL',
						'T_IS_IDENTICAL',
						'T_IS_NOT_IDENTICAL',
						'T_SPACESHIP',
						'T_IS_SMALLER_OR_EQUAL',
						'T_IS_GREATER_OR_EQUAL',
						'T_SL',
						'T_SR',
						'T_INSTANCEOF',
						'T_INC',
						'T_DEC',
						'T_INT_CAST',
						'T_DOUBLE_CAST',
						'T_STRING_CAST',
						'T_ARRAY_CAST',
						'T_OBJECT_CAST',
						'T_BOOL_CAST',
						'T_UNSET_CAST',
						'T_POW',
						'T_NEW',
						'T_CLONE',
						'T_EXIT',
						'T_IF',
						'T_ELSEIF',
						'T_ELSE',
						'T_ENDIF',
						'T_LNUMBER',
						'T_DNUMBER',
						'T_STRING',
						'T_STRING_VARNAME',
						'T_VARIABLE',
						'T_NUM_STRING',
						'T_INLINE_HTML',
						'T_CHARACTER',
						'T_BAD_CHARACTER',
						'T_ENCAPSED_AND_WHITESPACE',
						'T_CONSTANT_ENCAPSED_STRING',
						'T_ECHO',
						'T_DO',
						'T_WHILE',
						'T_ENDWHILE',
						'T_FOR',
						'T_ENDFOR',
						'T_FOREACH',
						'T_ENDFOREACH',
						'T_DECLARE',
						'T_ENDDECLARE',
						'T_AS',
						'T_SWITCH',
						'T_ENDSWITCH',
						'T_CASE',
						'T_DEFAULT',
						'T_BREAK',
						'T_CONTINUE',
						'T_GOTO',
						'T_FUNCTION',
						'T_CONST',
						'T_RETURN',
						'T_TRY',
						'T_CATCH',
						'T_FINALLY',
						'T_THROW',
						'T_USE',
						'T_INSTEADOF',
						'T_GLOBAL',
						'T_STATIC',
						'T_ABSTRACT',
						'T_FINAL',
						'T_PRIVATE',
						'T_PROTECTED',
						'T_PUBLIC',
						'T_VAR',
						'T_UNSET',
						'T_ISSET',
						'T_EMPTY',
						'T_HALT_COMPILER',
						'T_CLASS',
						'T_TRAIT',
						'T_INTERFACE',
						'T_EXTENDS',
						'T_IMPLEMENTS',
						'T_OBJECT_OPERATOR',
						'T_DOUBLE_ARROW',
						'T_LIST',
						'T_ARRAY',
						'T_CALLABLE',
						'T_CLASS_C',
						'T_TRAIT_C',
						'T_METHOD_C',
						'T_FUNC_C',
						'T_LINE',
						'T_FILE',
						'T_COMMENT',
						'T_DOC_COMMENT',
						'T_OPEN_TAG',
						'T_OPEN_TAG_WITH_ECHO',
						'T_CLOSE_TAG',
						'T_WHITESPACE',
						'T_START_HEREDOC',
						'T_END_HEREDOC',
						'T_DOLLAR_OPEN_CURLY_BRACES',
						'T_CURLY_OPEN',
						'T_PAAMAYIM_NEKUDOTAYIM',
						'T_NAMESPACE',
						'T_NS_C',
						'T_DIR',
						'T_NS_SEPARATOR',
						'T_ELLIPSIS'
					],
					n = 'UNKNOWN';
				return (
					t.some(function(t) {
						return r.Constants[t] === e ? ((n = t), !0) : !1;
					}),
					n
				);
			}),
			(r.Parser.prototype.createTokenMap = function() {
				var e = {},
					t,
					n;
				for (n = 256; n < 1e3; ++n)
					r.Constants.T_OPEN_TAG_WITH_ECHO === n
						? (e[n] = r.Constants.T_ECHO)
						: r.Constants.T_CLOSE_TAG === n
						? (e[n] = 59)
						: 'UNKNOWN' !== (t = this.tokenName(n)) &&
						  (e[n] = this[t]);
				return e;
			}),
			(r.Parser.prototype.TOKEN_NONE = -1),
			(r.Parser.prototype.TOKEN_INVALID = 157),
			(r.Parser.prototype.TOKEN_MAP_SIZE = 392),
			(r.Parser.prototype.YYLAST = 889),
			(r.Parser.prototype.YY2TBLSTATE = 337),
			(r.Parser.prototype.YYGLAST = 410),
			(r.Parser.prototype.YYNLSTATES = 564),
			(r.Parser.prototype.YYUNEXPECTED = 32767),
			(r.Parser.prototype.YYDEFAULT = -32766),
			(r.Parser.prototype.YYERRTOK = 256),
			(r.Parser.prototype.T_INCLUDE = 257),
			(r.Parser.prototype.T_INCLUDE_ONCE = 258),
			(r.Parser.prototype.T_EVAL = 259),
			(r.Parser.prototype.T_REQUIRE = 260),
			(r.Parser.prototype.T_REQUIRE_ONCE = 261),
			(r.Parser.prototype.T_LOGICAL_OR = 262),
			(r.Parser.prototype.T_LOGICAL_XOR = 263),
			(r.Parser.prototype.T_LOGICAL_AND = 264),
			(r.Parser.prototype.T_PRINT = 265),
			(r.Parser.prototype.T_YIELD = 266),
			(r.Parser.prototype.T_DOUBLE_ARROW = 267),
			(r.Parser.prototype.T_YIELD_FROM = 268),
			(r.Parser.prototype.T_PLUS_EQUAL = 269),
			(r.Parser.prototype.T_MINUS_EQUAL = 270),
			(r.Parser.prototype.T_MUL_EQUAL = 271),
			(r.Parser.prototype.T_DIV_EQUAL = 272),
			(r.Parser.prototype.T_CONCAT_EQUAL = 273),
			(r.Parser.prototype.T_MOD_EQUAL = 274),
			(r.Parser.prototype.T_AND_EQUAL = 275),
			(r.Parser.prototype.T_OR_EQUAL = 276),
			(r.Parser.prototype.T_XOR_EQUAL = 277),
			(r.Parser.prototype.T_SL_EQUAL = 278),
			(r.Parser.prototype.T_SR_EQUAL = 279),
			(r.Parser.prototype.T_POW_EQUAL = 280),
			(r.Parser.prototype.T_COALESCE = 281),
			(r.Parser.prototype.T_BOOLEAN_OR = 282),
			(r.Parser.prototype.T_BOOLEAN_AND = 283),
			(r.Parser.prototype.T_IS_EQUAL = 284),
			(r.Parser.prototype.T_IS_NOT_EQUAL = 285),
			(r.Parser.prototype.T_IS_IDENTICAL = 286),
			(r.Parser.prototype.T_IS_NOT_IDENTICAL = 287),
			(r.Parser.prototype.T_SPACESHIP = 288),
			(r.Parser.prototype.T_IS_SMALLER_OR_EQUAL = 289),
			(r.Parser.prototype.T_IS_GREATER_OR_EQUAL = 290),
			(r.Parser.prototype.T_SL = 291),
			(r.Parser.prototype.T_SR = 292),
			(r.Parser.prototype.T_INSTANCEOF = 293),
			(r.Parser.prototype.T_INC = 294),
			(r.Parser.prototype.T_DEC = 295),
			(r.Parser.prototype.T_INT_CAST = 296),
			(r.Parser.prototype.T_DOUBLE_CAST = 297),
			(r.Parser.prototype.T_STRING_CAST = 298),
			(r.Parser.prototype.T_ARRAY_CAST = 299),
			(r.Parser.prototype.T_OBJECT_CAST = 300),
			(r.Parser.prototype.T_BOOL_CAST = 301),
			(r.Parser.prototype.T_UNSET_CAST = 302),
			(r.Parser.prototype.T_POW = 303),
			(r.Parser.prototype.T_NEW = 304),
			(r.Parser.prototype.T_CLONE = 305),
			(r.Parser.prototype.T_EXIT = 306),
			(r.Parser.prototype.T_IF = 307),
			(r.Parser.prototype.T_ELSEIF = 308),
			(r.Parser.prototype.T_ELSE = 309),
			(r.Parser.prototype.T_ENDIF = 310),
			(r.Parser.prototype.T_LNUMBER = 311),
			(r.Parser.prototype.T_DNUMBER = 312),
			(r.Parser.prototype.T_STRING = 313),
			(r.Parser.prototype.T_STRING_VARNAME = 314),
			(r.Parser.prototype.T_VARIABLE = 315),
			(r.Parser.prototype.T_NUM_STRING = 316),
			(r.Parser.prototype.T_INLINE_HTML = 317),
			(r.Parser.prototype.T_CHARACTER = 318),
			(r.Parser.prototype.T_BAD_CHARACTER = 319),
			(r.Parser.prototype.T_ENCAPSED_AND_WHITESPACE = 320),
			(r.Parser.prototype.T_CONSTANT_ENCAPSED_STRING = 321),
			(r.Parser.prototype.T_ECHO = 322),
			(r.Parser.prototype.T_DO = 323),
			(r.Parser.prototype.T_WHILE = 324),
			(r.Parser.prototype.T_ENDWHILE = 325),
			(r.Parser.prototype.T_FOR = 326),
			(r.Parser.prototype.T_ENDFOR = 327),
			(r.Parser.prototype.T_FOREACH = 328),
			(r.Parser.prototype.T_ENDFOREACH = 329),
			(r.Parser.prototype.T_DECLARE = 330),
			(r.Parser.prototype.T_ENDDECLARE = 331),
			(r.Parser.prototype.T_AS = 332),
			(r.Parser.prototype.T_SWITCH = 333),
			(r.Parser.prototype.T_ENDSWITCH = 334),
			(r.Parser.prototype.T_CASE = 335),
			(r.Parser.prototype.T_DEFAULT = 336),
			(r.Parser.prototype.T_BREAK = 337),
			(r.Parser.prototype.T_CONTINUE = 338),
			(r.Parser.prototype.T_GOTO = 339),
			(r.Parser.prototype.T_FUNCTION = 340),
			(r.Parser.prototype.T_CONST = 341),
			(r.Parser.prototype.T_RETURN = 342),
			(r.Parser.prototype.T_TRY = 343),
			(r.Parser.prototype.T_CATCH = 344),
			(r.Parser.prototype.T_FINALLY = 345),
			(r.Parser.prototype.T_THROW = 346),
			(r.Parser.prototype.T_USE = 347),
			(r.Parser.prototype.T_INSTEADOF = 348),
			(r.Parser.prototype.T_GLOBAL = 349),
			(r.Parser.prototype.T_STATIC = 350),
			(r.Parser.prototype.T_ABSTRACT = 351),
			(r.Parser.prototype.T_FINAL = 352),
			(r.Parser.prototype.T_PRIVATE = 353),
			(r.Parser.prototype.T_PROTECTED = 354),
			(r.Parser.prototype.T_PUBLIC = 355),
			(r.Parser.prototype.T_VAR = 356),
			(r.Parser.prototype.T_UNSET = 357),
			(r.Parser.prototype.T_ISSET = 358),
			(r.Parser.prototype.T_EMPTY = 359),
			(r.Parser.prototype.T_HALT_COMPILER = 360),
			(r.Parser.prototype.T_CLASS = 361),
			(r.Parser.prototype.T_TRAIT = 362),
			(r.Parser.prototype.T_INTERFACE = 363),
			(r.Parser.prototype.T_EXTENDS = 364),
			(r.Parser.prototype.T_IMPLEMENTS = 365),
			(r.Parser.prototype.T_OBJECT_OPERATOR = 366),
			(r.Parser.prototype.T_LIST = 367),
			(r.Parser.prototype.T_ARRAY = 368),
			(r.Parser.prototype.T_CALLABLE = 369),
			(r.Parser.prototype.T_CLASS_C = 370),
			(r.Parser.prototype.T_TRAIT_C = 371),
			(r.Parser.prototype.T_METHOD_C = 372),
			(r.Parser.prototype.T_FUNC_C = 373),
			(r.Parser.prototype.T_LINE = 374),
			(r.Parser.prototype.T_FILE = 375),
			(r.Parser.prototype.T_COMMENT = 376),
			(r.Parser.prototype.T_DOC_COMMENT = 377),
			(r.Parser.prototype.T_OPEN_TAG = 378),
			(r.Parser.prototype.T_OPEN_TAG_WITH_ECHO = 379),
			(r.Parser.prototype.T_CLOSE_TAG = 380),
			(r.Parser.prototype.T_WHITESPACE = 381),
			(r.Parser.prototype.T_START_HEREDOC = 382),
			(r.Parser.prototype.T_END_HEREDOC = 383),
			(r.Parser.prototype.T_DOLLAR_OPEN_CURLY_BRACES = 384),
			(r.Parser.prototype.T_CURLY_OPEN = 385),
			(r.Parser.prototype.T_PAAMAYIM_NEKUDOTAYIM = 386),
			(r.Parser.prototype.T_NAMESPACE = 387),
			(r.Parser.prototype.T_NS_C = 388),
			(r.Parser.prototype.T_DIR = 389),
			(r.Parser.prototype.T_NS_SEPARATOR = 390),
			(r.Parser.prototype.T_ELLIPSIS = 391),
			(r.Parser.prototype.terminals = [
				'$EOF',
				'error',
				'T_INCLUDE',
				'T_INCLUDE_ONCE',
				'T_EVAL',
				'T_REQUIRE',
				'T_REQUIRE_ONCE',
				"','",
				'T_LOGICAL_OR',
				'T_LOGICAL_XOR',
				'T_LOGICAL_AND',
				'T_PRINT',
				'T_YIELD',
				'T_DOUBLE_ARROW',
				'T_YIELD_FROM',
				"'='",
				'T_PLUS_EQUAL',
				'T_MINUS_EQUAL',
				'T_MUL_EQUAL',
				'T_DIV_EQUAL',
				'T_CONCAT_EQUAL',
				'T_MOD_EQUAL',
				'T_AND_EQUAL',
				'T_OR_EQUAL',
				'T_XOR_EQUAL',
				'T_SL_EQUAL',
				'T_SR_EQUAL',
				'T_POW_EQUAL',
				"'?'",
				"':'",
				'T_COALESCE',
				'T_BOOLEAN_OR',
				'T_BOOLEAN_AND',
				"'|'",
				"'^'",
				"'&'",
				'T_IS_EQUAL',
				'T_IS_NOT_EQUAL',
				'T_IS_IDENTICAL',
				'T_IS_NOT_IDENTICAL',
				'T_SPACESHIP',
				"'<'",
				'T_IS_SMALLER_OR_EQUAL',
				"'>'",
				'T_IS_GREATER_OR_EQUAL',
				'T_SL',
				'T_SR',
				"'+'",
				"'-'",
				"'.'",
				"'*'",
				"'/'",
				"'%'",
				"'!'",
				'T_INSTANCEOF',
				"'~'",
				'T_INC',
				'T_DEC',
				'T_INT_CAST',
				'T_DOUBLE_CAST',
				'T_STRING_CAST',
				'T_ARRAY_CAST',
				'T_OBJECT_CAST',
				'T_BOOL_CAST',
				'T_UNSET_CAST',
				"'@'",
				'T_POW',
				"'['",
				'T_NEW',
				'T_CLONE',
				'T_EXIT',
				'T_IF',
				'T_ELSEIF',
				'T_ELSE',
				'T_ENDIF',
				'T_LNUMBER',
				'T_DNUMBER',
				'T_STRING',
				'T_STRING_VARNAME',
				'T_VARIABLE',
				'T_NUM_STRING',
				'T_INLINE_HTML',
				'T_ENCAPSED_AND_WHITESPACE',
				'T_CONSTANT_ENCAPSED_STRING',
				'T_ECHO',
				'T_DO',
				'T_WHILE',
				'T_ENDWHILE',
				'T_FOR',
				'T_ENDFOR',
				'T_FOREACH',
				'T_ENDFOREACH',
				'T_DECLARE',
				'T_ENDDECLARE',
				'T_AS',
				'T_SWITCH',
				'T_ENDSWITCH',
				'T_CASE',
				'T_DEFAULT',
				'T_BREAK',
				'T_CONTINUE',
				'T_GOTO',
				'T_FUNCTION',
				'T_CONST',
				'T_RETURN',
				'T_TRY',
				'T_CATCH',
				'T_FINALLY',
				'T_THROW',
				'T_USE',
				'T_INSTEADOF',
				'T_GLOBAL',
				'T_STATIC',
				'T_ABSTRACT',
				'T_FINAL',
				'T_PRIVATE',
				'T_PROTECTED',
				'T_PUBLIC',
				'T_VAR',
				'T_UNSET',
				'T_ISSET',
				'T_EMPTY',
				'T_HALT_COMPILER',
				'T_CLASS',
				'T_TRAIT',
				'T_INTERFACE',
				'T_EXTENDS',
				'T_IMPLEMENTS',
				'T_OBJECT_OPERATOR',
				'T_LIST',
				'T_ARRAY',
				'T_CALLABLE',
				'T_CLASS_C',
				'T_TRAIT_C',
				'T_METHOD_C',
				'T_FUNC_C',
				'T_LINE',
				'T_FILE',
				'T_START_HEREDOC',
				'T_END_HEREDOC',
				'T_DOLLAR_OPEN_CURLY_BRACES',
				'T_CURLY_OPEN',
				'T_PAAMAYIM_NEKUDOTAYIM',
				'T_NAMESPACE',
				'T_NS_C',
				'T_DIR',
				'T_NS_SEPARATOR',
				'T_ELLIPSIS',
				"';'",
				"'{'",
				"'}'",
				"'('",
				"')'",
				"'`'",
				"']'",
				"'\"'",
				"'$'",
				'???'
			]),
			(r.Parser.prototype.translate = [
				0,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				53,
				155,
				157,
				156,
				52,
				35,
				157,
				151,
				152,
				50,
				47,
				7,
				48,
				49,
				51,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				29,
				148,
				41,
				15,
				43,
				28,
				65,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				67,
				157,
				154,
				34,
				157,
				153,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				149,
				33,
				150,
				55,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				157,
				1,
				2,
				3,
				4,
				5,
				6,
				8,
				9,
				10,
				11,
				12,
				13,
				14,
				16,
				17,
				18,
				19,
				20,
				21,
				22,
				23,
				24,
				25,
				26,
				27,
				30,
				31,
				32,
				36,
				37,
				38,
				39,
				40,
				42,
				44,
				45,
				46,
				54,
				56,
				57,
				58,
				59,
				60,
				61,
				62,
				63,
				64,
				66,
				68,
				69,
				70,
				71,
				72,
				73,
				74,
				75,
				76,
				77,
				78,
				79,
				80,
				81,
				157,
				157,
				82,
				83,
				84,
				85,
				86,
				87,
				88,
				89,
				90,
				91,
				92,
				93,
				94,
				95,
				96,
				97,
				98,
				99,
				100,
				101,
				102,
				103,
				104,
				105,
				106,
				107,
				108,
				109,
				110,
				111,
				112,
				113,
				114,
				115,
				116,
				117,
				118,
				119,
				120,
				121,
				122,
				123,
				124,
				125,
				126,
				127,
				128,
				129,
				130,
				131,
				132,
				133,
				134,
				135,
				136,
				137,
				157,
				157,
				157,
				157,
				157,
				157,
				138,
				139,
				140,
				141,
				142,
				143,
				144,
				145,
				146,
				147
			]),
			(r.Parser.prototype.yyaction = [
				569,
				570,
				571,
				572,
				573,
				215,
				574,
				575,
				576,
				612,
				613,
				0,
				27,
				99,
				100,
				101,
				102,
				103,
				104,
				105,
				106,
				107,
				108,
				109,
				110,
				-32766,
				-32766,
				-32766,
				95,
				96,
				97,
				24,
				240,
				226,
				-267,
				-32766,
				-32766,
				-32766,
				-32766,
				-32766,
				-32766,
				530,
				344,
				114,
				98,
				-32766,
				286,
				-32766,
				-32766,
				-32766,
				-32766,
				-32766,
				577,
				870,
				872,
				-32766,
				-32766,
				-32766,
				-32766,
				-32766,
				-32766,
				-32766,
				-32766,
				224,
				-32766,
				714,
				578,
				579,
				580,
				581,
				582,
				583,
				584,
				-32766,
				264,
				644,
				840,
				841,
				842,
				839,
				838,
				837,
				585,
				586,
				587,
				588,
				589,
				590,
				591,
				592,
				593,
				594,
				595,
				615,
				616,
				617,
				618,
				619,
				607,
				608,
				609,
				610,
				611,
				596,
				597,
				598,
				599,
				600,
				601,
				602,
				638,
				639,
				640,
				641,
				642,
				643,
				603,
				604,
				605,
				606,
				636,
				627,
				625,
				626,
				622,
				623,
				116,
				614,
				620,
				621,
				628,
				629,
				631,
				630,
				632,
				633,
				42,
				43,
				381,
				44,
				45,
				624,
				635,
				634,
				-214,
				46,
				47,
				289,
				48,
				-32767,
				-32767,
				-32767,
				-32767,
				90,
				91,
				92,
				93,
				94,
				267,
				241,
				22,
				840,
				841,
				842,
				839,
				838,
				837,
				832,
				-32766,
				-32766,
				-32766,
				306,
				1e3,
				1e3,
				1037,
				120,
				966,
				436,
				-423,
				244,
				797,
				49,
				50,
				660,
				661,
				272,
				362,
				51,
				-32766,
				52,
				219,
				220,
				53,
				54,
				55,
				56,
				57,
				58,
				59,
				60,
				1016,
				22,
				238,
				61,
				351,
				945,
				-32766,
				-32766,
				-32766,
				967,
				968,
				646,
				705,
				1e3,
				28,
				-456,
				125,
				966,
				-32766,
				-32766,
				-32766,
				715,
				398,
				399,
				216,
				1e3,
				-32766,
				339,
				-32766,
				-32766,
				-32766,
				-32766,
				25,
				222,
				980,
				552,
				355,
				378,
				-32766,
				-423,
				-32766,
				-32766,
				-32766,
				121,
				65,
				1045,
				408,
				1047,
				1046,
				274,
				274,
				131,
				244,
				-423,
				394,
				395,
				358,
				519,
				945,
				537,
				-423,
				111,
				-426,
				398,
				399,
				130,
				972,
				973,
				974,
				975,
				969,
				970,
				243,
				128,
				-422,
				-421,
				1013,
				409,
				976,
				971,
				353,
				791,
				792,
				7,
				-162,
				63,
				124,
				255,
				701,
				256,
				274,
				382,
				-122,
				-122,
				-122,
				-4,
				715,
				383,
				646,
				1042,
				-421,
				704,
				274,
				-219,
				33,
				17,
				384,
				-122,
				385,
				-122,
				386,
				-122,
				387,
				-122,
				369,
				388,
				-122,
				-122,
				-122,
				34,
				35,
				389,
				352,
				520,
				36,
				390,
				353,
				702,
				62,
				112,
				818,
				287,
				288,
				391,
				392,
				-422,
				-421,
				-161,
				350,
				393,
				40,
				38,
				690,
				735,
				396,
				397,
				361,
				22,
				122,
				-422,
				-421,
				-32766,
				-32766,
				-32766,
				791,
				792,
				-422,
				-421,
				-425,
				1e3,
				-456,
				-421,
				-238,
				966,
				409,
				41,
				382,
				353,
				717,
				535,
				-122,
				-32766,
				383,
				-32766,
				-32766,
				-421,
				704,
				21,
				813,
				33,
				17,
				384,
				-421,
				385,
				-466,
				386,
				224,
				387,
				-467,
				273,
				388,
				367,
				945,
				-458,
				34,
				35,
				389,
				352,
				345,
				36,
				390,
				248,
				247,
				62,
				254,
				715,
				287,
				288,
				391,
				392,
				399,
				-32766,
				-32766,
				-32766,
				393,
				295,
				1e3,
				652,
				735,
				396,
				397,
				117,
				115,
				113,
				814,
				119,
				72,
				73,
				74,
				-162,
				764,
				65,
				240,
				541,
				370,
				518,
				274,
				118,
				270,
				92,
				93,
				94,
				242,
				717,
				535,
				-4,
				26,
				1e3,
				75,
				76,
				77,
				78,
				79,
				80,
				81,
				82,
				83,
				84,
				85,
				86,
				87,
				88,
				89,
				90,
				91,
				92,
				93,
				94,
				95,
				96,
				97,
				547,
				240,
				713,
				715,
				382,
				276,
				-32766,
				-32766,
				126,
				945,
				383,
				-161,
				938,
				98,
				704,
				225,
				659,
				33,
				17,
				384,
				346,
				385,
				274,
				386,
				728,
				387,
				221,
				120,
				388,
				505,
				506,
				540,
				34,
				35,
				389,
				715,
				-238,
				36,
				390,
				1017,
				223,
				62,
				494,
				18,
				287,
				288,
				127,
				297,
				376,
				6,
				98,
				798,
				393,
				274,
				660,
				661,
				490,
				491,
				-466,
				39,
				-466,
				514,
				-467,
				539,
				-467,
				16,
				458,
				-458,
				315,
				791,
				792,
				829,
				553,
				382,
				817,
				563,
				653,
				538,
				765,
				383,
				449,
				751,
				535,
				704,
				448,
				435,
				33,
				17,
				384,
				430,
				385,
				646,
				386,
				359,
				387,
				357,
				647,
				388,
				673,
				429,
				1040,
				34,
				35,
				389,
				715,
				382,
				36,
				390,
				941,
				492,
				62,
				383,
				503,
				287,
				288,
				704,
				434,
				440,
				33,
				17,
				384,
				393,
				385,
				-32766,
				386,
				445,
				387,
				495,
				509,
				388,
				10,
				529,
				542,
				34,
				35,
				389,
				715,
				515,
				36,
				390,
				499,
				500,
				62,
				214,
				-80,
				287,
				288,
				452,
				269,
				736,
				717,
				535,
				488,
				393,
				356,
				266,
				979,
				265,
				730,
				982,
				722,
				358,
				338,
				493,
				548,
				0,
				294,
				737,
				0,
				3,
				0,
				309,
				0,
				0,
				382,
				0,
				0,
				271,
				0,
				0,
				383,
				0,
				717,
				535,
				704,
				227,
				0,
				33,
				17,
				384,
				9,
				385,
				0,
				386,
				0,
				387,
				-382,
				0,
				388,
				0,
				0,
				325,
				34,
				35,
				389,
				715,
				382,
				36,
				390,
				321,
				341,
				62,
				383,
				340,
				287,
				288,
				704,
				22,
				320,
				33,
				17,
				384,
				393,
				385,
				442,
				386,
				337,
				387,
				562,
				1e3,
				388,
				32,
				31,
				966,
				34,
				35,
				389,
				823,
				657,
				36,
				390,
				656,
				821,
				62,
				703,
				711,
				287,
				288,
				561,
				822,
				825,
				717,
				535,
				695,
				393,
				747,
				749,
				693,
				759,
				758,
				752,
				767,
				945,
				824,
				706,
				700,
				712,
				699,
				698,
				658,
				0,
				263,
				262,
				559,
				558,
				382,
				556,
				554,
				551,
				398,
				399,
				383,
				550,
				717,
				535,
				704,
				546,
				545,
				33,
				17,
				384,
				543,
				385,
				536,
				386,
				71,
				387,
				933,
				932,
				388,
				30,
				65,
				731,
				34,
				35,
				389,
				274,
				724,
				36,
				390,
				830,
				734,
				62,
				663,
				662,
				287,
				288,
				-32766,
				-32766,
				-32766,
				733,
				732,
				934,
				393,
				665,
				664,
				756,
				555,
				691,
				1041,
				1001,
				994,
				1006,
				1011,
				1014,
				757,
				1043,
				-32766,
				654,
				-32766,
				-32766,
				-32766,
				-32766,
				-32766,
				-32766,
				-32767,
				-32767,
				-32767,
				-32767,
				-32767,
				655,
				1044,
				717,
				535,
				-446,
				926,
				348,
				343,
				268,
				237,
				236,
				235,
				234,
				218,
				217,
				132,
				129,
				-426,
				-425,
				-424,
				123,
				20,
				23,
				70,
				69,
				29,
				37,
				64,
				68,
				66,
				67,
				-448,
				0,
				15,
				19,
				250,
				910,
				296,
				-217,
				467,
				484,
				909,
				472,
				528,
				913,
				11,
				964,
				955,
				-215,
				525,
				379,
				375,
				373,
				371,
				14,
				13,
				12,
				-214,
				0,
				-393,
				0,
				1005,
				1039,
				992,
				993,
				963,
				0,
				981
			]),
			(r.Parser.prototype.yycheck = [
				2,
				3,
				4,
				5,
				6,
				13,
				8,
				9,
				10,
				11,
				12,
				0,
				15,
				16,
				17,
				18,
				19,
				20,
				21,
				22,
				23,
				24,
				25,
				26,
				27,
				8,
				9,
				10,
				50,
				51,
				52,
				7,
				54,
				7,
				79,
				8,
				9,
				10,
				8,
				9,
				10,
				77,
				7,
				13,
				66,
				28,
				7,
				30,
				31,
				32,
				33,
				34,
				54,
				56,
				57,
				28,
				8,
				30,
				31,
				32,
				33,
				34,
				35,
				35,
				109,
				1,
				68,
				69,
				70,
				71,
				72,
				73,
				74,
				118,
				7,
				77,
				112,
				113,
				114,
				115,
				116,
				117,
				84,
				85,
				86,
				87,
				88,
				89,
				90,
				91,
				92,
				93,
				94,
				95,
				96,
				97,
				98,
				99,
				100,
				101,
				102,
				103,
				104,
				105,
				106,
				107,
				108,
				109,
				110,
				111,
				112,
				113,
				114,
				115,
				116,
				117,
				118,
				119,
				120,
				121,
				122,
				123,
				124,
				125,
				126,
				127,
				7,
				129,
				130,
				131,
				132,
				133,
				134,
				135,
				136,
				137,
				2,
				3,
				4,
				5,
				6,
				143,
				144,
				145,
				152,
				11,
				12,
				7,
				14,
				41,
				42,
				43,
				44,
				45,
				46,
				47,
				48,
				49,
				109,
				7,
				67,
				112,
				113,
				114,
				115,
				116,
				117,
				118,
				8,
				9,
				10,
				79,
				79,
				79,
				82,
				147,
				83,
				82,
				67,
				28,
				152,
				47,
				48,
				102,
				103,
				7,
				7,
				53,
				28,
				55,
				56,
				57,
				58,
				59,
				60,
				61,
				62,
				63,
				64,
				65,
				1,
				67,
				68,
				69,
				70,
				112,
				8,
				9,
				10,
				75,
				76,
				77,
				148,
				79,
				13,
				7,
				67,
				83,
				8,
				9,
				10,
				1,
				129,
				130,
				13,
				79,
				28,
				146,
				30,
				31,
				32,
				33,
				140,
				141,
				139,
				29,
				102,
				7,
				28,
				128,
				30,
				31,
				32,
				149,
				151,
				77,
				112,
				79,
				80,
				156,
				156,
				15,
				28,
				142,
				120,
				121,
				146,
				77,
				112,
				149,
				149,
				15,
				151,
				129,
				130,
				15,
				132,
				133,
				134,
				135,
				136,
				137,
				138,
				15,
				67,
				67,
				77,
				143,
				144,
				145,
				146,
				130,
				131,
				7,
				7,
				151,
				15,
				153,
				148,
				155,
				156,
				71,
				72,
				73,
				74,
				0,
				1,
				77,
				77,
				150,
				67,
				81,
				156,
				152,
				84,
				85,
				86,
				87,
				88,
				89,
				90,
				91,
				92,
				93,
				29,
				95,
				96,
				97,
				98,
				99,
				100,
				101,
				102,
				143,
				104,
				105,
				146,
				148,
				108,
				15,
				150,
				111,
				112,
				113,
				114,
				128,
				128,
				7,
				7,
				119,
				67,
				67,
				122,
				123,
				124,
				125,
				7,
				67,
				149,
				142,
				142,
				8,
				9,
				10,
				130,
				131,
				149,
				149,
				151,
				79,
				152,
				128,
				7,
				83,
				143,
				7,
				71,
				146,
				148,
				149,
				150,
				28,
				77,
				30,
				31,
				142,
				81,
				7,
				148,
				84,
				85,
				86,
				149,
				88,
				7,
				90,
				35,
				92,
				7,
				33,
				95,
				7,
				112,
				7,
				99,
				100,
				101,
				102,
				103,
				104,
				105,
				128,
				128,
				108,
				109,
				1,
				111,
				112,
				113,
				114,
				130,
				8,
				9,
				10,
				119,
				142,
				79,
				122,
				123,
				124,
				125,
				15,
				149,
				149,
				148,
				29,
				8,
				9,
				10,
				152,
				29,
				151,
				54,
				29,
				149,
				79,
				156,
				15,
				143,
				47,
				48,
				49,
				29,
				148,
				149,
				150,
				28,
				79,
				30,
				31,
				32,
				33,
				34,
				35,
				36,
				37,
				38,
				39,
				40,
				41,
				42,
				43,
				44,
				45,
				46,
				47,
				48,
				49,
				50,
				51,
				52,
				29,
				54,
				29,
				1,
				71,
				67,
				8,
				9,
				29,
				112,
				77,
				152,
				152,
				66,
				81,
				35,
				148,
				84,
				85,
				86,
				123,
				88,
				156,
				90,
				35,
				92,
				35,
				147,
				95,
				72,
				73,
				29,
				99,
				100,
				101,
				1,
				152,
				104,
				105,
				152,
				35,
				108,
				72,
				73,
				111,
				112,
				97,
				98,
				102,
				103,
				66,
				152,
				119,
				156,
				102,
				103,
				106,
				107,
				152,
				67,
				154,
				74,
				152,
				29,
				154,
				152,
				128,
				152,
				78,
				130,
				131,
				148,
				149,
				71,
				148,
				149,
				148,
				149,
				148,
				77,
				77,
				148,
				149,
				81,
				77,
				77,
				84,
				85,
				86,
				77,
				88,
				77,
				90,
				77,
				92,
				77,
				77,
				95,
				77,
				77,
				77,
				99,
				100,
				101,
				1,
				71,
				104,
				105,
				79,
				79,
				108,
				77,
				79,
				111,
				112,
				81,
				79,
				82,
				84,
				85,
				86,
				119,
				88,
				82,
				90,
				86,
				92,
				87,
				96,
				95,
				94,
				89,
				29,
				99,
				100,
				101,
				1,
				91,
				104,
				105,
				93,
				96,
				108,
				94,
				94,
				111,
				112,
				94,
				110,
				123,
				148,
				149,
				109,
				119,
				102,
				127,
				139,
				126,
				147,
				139,
				150,
				146,
				149,
				154,
				29,
				-1,
				142,
				123,
				-1,
				142,
				-1,
				146,
				-1,
				-1,
				71,
				-1,
				-1,
				126,
				-1,
				-1,
				77,
				-1,
				148,
				149,
				81,
				35,
				-1,
				84,
				85,
				86,
				142,
				88,
				-1,
				90,
				-1,
				92,
				142,
				-1,
				95,
				-1,
				-1,
				146,
				99,
				100,
				101,
				1,
				71,
				104,
				105,
				146,
				146,
				108,
				77,
				146,
				111,
				112,
				81,
				67,
				146,
				84,
				85,
				86,
				119,
				88,
				146,
				90,
				149,
				92,
				148,
				79,
				95,
				148,
				148,
				83,
				99,
				100,
				101,
				148,
				148,
				104,
				105,
				148,
				148,
				108,
				148,
				148,
				111,
				112,
				148,
				148,
				148,
				148,
				149,
				148,
				119,
				148,
				148,
				148,
				148,
				148,
				148,
				148,
				112,
				148,
				148,
				148,
				148,
				148,
				148,
				148,
				-1,
				149,
				149,
				149,
				149,
				71,
				149,
				149,
				149,
				129,
				130,
				77,
				149,
				148,
				149,
				81,
				149,
				149,
				84,
				85,
				86,
				149,
				88,
				149,
				90,
				149,
				92,
				150,
				150,
				95,
				151,
				151,
				150,
				99,
				100,
				101,
				156,
				150,
				104,
				105,
				150,
				150,
				108,
				150,
				150,
				111,
				112,
				8,
				9,
				10,
				150,
				150,
				150,
				119,
				150,
				150,
				150,
				150,
				150,
				150,
				150,
				150,
				150,
				150,
				150,
				150,
				150,
				28,
				150,
				30,
				31,
				32,
				33,
				34,
				35,
				36,
				37,
				38,
				39,
				40,
				150,
				150,
				148,
				149,
				151,
				153,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				151,
				-1,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				152,
				-1,
				153,
				-1,
				154,
				154,
				154,
				154,
				154,
				-1,
				155
			]),
			(r.Parser.prototype.yybase = [
				0,
				220,
				295,
				94,
				180,
				560,
				-2,
				-2,
				-2,
				-2,
				-36,
				473,
				574,
				606,
				574,
				505,
				404,
				675,
				675,
				675,
				28,
				351,
				462,
				462,
				462,
				461,
				396,
				476,
				451,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				401,
				64,
				201,
				568,
				704,
				713,
				708,
				702,
				714,
				520,
				706,
				705,
				211,
				650,
				651,
				450,
				652,
				653,
				654,
				655,
				709,
				480,
				703,
				712,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				48,
				30,
				469,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				403,
				160,
				160,
				160,
				343,
				210,
				208,
				198,
				17,
				233,
				27,
				780,
				780,
				780,
				780,
				780,
				108,
				108,
				108,
				108,
				621,
				621,
				93,
				280,
				280,
				280,
				280,
				280,
				280,
				280,
				280,
				280,
				280,
				280,
				632,
				641,
				642,
				643,
				392,
				392,
				151,
				151,
				151,
				151,
				368,
				-45,
				146,
				224,
				224,
				95,
				410,
				491,
				733,
				199,
				199,
				111,
				207,
				-22,
				-22,
				-22,
				81,
				506,
				92,
				92,
				233,
				233,
				273,
				233,
				423,
				423,
				423,
				221,
				221,
				221,
				221,
				221,
				110,
				221,
				221,
				221,
				617,
				512,
				168,
				516,
				647,
				397,
				503,
				656,
				274,
				381,
				377,
				538,
				535,
				337,
				523,
				337,
				421,
				441,
				428,
				525,
				337,
				337,
				285,
				401,
				394,
				378,
				567,
				474,
				339,
				564,
				140,
				179,
				409,
				399,
				384,
				594,
				561,
				711,
				330,
				710,
				358,
				149,
				378,
				378,
				378,
				370,
				593,
				548,
				355,
				-8,
				646,
				484,
				277,
				417,
				386,
				645,
				635,
				230,
				634,
				276,
				331,
				356,
				565,
				485,
				485,
				485,
				485,
				485,
				485,
				460,
				485,
				483,
				691,
				691,
				478,
				501,
				460,
				696,
				460,
				485,
				691,
				460,
				460,
				502,
				485,
				522,
				522,
				483,
				508,
				499,
				691,
				691,
				499,
				478,
				460,
				571,
				551,
				514,
				482,
				413,
				413,
				514,
				460,
				413,
				501,
				413,
				11,
				697,
				699,
				444,
				700,
				695,
				698,
				676,
				694,
				493,
				615,
				497,
				515,
				684,
				683,
				693,
				479,
				489,
				620,
				692,
				549,
				592,
				487,
				246,
				314,
				498,
				463,
				689,
				523,
				486,
				455,
				455,
				455,
				463,
				687,
				455,
				455,
				455,
				455,
				455,
				455,
				455,
				455,
				732,
				24,
				495,
				510,
				591,
				590,
				589,
				406,
				588,
				496,
				524,
				422,
				599,
				488,
				549,
				549,
				649,
				727,
				673,
				490,
				682,
				716,
				690,
				555,
				119,
				271,
				681,
				648,
				543,
				492,
				534,
				680,
				598,
				246,
				715,
				494,
				672,
				549,
				671,
				455,
				674,
				701,
				730,
				731,
				688,
				728,
				722,
				152,
				526,
				587,
				178,
				729,
				659,
				596,
				595,
				554,
				725,
				707,
				721,
				720,
				178,
				576,
				511,
				717,
				518,
				677,
				504,
				678,
				613,
				258,
				657,
				686,
				584,
				724,
				723,
				726,
				583,
				582,
				609,
				608,
				250,
				236,
				685,
				442,
				458,
				517,
				581,
				500,
				628,
				604,
				679,
				580,
				579,
				623,
				619,
				718,
				521,
				486,
				519,
				509,
				507,
				513,
				600,
				618,
				719,
				206,
				578,
				586,
				573,
				481,
				572,
				631,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				134,
				134,
				-2,
				-2,
				-2,
				0,
				0,
				0,
				0,
				-2,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				134,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				418,
				-3,
				418,
				418,
				-3,
				418,
				418,
				418,
				418,
				418,
				418,
				-22,
				-22,
				-22,
				-22,
				221,
				221,
				221,
				221,
				221,
				221,
				221,
				221,
				221,
				221,
				221,
				221,
				221,
				221,
				49,
				49,
				49,
				49,
				-22,
				-22,
				221,
				221,
				221,
				221,
				221,
				49,
				221,
				221,
				221,
				92,
				221,
				92,
				92,
				337,
				337,
				0,
				0,
				0,
				0,
				0,
				485,
				92,
				0,
				0,
				0,
				0,
				0,
				0,
				485,
				485,
				485,
				0,
				0,
				0,
				0,
				0,
				485,
				0,
				0,
				0,
				337,
				92,
				0,
				420,
				420,
				178,
				420,
				420,
				0,
				0,
				0,
				485,
				485,
				0,
				508,
				0,
				0,
				0,
				0,
				691,
				0,
				0,
				0,
				0,
				0,
				455,
				119,
				682,
				0,
				39,
				0,
				0,
				0,
				0,
				0,
				490,
				39,
				26,
				0,
				26,
				0,
				0,
				455,
				455,
				455,
				0,
				490,
				490,
				0,
				0,
				67,
				490,
				0,
				0,
				0,
				67,
				35,
				0,
				35,
				0,
				0,
				0,
				178
			]),
			(r.Parser.prototype.yydefault = [
				3,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				468,
				468,
				468,
				32767,
				32767,
				32767,
				32767,
				285,
				460,
				285,
				285,
				32767,
				419,
				419,
				419,
				419,
				419,
				419,
				419,
				460,
				32767,
				32767,
				32767,
				32767,
				32767,
				364,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				465,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				347,
				348,
				350,
				351,
				284,
				420,
				237,
				464,
				283,
				116,
				246,
				239,
				191,
				282,
				223,
				119,
				312,
				365,
				314,
				363,
				367,
				313,
				290,
				294,
				295,
				296,
				297,
				298,
				299,
				300,
				301,
				302,
				303,
				304,
				305,
				288,
				289,
				366,
				344,
				343,
				342,
				310,
				311,
				287,
				315,
				317,
				287,
				316,
				333,
				334,
				331,
				332,
				335,
				336,
				337,
				338,
				339,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				269,
				269,
				269,
				269,
				324,
				325,
				229,
				229,
				229,
				229,
				32767,
				270,
				32767,
				229,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				413,
				341,
				319,
				320,
				318,
				32767,
				392,
				32767,
				394,
				307,
				309,
				387,
				291,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				389,
				421,
				421,
				32767,
				32767,
				32767,
				381,
				32767,
				159,
				210,
				212,
				397,
				32767,
				32767,
				32767,
				32767,
				32767,
				329,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				474,
				32767,
				32767,
				32767,
				32767,
				32767,
				421,
				32767,
				32767,
				32767,
				321,
				322,
				323,
				32767,
				32767,
				32767,
				421,
				421,
				32767,
				32767,
				421,
				32767,
				421,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				163,
				32767,
				32767,
				395,
				395,
				32767,
				32767,
				163,
				390,
				163,
				32767,
				32767,
				163,
				163,
				176,
				32767,
				174,
				174,
				32767,
				32767,
				178,
				32767,
				435,
				178,
				32767,
				163,
				196,
				196,
				373,
				165,
				231,
				231,
				373,
				163,
				231,
				32767,
				231,
				32767,
				32767,
				32767,
				82,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				383,
				32767,
				32767,
				32767,
				401,
				32767,
				414,
				433,
				381,
				32767,
				327,
				328,
				330,
				32767,
				423,
				352,
				353,
				354,
				355,
				356,
				357,
				358,
				360,
				32767,
				461,
				386,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				84,
				108,
				245,
				32767,
				473,
				84,
				384,
				32767,
				473,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				286,
				32767,
				32767,
				32767,
				84,
				32767,
				84,
				32767,
				32767,
				457,
				32767,
				32767,
				421,
				385,
				32767,
				326,
				398,
				439,
				32767,
				32767,
				422,
				32767,
				32767,
				218,
				84,
				32767,
				177,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				401,
				32767,
				32767,
				179,
				32767,
				32767,
				421,
				32767,
				32767,
				32767,
				32767,
				32767,
				281,
				32767,
				32767,
				32767,
				32767,
				32767,
				421,
				32767,
				32767,
				32767,
				32767,
				222,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				82,
				60,
				32767,
				263,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				32767,
				121,
				121,
				3,
				3,
				121,
				121,
				121,
				121,
				121,
				121,
				121,
				121,
				121,
				121,
				121,
				121,
				121,
				121,
				121,
				248,
				154,
				248,
				204,
				248,
				248,
				207,
				196,
				196,
				255
			]),
			(r.Parser.prototype.yygoto = [
				163,
				163,
				135,
				135,
				135,
				146,
				148,
				179,
				164,
				161,
				145,
				161,
				161,
				161,
				162,
				162,
				162,
				162,
				162,
				162,
				162,
				145,
				157,
				158,
				159,
				160,
				176,
				174,
				177,
				410,
				411,
				299,
				412,
				415,
				416,
				417,
				418,
				419,
				420,
				421,
				422,
				857,
				136,
				137,
				138,
				139,
				140,
				141,
				142,
				143,
				144,
				147,
				173,
				175,
				178,
				195,
				198,
				199,
				201,
				202,
				204,
				205,
				206,
				207,
				208,
				209,
				210,
				211,
				212,
				213,
				232,
				233,
				251,
				252,
				253,
				316,
				317,
				318,
				462,
				180,
				181,
				182,
				183,
				184,
				185,
				186,
				187,
				188,
				189,
				190,
				191,
				192,
				193,
				149,
				194,
				150,
				165,
				166,
				167,
				196,
				168,
				151,
				152,
				153,
				169,
				154,
				197,
				133,
				170,
				155,
				171,
				172,
				156,
				521,
				200,
				257,
				246,
				464,
				432,
				687,
				649,
				278,
				481,
				482,
				527,
				200,
				437,
				437,
				437,
				766,
				5,
				746,
				650,
				557,
				437,
				426,
				775,
				770,
				428,
				431,
				444,
				465,
				466,
				468,
				483,
				279,
				651,
				336,
				450,
				453,
				437,
				560,
				485,
				487,
				508,
				511,
				763,
				516,
				517,
				777,
				524,
				762,
				526,
				532,
				773,
				534,
				480,
				480,
				965,
				965,
				965,
				965,
				965,
				965,
				965,
				965,
				965,
				965,
				965,
				965,
				413,
				413,
				413,
				413,
				413,
				413,
				413,
				413,
				413,
				413,
				413,
				413,
				413,
				413,
				942,
				502,
				478,
				496,
				512,
				456,
				298,
				437,
				437,
				451,
				471,
				437,
				437,
				674,
				437,
				229,
				456,
				230,
				231,
				463,
				828,
				533,
				681,
				438,
				513,
				826,
				461,
				475,
				460,
				414,
				414,
				414,
				414,
				414,
				414,
				414,
				414,
				414,
				414,
				414,
				414,
				414,
				414,
				301,
				674,
				674,
				443,
				454,
				1033,
				1033,
				1034,
				1034,
				425,
				531,
				425,
				708,
				750,
				800,
				457,
				372,
				1033,
				943,
				1034,
				1026,
				300,
				1018,
				497,
				8,
				313,
				904,
				796,
				944,
				996,
				785,
				789,
				1007,
				285,
				670,
				1036,
				329,
				307,
				310,
				804,
				668,
				544,
				332,
				935,
				940,
				366,
				807,
				678,
				477,
				377,
				754,
				844,
				0,
				667,
				667,
				675,
				675,
				675,
				677,
				0,
				666,
				323,
				498,
				328,
				312,
				312,
				258,
				259,
				283,
				459,
				261,
				322,
				284,
				326,
				486,
				280,
				281,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				790,
				790,
				790,
				790,
				946,
				0,
				946,
				790,
				790,
				1004,
				790,
				1004,
				0,
				0,
				0,
				0,
				836,
				0,
				1015,
				1015,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				744,
				744,
				744,
				720,
				744,
				0,
				739,
				745,
				721,
				780,
				780,
				1023,
				0,
				0,
				1002,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				806,
				0,
				806,
				0,
				0,
				0,
				0,
				1008,
				1009
			]),
			(r.Parser.prototype.yygcheck = [
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				52,
				45,
				112,
				112,
				80,
				8,
				10,
				10,
				64,
				55,
				55,
				55,
				45,
				8,
				8,
				8,
				10,
				92,
				10,
				11,
				10,
				8,
				10,
				10,
				10,
				38,
				38,
				38,
				38,
				38,
				38,
				62,
				62,
				12,
				62,
				28,
				8,
				8,
				28,
				28,
				28,
				28,
				28,
				28,
				28,
				28,
				28,
				28,
				28,
				28,
				28,
				28,
				28,
				70,
				70,
				70,
				70,
				70,
				70,
				70,
				70,
				70,
				70,
				70,
				70,
				70,
				70,
				113,
				113,
				113,
				113,
				113,
				113,
				113,
				113,
				113,
				113,
				113,
				113,
				113,
				113,
				76,
				56,
				35,
				35,
				56,
				69,
				56,
				8,
				8,
				8,
				8,
				8,
				8,
				19,
				8,
				60,
				69,
				60,
				60,
				7,
				7,
				7,
				25,
				8,
				7,
				7,
				2,
				2,
				8,
				115,
				115,
				115,
				115,
				115,
				115,
				115,
				115,
				115,
				115,
				115,
				115,
				115,
				115,
				53,
				19,
				19,
				53,
				53,
				123,
				123,
				124,
				124,
				109,
				5,
				109,
				44,
				29,
				78,
				114,
				53,
				123,
				76,
				124,
				122,
				41,
				120,
				43,
				53,
				42,
				96,
				74,
				76,
				76,
				72,
				75,
				117,
				14,
				21,
				123,
				18,
				9,
				13,
				79,
				20,
				66,
				17,
				102,
				104,
				58,
				81,
				22,
				59,
				100,
				63,
				94,
				-1,
				19,
				19,
				19,
				19,
				19,
				19,
				-1,
				19,
				45,
				45,
				45,
				45,
				45,
				45,
				45,
				45,
				45,
				45,
				45,
				45,
				45,
				45,
				64,
				64,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				52,
				52,
				52,
				52,
				52,
				-1,
				52,
				52,
				52,
				80,
				52,
				80,
				-1,
				-1,
				-1,
				-1,
				92,
				-1,
				80,
				80,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				52,
				52,
				52,
				52,
				52,
				-1,
				52,
				52,
				52,
				69,
				69,
				69,
				-1,
				-1,
				80,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				-1,
				80,
				-1,
				80,
				-1,
				-1,
				-1,
				-1,
				80,
				80
			]),
			(r.Parser.prototype.yygbase = [
				0,
				0,
				-317,
				0,
				0,
				237,
				0,
				210,
				-136,
				4,
				118,
				130,
				144,
				-10,
				16,
				0,
				0,
				-59,
				10,
				-47,
				-9,
				7,
				-77,
				-20,
				0,
				209,
				0,
				0,
				-388,
				234,
				0,
				0,
				0,
				0,
				0,
				165,
				0,
				0,
				103,
				0,
				0,
				225,
				44,
				45,
				235,
				84,
				0,
				0,
				0,
				0,
				0,
				0,
				109,
				-115,
				0,
				-113,
				-179,
				0,
				-78,
				-81,
				-347,
				0,
				-122,
				-80,
				-249,
				0,
				-19,
				0,
				0,
				169,
				-48,
				0,
				26,
				0,
				22,
				24,
				-99,
				0,
				230,
				-13,
				114,
				-79,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				120,
				0,
				-90,
				0,
				23,
				0,
				0,
				0,
				-89,
				0,
				-67,
				0,
				-69,
				0,
				0,
				0,
				0,
				8,
				0,
				0,
				-140,
				-34,
				229,
				9,
				0,
				21,
				0,
				0,
				218,
				0,
				233,
				-3,
				-1,
				0
			]),
			(r.Parser.prototype.yygdefault = [
				-32768,
				380,
				565,
				2,
				566,
				637,
				645,
				504,
				400,
				433,
				748,
				688,
				689,
				303,
				342,
				401,
				302,
				330,
				324,
				676,
				669,
				671,
				679,
				134,
				333,
				682,
				1,
				684,
				439,
				716,
				291,
				692,
				292,
				507,
				694,
				446,
				696,
				697,
				427,
				304,
				305,
				447,
				311,
				479,
				707,
				203,
				308,
				709,
				290,
				710,
				719,
				335,
				293,
				510,
				489,
				469,
				501,
				402,
				363,
				476,
				228,
				455,
				473,
				753,
				277,
				761,
				549,
				769,
				772,
				403,
				404,
				470,
				784,
				368,
				794,
				788,
				960,
				319,
				799,
				805,
				991,
				808,
				811,
				349,
				331,
				327,
				815,
				816,
				4,
				820,
				522,
				523,
				835,
				239,
				843,
				856,
				347,
				923,
				925,
				441,
				374,
				936,
				360,
				334,
				939,
				995,
				354,
				405,
				364,
				952,
				260,
				282,
				245,
				406,
				423,
				249,
				407,
				365,
				998,
				314,
				1019,
				424,
				1027,
				1035,
				275,
				474
			]),
			(r.Parser.prototype.yylhs = [
				0,
				1,
				3,
				3,
				2,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				5,
				6,
				6,
				6,
				6,
				6,
				6,
				6,
				7,
				7,
				8,
				8,
				9,
				4,
				4,
				4,
				4,
				4,
				4,
				4,
				4,
				4,
				4,
				4,
				14,
				14,
				15,
				15,
				15,
				15,
				17,
				17,
				13,
				13,
				18,
				18,
				19,
				19,
				20,
				20,
				21,
				21,
				16,
				16,
				22,
				24,
				24,
				25,
				26,
				26,
				28,
				27,
				27,
				27,
				27,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				29,
				10,
				10,
				48,
				48,
				51,
				51,
				50,
				49,
				49,
				42,
				42,
				53,
				53,
				54,
				54,
				11,
				12,
				12,
				12,
				57,
				57,
				57,
				58,
				58,
				61,
				61,
				59,
				59,
				62,
				62,
				36,
				36,
				44,
				44,
				47,
				47,
				47,
				46,
				46,
				63,
				37,
				37,
				37,
				37,
				64,
				64,
				65,
				65,
				66,
				66,
				34,
				34,
				30,
				30,
				67,
				32,
				32,
				68,
				31,
				31,
				33,
				33,
				43,
				43,
				43,
				43,
				55,
				55,
				71,
				71,
				72,
				72,
				74,
				74,
				75,
				75,
				75,
				73,
				73,
				56,
				56,
				76,
				76,
				77,
				77,
				78,
				78,
				78,
				39,
				39,
				79,
				40,
				40,
				81,
				81,
				60,
				60,
				82,
				82,
				82,
				82,
				87,
				87,
				88,
				88,
				89,
				89,
				89,
				89,
				89,
				90,
				91,
				91,
				86,
				86,
				83,
				83,
				85,
				85,
				93,
				93,
				92,
				92,
				92,
				92,
				92,
				92,
				84,
				84,
				94,
				94,
				41,
				41,
				35,
				35,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				23,
				101,
				95,
				95,
				100,
				100,
				103,
				103,
				104,
				105,
				105,
				105,
				109,
				109,
				52,
				52,
				52,
				96,
				96,
				107,
				107,
				97,
				97,
				99,
				99,
				99,
				102,
				102,
				113,
				113,
				70,
				115,
				115,
				115,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				98,
				38,
				38,
				111,
				111,
				111,
				106,
				106,
				106,
				116,
				116,
				116,
				116,
				116,
				116,
				45,
				45,
				45,
				80,
				80,
				80,
				118,
				110,
				110,
				110,
				110,
				110,
				110,
				108,
				108,
				108,
				117,
				117,
				117,
				117,
				69,
				119,
				119,
				120,
				120,
				120,
				120,
				120,
				114,
				121,
				121,
				122,
				122,
				122,
				122,
				122,
				112,
				112,
				112,
				112,
				124,
				123,
				123,
				123,
				123,
				123,
				123,
				123,
				125,
				125,
				125
			]),
			(r.Parser.prototype.yylen = [
				1,
				1,
				2,
				0,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				3,
				1,
				1,
				1,
				1,
				1,
				3,
				5,
				4,
				3,
				4,
				2,
				3,
				1,
				1,
				7,
				8,
				6,
				7,
				3,
				1,
				3,
				1,
				3,
				1,
				1,
				3,
				1,
				2,
				1,
				2,
				3,
				1,
				3,
				3,
				1,
				3,
				2,
				0,
				1,
				1,
				1,
				1,
				1,
				3,
				7,
				10,
				5,
				7,
				9,
				5,
				3,
				3,
				3,
				3,
				3,
				3,
				1,
				2,
				5,
				7,
				9,
				5,
				6,
				3,
				3,
				2,
				2,
				1,
				1,
				1,
				0,
				2,
				1,
				3,
				8,
				0,
				4,
				1,
				3,
				0,
				1,
				0,
				1,
				10,
				7,
				6,
				5,
				1,
				2,
				2,
				0,
				2,
				0,
				2,
				0,
				2,
				1,
				3,
				1,
				4,
				1,
				4,
				1,
				1,
				4,
				1,
				3,
				3,
				3,
				4,
				4,
				5,
				0,
				2,
				4,
				3,
				1,
				1,
				1,
				4,
				0,
				2,
				5,
				0,
				2,
				6,
				0,
				2,
				0,
				3,
				1,
				2,
				1,
				1,
				1,
				0,
				1,
				3,
				4,
				6,
				1,
				2,
				1,
				1,
				1,
				0,
				1,
				0,
				2,
				2,
				3,
				1,
				3,
				1,
				2,
				2,
				3,
				1,
				1,
				3,
				1,
				1,
				3,
				2,
				0,
				3,
				4,
				9,
				3,
				1,
				3,
				0,
				2,
				4,
				5,
				4,
				4,
				4,
				3,
				1,
				1,
				1,
				3,
				1,
				1,
				0,
				1,
				1,
				2,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				3,
				1,
				3,
				3,
				1,
				0,
				1,
				1,
				3,
				3,
				3,
				4,
				1,
				2,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				2,
				2,
				2,
				2,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				2,
				2,
				2,
				2,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				3,
				5,
				4,
				3,
				4,
				4,
				2,
				2,
				4,
				2,
				2,
				2,
				2,
				2,
				2,
				2,
				2,
				2,
				2,
				2,
				1,
				3,
				2,
				1,
				2,
				4,
				2,
				10,
				11,
				7,
				3,
				2,
				0,
				4,
				1,
				3,
				2,
				2,
				2,
				4,
				1,
				1,
				1,
				2,
				3,
				1,
				1,
				1,
				1,
				0,
				3,
				0,
				1,
				1,
				0,
				1,
				1,
				3,
				3,
				4,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				1,
				3,
				2,
				3,
				3,
				0,
				1,
				1,
				3,
				1,
				1,
				3,
				1,
				1,
				4,
				4,
				4,
				1,
				4,
				1,
				1,
				3,
				1,
				4,
				2,
				3,
				1,
				4,
				4,
				3,
				3,
				3,
				1,
				3,
				1,
				1,
				3,
				1,
				1,
				4,
				3,
				1,
				1,
				1,
				3,
				3,
				0,
				1,
				3,
				1,
				3,
				1,
				4,
				2,
				0,
				2,
				2,
				1,
				2,
				1,
				1,
				4,
				3,
				3,
				3,
				6,
				3,
				1,
				1,
				1
			]),
			(t.PHP = r);
	}),
	define('ace/mode/php_worker', [
		'require',
		'exports',
		'module',
		'ace/lib/oop',
		'ace/worker/mirror',
		'ace/mode/php/php'
	], function(e, t, n) {
		'use strict';
		var r = e('../lib/oop'),
			i = e('../worker/mirror').Mirror,
			s = e('./php/php').PHP,
			o = (t.PhpWorker = function(e) {
				i.call(this, e), this.setTimeout(500);
			});
		r.inherits(o, i),
			function() {
				(this.setOptions = function(e) {
					this.inlinePhp = e && e.inline;
				}),
					(this.onUpdate = function() {
						var e = this.doc.getValue(),
							t = [];
						this.inlinePhp && (e = '<?' + e + '?>');
						var n = s.Lexer(e, { short_open_tag: 1 });
						try {
							new s.Parser(n);
						} catch (r) {
							t.push({
								row: r.line - 1,
								column: null,
								text:
									r.message.charAt(0).toUpperCase() +
									r.message.substring(1),
								type: 'error'
							});
						}
						this.sender.emit('annotate', t);
					});
			}.call(o.prototype);
	}),
	define('ace/lib/es5-shim', ['require', 'exports', 'module'], function(
		e,
		t,
		n
	) {
		function r() {}
		function w(e) {
			try {
				return (
					Object.defineProperty(e, 'sentinel', {}), 'sentinel' in e
				);
			} catch (t) {}
		}
		function H(e) {
			return (
				(e = +e),
				e !== e
					? (e = 0)
					: e !== 0 &&
					  e !== 1 / 0 &&
					  e !== -1 / 0 &&
					  (e = (e > 0 || -1) * Math.floor(Math.abs(e))),
				e
			);
		}
		function B(e) {
			var t = typeof e;
			return (
				e === null ||
				t === 'undefined' ||
				t === 'boolean' ||
				t === 'number' ||
				t === 'string'
			);
		}
		function j(e) {
			var t, n, r;
			if (B(e)) return e;
			n = e.valueOf;
			if (typeof n == 'function') {
				t = n.call(e);
				if (B(t)) return t;
			}
			r = e.toString;
			if (typeof r == 'function') {
				t = r.call(e);
				if (B(t)) return t;
			}
			throw new TypeError();
		}
		Function.prototype.bind ||
			(Function.prototype.bind = function(t) {
				var n = this;
				if (typeof n != 'function')
					throw new TypeError(
						'Function.prototype.bind called on incompatible ' + n
					);
				var i = u.call(arguments, 1),
					s = function() {
						if (this instanceof s) {
							var e = n.apply(this, i.concat(u.call(arguments)));
							return Object(e) === e ? e : this;
						}
						return n.apply(t, i.concat(u.call(arguments)));
					};
				return (
					n.prototype &&
						((r.prototype = n.prototype),
						(s.prototype = new r()),
						(r.prototype = null)),
					s
				);
			});
		var i = Function.prototype.call,
			s = Array.prototype,
			o = Object.prototype,
			u = s.slice,
			a = i.bind(o.toString),
			f = i.bind(o.hasOwnProperty),
			l,
			c,
			h,
			p,
			d;
		if ((d = f(o, '__defineGetter__')))
			(l = i.bind(o.__defineGetter__)),
				(c = i.bind(o.__defineSetter__)),
				(h = i.bind(o.__lookupGetter__)),
				(p = i.bind(o.__lookupSetter__));
		if ([1, 2].splice(0).length != 2)
			if (
				!(function() {
					function e(e) {
						var t = new Array(e + 2);
						return (t[0] = t[1] = 0), t;
					}
					var t = [],
						n;
					t.splice.apply(t, e(20)),
						t.splice.apply(t, e(26)),
						(n = t.length),
						t.splice(5, 0, 'XXX'),
						n + 1 == t.length;
					if (n + 1 == t.length) return !0;
				})()
			)
				Array.prototype.splice = function(e, t) {
					var n = this.length;
					e > 0
						? e > n && (e = n)
						: e == void 0
						? (e = 0)
						: e < 0 && (e = Math.max(n + e, 0)),
						e + t < n || (t = n - e);
					var r = this.slice(e, e + t),
						i = u.call(arguments, 2),
						s = i.length;
					if (e === n) s && this.push.apply(this, i);
					else {
						var o = Math.min(t, n - e),
							a = e + o,
							f = a + s - o,
							l = n - a,
							c = n - o;
						if (f < a)
							for (var h = 0; h < l; ++h)
								this[f + h] = this[a + h];
						else if (f > a)
							for (h = l; h--; ) this[f + h] = this[a + h];
						if (s && e === c)
							(this.length = c), this.push.apply(this, i);
						else {
							this.length = c + s;
							for (h = 0; h < s; ++h) this[e + h] = i[h];
						}
					}
					return r;
				};
			else {
				var v = Array.prototype.splice;
				Array.prototype.splice = function(e, t) {
					return arguments.length
						? v.apply(
								this,
								[
									e === void 0 ? 0 : e,
									t === void 0 ? this.length - e : t
								].concat(u.call(arguments, 2))
						  )
						: [];
				};
			}
		Array.isArray ||
			(Array.isArray = function(t) {
				return a(t) == '[object Array]';
			});
		var m = Object('a'),
			g = m[0] != 'a' || !(0 in m);
		Array.prototype.forEach ||
			(Array.prototype.forEach = function(t) {
				var n = F(this),
					r = g && a(this) == '[object String]' ? this.split('') : n,
					i = arguments[1],
					s = -1,
					o = r.length >>> 0;
				if (a(t) != '[object Function]') throw new TypeError();
				while (++s < o) s in r && t.call(i, r[s], s, n);
			}),
			Array.prototype.map ||
				(Array.prototype.map = function(t) {
					var n = F(this),
						r =
							g && a(this) == '[object String]'
								? this.split('')
								: n,
						i = r.length >>> 0,
						s = Array(i),
						o = arguments[1];
					if (a(t) != '[object Function]')
						throw new TypeError(t + ' is not a function');
					for (var u = 0; u < i; u++)
						u in r && (s[u] = t.call(o, r[u], u, n));
					return s;
				}),
			Array.prototype.filter ||
				(Array.prototype.filter = function(t) {
					var n = F(this),
						r =
							g && a(this) == '[object String]'
								? this.split('')
								: n,
						i = r.length >>> 0,
						s = [],
						o,
						u = arguments[1];
					if (a(t) != '[object Function]')
						throw new TypeError(t + ' is not a function');
					for (var f = 0; f < i; f++)
						f in r && ((o = r[f]), t.call(u, o, f, n) && s.push(o));
					return s;
				}),
			Array.prototype.every ||
				(Array.prototype.every = function(t) {
					var n = F(this),
						r =
							g && a(this) == '[object String]'
								? this.split('')
								: n,
						i = r.length >>> 0,
						s = arguments[1];
					if (a(t) != '[object Function]')
						throw new TypeError(t + ' is not a function');
					for (var o = 0; o < i; o++)
						if (o in r && !t.call(s, r[o], o, n)) return !1;
					return !0;
				}),
			Array.prototype.some ||
				(Array.prototype.some = function(t) {
					var n = F(this),
						r =
							g && a(this) == '[object String]'
								? this.split('')
								: n,
						i = r.length >>> 0,
						s = arguments[1];
					if (a(t) != '[object Function]')
						throw new TypeError(t + ' is not a function');
					for (var o = 0; o < i; o++)
						if (o in r && t.call(s, r[o], o, n)) return !0;
					return !1;
				}),
			Array.prototype.reduce ||
				(Array.prototype.reduce = function(t) {
					var n = F(this),
						r =
							g && a(this) == '[object String]'
								? this.split('')
								: n,
						i = r.length >>> 0;
					if (a(t) != '[object Function]')
						throw new TypeError(t + ' is not a function');
					if (!i && arguments.length == 1)
						throw new TypeError(
							'reduce of empty array with no initial value'
						);
					var s = 0,
						o;
					if (arguments.length >= 2) o = arguments[1];
					else
						do {
							if (s in r) {
								o = r[s++];
								break;
							}
							if (++s >= i)
								throw new TypeError(
									'reduce of empty array with no initial value'
								);
						} while (!0);
					for (; s < i; s++)
						s in r && (o = t.call(void 0, o, r[s], s, n));
					return o;
				}),
			Array.prototype.reduceRight ||
				(Array.prototype.reduceRight = function(t) {
					var n = F(this),
						r =
							g && a(this) == '[object String]'
								? this.split('')
								: n,
						i = r.length >>> 0;
					if (a(t) != '[object Function]')
						throw new TypeError(t + ' is not a function');
					if (!i && arguments.length == 1)
						throw new TypeError(
							'reduceRight of empty array with no initial value'
						);
					var s,
						o = i - 1;
					if (arguments.length >= 2) s = arguments[1];
					else
						do {
							if (o in r) {
								s = r[o--];
								break;
							}
							if (--o < 0)
								throw new TypeError(
									'reduceRight of empty array with no initial value'
								);
						} while (!0);
					do o in this && (s = t.call(void 0, s, r[o], o, n));
					while (o--);
					return s;
				});
		if (!Array.prototype.indexOf || [0, 1].indexOf(1, 2) != -1)
			Array.prototype.indexOf = function(t) {
				var n =
						g && a(this) == '[object String]'
							? this.split('')
							: F(this),
					r = n.length >>> 0;
				if (!r) return -1;
				var i = 0;
				arguments.length > 1 && (i = H(arguments[1])),
					(i = i >= 0 ? i : Math.max(0, r + i));
				for (; i < r; i++) if (i in n && n[i] === t) return i;
				return -1;
			};
		if (!Array.prototype.lastIndexOf || [0, 1].lastIndexOf(0, -3) != -1)
			Array.prototype.lastIndexOf = function(t) {
				var n =
						g && a(this) == '[object String]'
							? this.split('')
							: F(this),
					r = n.length >>> 0;
				if (!r) return -1;
				var i = r - 1;
				arguments.length > 1 && (i = Math.min(i, H(arguments[1]))),
					(i = i >= 0 ? i : r - Math.abs(i));
				for (; i >= 0; i--) if (i in n && t === n[i]) return i;
				return -1;
			};
		Object.getPrototypeOf ||
			(Object.getPrototypeOf = function(t) {
				return (
					t.__proto__ || (t.constructor ? t.constructor.prototype : o)
				);
			});
		if (!Object.getOwnPropertyDescriptor) {
			var y = 'Object.getOwnPropertyDescriptor called on a non-object: ';
			Object.getOwnPropertyDescriptor = function(t, n) {
				if (
					(typeof t != 'object' && typeof t != 'function') ||
					t === null
				)
					throw new TypeError(y + t);
				if (!f(t, n)) return;
				var r, i, s;
				r = { enumerable: !0, configurable: !0 };
				if (d) {
					var u = t.__proto__;
					t.__proto__ = o;
					var i = h(t, n),
						s = p(t, n);
					t.__proto__ = u;
					if (i || s) return i && (r.get = i), s && (r.set = s), r;
				}
				return (r.value = t[n]), r;
			};
		}
		Object.getOwnPropertyNames ||
			(Object.getOwnPropertyNames = function(t) {
				return Object.keys(t);
			});
		if (!Object.create) {
			var b;
			Object.prototype.__proto__ === null
				? (b = function() {
						return { __proto__: null };
				  })
				: (b = function() {
						var e = {};
						for (var t in e) e[t] = null;
						return (
							(e.constructor = e.hasOwnProperty = e.propertyIsEnumerable = e.isPrototypeOf = e.toLocaleString = e.toString = e.valueOf = e.__proto__ = null),
							e
						);
				  }),
				(Object.create = function(t, n) {
					var r;
					if (t === null) r = b();
					else {
						if (typeof t != 'object')
							throw new TypeError(
								'typeof prototype[' + typeof t + "] != 'object'"
							);
						var i = function() {};
						(i.prototype = t), (r = new i()), (r.__proto__ = t);
					}
					return n !== void 0 && Object.defineProperties(r, n), r;
				});
		}
		if (Object.defineProperty) {
			var E = w({}),
				S =
					typeof document == 'undefined' ||
					w(document.createElement('div'));
			if (!E || !S) var x = Object.defineProperty;
		}
		if (!Object.defineProperty || x) {
			var T = 'Property description must be an object: ',
				N = 'Object.defineProperty called on non-object: ',
				C =
					'getters & setters can not be defined on this javascript engine';
			Object.defineProperty = function(t, n, r) {
				if (
					(typeof t != 'object' && typeof t != 'function') ||
					t === null
				)
					throw new TypeError(N + t);
				if (
					(typeof r != 'object' && typeof r != 'function') ||
					r === null
				)
					throw new TypeError(T + r);
				if (x)
					try {
						return x.call(Object, t, n, r);
					} catch (i) {}
				if (f(r, 'value'))
					if (d && (h(t, n) || p(t, n))) {
						var s = t.__proto__;
						(t.__proto__ = o),
							delete t[n],
							(t[n] = r.value),
							(t.__proto__ = s);
					} else t[n] = r.value;
				else {
					if (!d) throw new TypeError(C);
					f(r, 'get') && l(t, n, r.get),
						f(r, 'set') && c(t, n, r.set);
				}
				return t;
			};
		}
		Object.defineProperties ||
			(Object.defineProperties = function(t, n) {
				for (var r in n) f(n, r) && Object.defineProperty(t, r, n[r]);
				return t;
			}),
			Object.seal ||
				(Object.seal = function(t) {
					return t;
				}),
			Object.freeze ||
				(Object.freeze = function(t) {
					return t;
				});
		try {
			Object.freeze(function() {});
		} catch (k) {
			Object.freeze = (function(t) {
				return function(n) {
					return typeof n == 'function' ? n : t(n);
				};
			})(Object.freeze);
		}
		Object.preventExtensions ||
			(Object.preventExtensions = function(t) {
				return t;
			}),
			Object.isSealed ||
				(Object.isSealed = function(t) {
					return !1;
				}),
			Object.isFrozen ||
				(Object.isFrozen = function(t) {
					return !1;
				}),
			Object.isExtensible ||
				(Object.isExtensible = function(t) {
					if (Object(t) === t) throw new TypeError();
					var n = '';
					while (f(t, n)) n += '?';
					t[n] = !0;
					var r = f(t, n);
					return delete t[n], r;
				});
		if (!Object.keys) {
			var L = !0,
				A = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				O = A.length;
			for (var M in { toString: null }) L = !1;
			Object.keys = function I(e) {
				if (
					(typeof e != 'object' && typeof e != 'function') ||
					e === null
				)
					throw new TypeError('Object.keys called on a non-object');
				var I = [];
				for (var t in e) f(e, t) && I.push(t);
				if (L)
					for (var n = 0, r = O; n < r; n++) {
						var i = A[n];
						f(e, i) && I.push(i);
					}
				return I;
			};
		}
		Date.now ||
			(Date.now = function() {
				return new Date().getTime();
			});
		var _ =
			'	\n\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff';
		if (!String.prototype.trim || _.trim()) {
			_ = '[' + _ + ']';
			var D = new RegExp('^' + _ + _ + '*'),
				P = new RegExp(_ + _ + '*$');
			String.prototype.trim = function() {
				return String(this)
					.replace(D, '')
					.replace(P, '');
			};
		}
		var F = function(e) {
			if (e == null)
				throw new TypeError("can't convert " + e + ' to object');
			return Object(e);
		};
	});
