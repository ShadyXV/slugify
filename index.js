'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var deburr = require('lodash.deburr');
var escapeStringRegexp = require('escape-string-regexp');

var decamelize = function decamelize(string) {
	return string.replace(/([a-z\d])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2');
};

var builtinReplacements = new Map([['&', 'and'], ['🦄', 'unicorn'], ['♥', 'love']]);

var doCustomReplacements = function doCustomReplacements(string, replacements) {
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = replacements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _ref = _step.value;

			var _ref2 = _slicedToArray(_ref, 2);

			var key = _ref2[0];
			var value = _ref2[1];

			string = string.replace(new RegExp(escapeStringRegexp(key), 'g'), ' ' + value + ' ');
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return string;
};

var removeMootSeparators = function removeMootSeparators(string, separator) {
	return string.replace(new RegExp(separator + '{2,}', 'g'), separator).replace(new RegExp('^' + separator + '|' + separator + '$', 'g'), '');
};

module.exports = function (string, options) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string, got `' + (typeof string === 'undefined' ? 'undefined' : _typeof(string)) + '`');
	}

	options = Object.assign({
		separator: '-',
		customReplacements: []
	}, options);

	var separator = escapeStringRegexp(options.separator);
	var customReplacements = new Map([].concat(_toConsumableArray(builtinReplacements), _toConsumableArray(options.customReplacements)));

	string = deburr(string);
	string = decamelize(string);
	string = doCustomReplacements(string, customReplacements);
	string = string.toLowerCase();
	string = string.replace(/[^a-z\d]+/g, separator);
	string = string.replace(/\\/g, '');
	string = removeMootSeparators(string, separator);

	return string;
};