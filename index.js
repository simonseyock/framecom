/**
 * A module for communication between window objects.
 * @module framecom
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.FrameCom = factory();
  }
}(this,
  /**
   * @exports {FrameCom}
   */
  function () {
  /**
   * Sets up the communication between two window objects. The origins can be omitted in which case they are set to `'*'`,
   *   which normally should be avoided.
   * @param {Window} self
   * @param {Window} other
   * @param {string} ownOrigin
   * @param {string} targetOrigin
   * @constructor
   */
  function FrameCom (self, other, ownOrigin, targetOrigin) {
    this._self = self;
    this._other = other;
    this._ownOrigin = ownOrigin !== undefined ? ownOrigin : '*';
    this._targetOrigin = targetOrigin !== undefined ? targetOrigin : '*';
    this._listeners = [];
  }

  FrameCom.prototype._allowed = function (action, e) {
    return (this._ownOrigin === '*' || e.origin === this._ownOrigin) && e.data.action === action;
  };

  FrameCom.prototype._listen = function (listener) {
    this._self.addEventListener('message', listener, false);
    this._listeners.push(listener);
    return function () {
      this._self.removeEventListener('message', listener, false);
      this._listeners.splice(this._listeners.indexOf(listener), 1);
    }.bind(this);
  };

  /**
   * Sends the action and the given arguments to the other window.
   * @param {string} action identifier
   * @param {any[]} args arguments that get passed to the receiving callback. Should not contain functions or DOM elements.
   */
  FrameCom.prototype.send = function (action, args) {
    args = args !== undefined ? args : [];
    this._other.postMessage({
      action: action,
      arguments: args
    }, this._targetOrigin);
  };

  /**
   * Whenever the window receives the given action, the callback is executed with the sent arguments.
   * @param {string} action identifier
   * @param {Function} callback will receive all sent arguments as arguments to the call.
   * @returns {Function} end will end receiving the action.
   */
  FrameCom.prototype.receive = function (action, callback) {
    return this._listen(function (e) {
      if (this._allowed(action, e)) {
        callback.apply(null, e.data.arguments);
      }
    }.bind(this));
  };

  /**
   * Whenever the window receives the action, send back the data returned by the callback with the same associated action
   * identifier.
   * @param {string} action
   * @param {Function} callback will receive all sent arguments as arguments to the call.
   * @returns {Function} end will end replying to the action.
   */
  FrameCom.prototype.replyOn = function (action, callback) {
    var end = this._listen(function (e) {
      if (this._allowed(action, e)) {
        end();
        var answer = callback.apply(null, e.data.arguments);
        this.send(action, [answer]);
      }
    }.bind(this));
    return end;
  };

  /**
   * Sends the action to the other window and waits for the same action and executes the callback once with the returned data.
   * @param {string} action identifier
   * @param {any[]} args arguments that get passed to the receiving callback. Should not contain functions or DOM elements.
   * @param {Function} callback gets passed the (single) answer to the request.
   */
  FrameCom.prototype.request = function (action, args, callback) {
    var end = this.receive(action, function (answer) {
      end();
      callback(answer);
    });
    this.send(action, args);
  };

  /**
   * Removes all pending event listeners from the window object.
   */
  FrameCom.prototype.dispose = function () {
    this._listeners.forEach(function (listener) {
      this._self.removeEventListener('message', listener, false);
    }.bind(this));
  };

  return FrameCom;
}));
