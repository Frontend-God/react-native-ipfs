"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.ResponseError = ResponseError;
exports.default = baseRequest;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _es6Promise = require("es6-promise");

var _fetchPonyfill = _interopRequireDefault(require("fetch-ponyfill"));

var _sprintfJs = require("sprintf-js");

var _format_text = _interopRequireDefault(require("./format_text"));

var _stringify_as_query_param = _interopRequireDefault(require("./stringify_as_query_param"));

// Copyright BigchainDB GmbH and BigchainDB contributors
// SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
// Code is Apache-2.0 and docs are CC-BY-4.0
const fetch = (0, _fetchPonyfill.default)(_es6Promise.Promise);

function ResponseError(message, status, requestURI) {
  this.name = 'ResponseError';
  this.message = message;
  this.status = status;
  this.requestURI = requestURI;
  this.stack = new Error().stack;
}

ResponseError.prototype = new Error();
/**
 * @private
 * Timeout function following https://github.com/github/fetch/issues/175#issuecomment-284787564
 * @param {integer} obj Source object
 * @param {Promise} filter Array of key names to select or function to invoke per iteration
 * @return {Object} TimeoutError if the time was consumed, otherwise the Promise will be resolved
 */

function timeout(ms, promise) {
  return new _es6Promise.Promise((resolve, reject) => {
    (0, _setTimeout2.default)(() => {
      const errorObject = {
        message: 'TimeoutError'
      };
      reject(new Error(errorObject));
    }, ms);
    promise.then(resolve, reject);
  });
}
/**
 * @private
 * @param {Promise} res Source object
 * @return {Promise} Promise that will resolve with the response if its status was 2xx;
 *                          otherwise rejects with the response
 */


function handleResponse(res) {
  // If status is not a 2xx (based on Response.ok), assume it's an error
  // See https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
  if (!(res && res.ok)) {
    var _context;

    throw new ResponseError('HTTP Error: Requested page not reachable', (0, _concat.default)(_context = "".concat(res.status, " ")).call(_context, res.statusText), res.url);
  }

  return res;
}
/**
 * @private
 * imported from https://github.com/bigchaindb/js-utility-belt/
 *
 * Global fetch wrapper that adds some basic error handling and ease of use enhancements.
 * Considers any non-2xx response as an error.
 *
 * For more information on fetch, see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch.
 *
 * Expects fetch to already be available (either in a ES6 environment, bundled through webpack, or
 * injected through a polyfill).
 *
 * @param  {string}  url    Url to request. Can be specified as a sprintf format string (see
 *                          https://github.com/alexei/sprintf.js) that will be resolved using
 *                          `config.urlTemplateSpec`.
 * @param  {Object}  config Additional configuration, mostly passed to fetch as its 'init' config
 *                          (see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch#Parameters).
 * @param  {*}             config.jsonBody        Json payload to the request. Will automatically be
 *                                                JSON.stringify()-ed and override `config.body`.
 * @param  {string|Object} config.query           Query parameter to append to the end of the url.
 *                                                If specified as an object, keys will be
 *                                                decamelized into snake case first.
 * @param  {*[]|Object}    config.urlTemplateSpec Format spec to use to expand the url (see sprintf).
 * @param  {*}             config.*               All other options are passed through to fetch.
 * @param  {integer}         requestTimeout         Timeout for a single request
 *
 * @return {Promise}        If requestTimeout the timeout function will be called. Otherwise resolve the
 *                          Promise with the handleResponse function
 */


function baseRequest(url, _ref = {}, requestTimeout) {
  let {
    jsonBody,
    query,
    urlTemplateSpec
  } = _ref,
      fetchConfig = (0, _objectWithoutProperties2.default)(_ref, ["jsonBody", "query", "urlTemplateSpec"]);
  let expandedUrl = url;

  if (urlTemplateSpec != null) {
    if ((0, _isArray.default)(urlTemplateSpec) && urlTemplateSpec.length) {
      // Use vsprintf for the array call signature
      expandedUrl = (0, _sprintfJs.vsprintf)(url, urlTemplateSpec);
    } else if (urlTemplateSpec && typeof urlTemplateSpec === 'object' && (0, _keys.default)(urlTemplateSpec).length) {
      expandedUrl = (0, _format_text.default)(url, urlTemplateSpec);
    } else if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Supplied urlTemplateSpec was not an array or object. Ignoring...');
    }
  }

  if (query != null) {
    if (typeof query === 'string') {
      expandedUrl += query;
    } else if (query && typeof query === 'object') {
      expandedUrl += (0, _stringify_as_query_param.default)(query);
    } else if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Supplied query was not a string or object. Ignoring...');
    }
  }

  if (jsonBody != null) {
    fetchConfig.body = (0, _stringify.default)(jsonBody);
  }

  if (requestTimeout) {
    return timeout(requestTimeout, fetch.fetch(expandedUrl, fetchConfig)).then(handleResponse);
  } else {
    return fetch.fetch(expandedUrl, fetchConfig).then(handleResponse);
  }
}