"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = stringifyAsQueryParam;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/entries"));

require("core-js/features/object/entries");

var _decamelize = _interopRequireDefault(require("decamelize"));

var _queryString = _interopRequireDefault(require("query-string"));

// Copyright BigchainDB GmbH and BigchainDB contributors
// SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
// Code is Apache-2.0 and docs are CC-BY-4.0

/**
 * @private
 * imported from https://github.com/bigchaindb/js-utility-belt/
 *
 * Takes a key-value dictionary (ie. object) and converts it to a query-parameter string that you
 * can directly append into a URL.
 *
 * Extends queryString.stringify by allowing you to specify a `transform` function that will be
 * invoked on each of the dictionary's keys before being stringified into the query-parameter
 * string.
 *
 * By default `transform` is `decamelize`, so a dictionary of the form:
 *
 *   {
 *      page: 1,
 *      pageSize: 10
 *   }
 *
 * will be converted to a string like:
 *
 *   ?page=1&page_size=10
 *
 * @param  {Object}   obj                    Query params dictionary
 * @param  {function} [transform=decamelize] Transform function for each of the param keys
 * @return {string}                          Query param string
 */
function stringifyAsQueryParam(obj, transform = _decamelize.default) {
  var _context;

  if (!obj || typeof obj !== 'object' || !(0, _keys.default)(obj).length) {
    return '';
  }

  const transformedKeysObj = (0, _reduce.default)(_context = (0, _entries.default)(obj)).call(_context, (paramsObj, [key, value]) => {
    paramsObj[transform(key)] = value;
    return paramsObj;
  }, {});
  return "?".concat(_queryString.default.stringify(transformedKeysObj));
}