"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _request = _interopRequireDefault(require("./request"));

// Copyright BigchainDB GmbH and BigchainDB contributors
// SPDX-License-Identifier: (Apache-2.0 AND CC-BY-4.0)
// Code is Apache-2.0 and docs are CC-BY-4.0

/**
 *
 * @private
 * If initialized with ``>1`` nodes, the driver will send successive
 * requests to different nodes in a round-robin fashion (this will be
 * customizable in the future).
 */
class Transport {
  constructor(nodes, timeout) {
    this.connectionPool = [];
    this.timeout = timeout; // the maximum backoff time is 10 seconds

    this.maxBackoffTime = timeout ? timeout / 2 : 10000;
    (0, _forEach.default)(nodes).call(nodes, node => {
      this.connectionPool.push(new _request.default(node));
    });
  } // Select the connection with the earliest backoff time, in case of a tie,
  // prefer the one with the smaller list index


  pickConnection() {
    var _context;

    let connection = this.connectionPool[0];
    (0, _forEach.default)(_context = this.connectionPool).call(_context, conn => {
      // 0 the lowest value is the time for Thu Jan 01 1970 01:00:00 GMT+0100 (CET)
      conn.backoffTime = conn.backoffTime ? conn.backoffTime : 0;
      connection = conn.backoffTime < connection.backoffTime ? conn : connection;
    });
    return connection;
  }

  async forwardRequest(path, headers) {
    let response;
    let connection; // A new request will be executed until there is a valid response or timeout < 0

    while (this.timeout >= 0) {
      connection = this.pickConnection(); // Date in milliseconds

      const startTime = (0, _now.default)(); // eslint-disable-next-line no-await-in-loop

      response = await connection.request(path, headers, this.timeout, this.maxBackoffTime);
      const elapsed = (0, _now.default)() - startTime;

      if (connection.backoffTime > 0 && this.timeout > 0) {
        this.timeout -= elapsed;
      } else {
        // No connection error, the response is valid
        return response;
      }
    }

    throw new Error('TimeoutError');
  }

}

exports.default = Transport;