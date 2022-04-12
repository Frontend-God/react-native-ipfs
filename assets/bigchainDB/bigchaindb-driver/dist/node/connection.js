"use strict";

var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");

var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");

var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");

var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _transport = _interopRequireDefault(require("./transport"));

function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context2; _forEachInstanceProperty2(_context2 = ownKeys(Object(source), true)).call(_context2, function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context3; _forEachInstanceProperty2(_context3 = ownKeys(Object(source))).call(_context3, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

const HEADER_BLACKLIST = ['content-type'];
const DEFAULT_NODE = 'http://localhost:9984/api/v1/';
const DEFAULT_TIMEOUT = 20000; // The default value is 20 seconds

/**
 *
 * @param  {String, Array}  nodes    Nodes for the connection. String possible to be backwards compatible
 *                                   with version before 4.1.0 version
 * @param  {Object}  headers         Common headers for every request
 * @param  {float}  timeout          Optional timeout in secs
 *
 *
 */

class Connection {
  // This driver implements the BEP-14 https://github.com/bigchaindb/BEPs/tree/master/14
  constructor(nodes, headers = {}, timeout = DEFAULT_TIMEOUT) {
    var _context;

    // Copy object
    this.headers = _objectSpread({}, headers); // Validate headers

    (0, _forEach.default)(_context = (0, _keys.default)(headers)).call(_context, header => {
      if ((0, _includes.default)(HEADER_BLACKLIST).call(HEADER_BLACKLIST, header.toLowerCase())) {
        throw new Error("Header ".concat(header, " is reserved and cannot be set."));
      }
    });
    this.normalizedNodes = [];

    if (!nodes) {
      this.normalizedNodes.push(Connection.normalizeNode(DEFAULT_NODE, this.headers));
    } else if ((0, _isArray.default)(nodes)) {
      (0, _forEach.default)(nodes).call(nodes, node => {
        this.normalizedNodes.push(Connection.normalizeNode(node, this.headers));
      });
    } else {
      this.normalizedNodes.push(Connection.normalizeNode(nodes, this.headers));
    }

    this.transport = new _transport.default(this.normalizedNodes, timeout);
  }

  static normalizeNode(node, headers) {
    if (typeof node === 'string') {
      return {
        'endpoint': node,
        'headers': headers
      };
    } else {
      const allHeaders = _objectSpread(_objectSpread({}, headers), node.headers);

      return {
        'endpoint': node.endpoint,
        'headers': allHeaders
      };
    }
  }

  static getApiUrls(endpoint) {
    return {
      'blocks': 'blocks',
      'blocksDetail': 'blocks/%(blockHeight)s',
      'outputs': 'outputs',
      'transactions': 'transactions',
      'transactionsSync': 'transactions?mode=sync',
      'transactionsAsync': 'transactions?mode=async',
      'transactionsCommit': 'transactions?mode=commit',
      'transactionsDetail': 'transactions/%(transactionId)s',
      'assets': 'assets',
      'metadata': 'metadata'
    }[endpoint];
  }

  _req(path, options = {}) {
    return this.transport.forwardRequest(path, options);
  }
  /**
   * @param blockHeight
   */


  getBlock(blockHeight) {
    return this._req(Connection.getApiUrls('blocksDetail'), {
      urlTemplateSpec: {
        blockHeight
      }
    });
  }
  /**
   * @param transactionId
   */


  getTransaction(transactionId) {
    return this._req(Connection.getApiUrls('transactionsDetail'), {
      urlTemplateSpec: {
        transactionId
      }
    });
  }
  /**
   * @param transactionId
   * @param status
   */


  listBlocks(transactionId) {
    return this._req(Connection.getApiUrls('blocks'), {
      query: {
        transaction_id: transactionId
      }
    });
  }
  /**
   * @param publicKey
   * @param spent
   */


  listOutputs(publicKey, spent) {
    const query = {
      public_key: publicKey
    }; // NOTE: If `spent` is not defined, it must not be included in the
    // query parameters.

    if (spent !== undefined) {
      query.spent = spent.toString();
    }

    return this._req(Connection.getApiUrls('outputs'), {
      query
    });
  }
  /**
   * @param assetId
   * @param operation
   */


  listTransactions(assetId, operation) {
    return this._req(Connection.getApiUrls('transactions'), {
      query: {
        asset_id: assetId,
        operation
      }
    });
  }
  /**
   * @param transaction
   */


  postTransaction(transaction) {
    return this.postTransactionCommit(transaction);
  }
  /**
   * @param transaction
   */


  postTransactionSync(transaction) {
    return this._req(Connection.getApiUrls('transactionsSync'), {
      method: 'POST',
      jsonBody: transaction
    });
  }
  /**
   * @param transaction
   */


  postTransactionAsync(transaction) {
    return this._req(Connection.getApiUrls('transactionsAsync'), {
      method: 'POST',
      jsonBody: transaction
    });
  }
  /**
   * @param transaction
   */


  postTransactionCommit(transaction) {
    return this._req(Connection.getApiUrls('transactionsCommit'), {
      method: 'POST',
      jsonBody: transaction
    });
  }
  /**
   * @param search
   */


  searchAssets(search) {
    return this._req(Connection.getApiUrls('assets'), {
      query: {
        search
      }
    });
  }
  /**
   * @param search
   */


  searchMetadata(search) {
    return this._req(Connection.getApiUrls('metadata'), {
      query: {
        search
      }
    });
  }

}

exports.default = Connection;