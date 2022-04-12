"use strict";

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");

var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");

var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");

var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _baseRequest = _interopRequireDefault(require("./baseRequest"));

var _sanitize = _interopRequireDefault(require("./sanitize"));

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context; _forEachInstanceProperty(_context = ownKeys(Object(source), true)).call(_context, function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context2; _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

const DEFAULT_REQUEST_CONFIG = {
  headers: {
    'Accept': 'application/json'
  }
};
const BACKOFF_DELAY = 500; // 0.5 seconds

const ERROR_FROM_SERVER = 'HTTP Error: Requested page not reachable';
/**
 * @private
 * Small wrapper around js-utility-belt's request that provides url resolving,
 * default settings, and response handling.
 */

class Request {
  constructor(node) {
    this.node = node;
    this.backoffTime = null;
    this.retries = 0;
    this.connectionError = null;
  }

  async request(urlPath, config, timeout, maxBackoffTime) {
    if (!urlPath) {
      return _promise.default.reject(new Error('Request was not given a url.'));
    } // Load default fetch configuration and remove any falsy query parameters


    const requestConfig = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, this.node.headers), DEFAULT_REQUEST_CONFIG), config), {}, {
      query: config.query && (0, _sanitize.default)(config.query)
    });

    const apiUrl = this.node.endpoint + urlPath;

    if (requestConfig.jsonBody) {
      requestConfig.headers = _objectSpread(_objectSpread({}, requestConfig.headers), {}, {
        'Content-Type': 'application/json'
      });
    } // If connectionError occurs, a timestamp equal to now +
    // `backoffTimedelta` is assigned to the object.
    // Next time the function is called, it either
    // waits till the timestamp is passed or raises `TimeoutError`.
    // If `ConnectionError` occurs two or more times in a row,
    // the retry count is incremented and the new timestamp is calculated
    // as now + the `backoffTimedelta`
    // The `backoffTimedelta` is the minimum between the default delay
    // multiplied by two to the power of the
    // number of retries or timeout/2 or 10. See Transport class for that
    // If a request is successful, the backoff timestamp is removed,
    // the retry count is back to zero.


    const backoffTimedelta = this.getBackoffTimedelta();

    if (timeout != null && timeout < backoffTimedelta) {
      const errorObject = {
        message: 'TimeoutError'
      };
      throw errorObject;
    }

    if (backoffTimedelta > 0) {
      await Request.sleep(backoffTimedelta);
    }

    const requestTimeout = timeout ? timeout - backoffTimedelta : timeout;
    return (0, _baseRequest.default)(apiUrl, requestConfig, requestTimeout).then(async res => {
      this.connectionError = null;
      return res.json();
    }).catch(err => {
      // ConnectionError
      this.connectionError = err;
    }).finally(() => {
      this.updateBackoffTime(maxBackoffTime);
    });
  }

  updateBackoffTime(maxBackoffTime) {
    if (!this.connectionError) {
      this.retries = 0;
      this.backoffTime = null;
    } else if (this.connectionError.message === ERROR_FROM_SERVER) {
      // If status is not a 2xx (based on Response.ok), throw error
      this.retries = 0;
      this.backoffTime = null;
      throw this.connectionError;
    } else {
      // Timeout or no connection could be stablished
      const backoffTimedelta = Math.min(BACKOFF_DELAY * 2 ** this.retries, maxBackoffTime);
      this.backoffTime = (0, _now.default)() + backoffTimedelta;
      this.retries += 1;

      if (this.connectionError.message === 'TimeoutError') {
        throw this.connectionError;
      }
    }
  }

  getBackoffTimedelta() {
    if (!this.backoffTime) {
      return 0;
    }

    return this.backoffTime - (0, _now.default)();
  }

  static sleep(ms) {
    return new _promise.default(resolve => (0, _setTimeout2.default)(resolve, ms));
  }

}

exports.default = Request;