/**
 * A module for communication between window objects.
 * @module paperglider
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
    root.PaperGlider = factory();
  }
}(this,
  /**
   * @exports {PaperGlider}
   */
  function () {
  /**
   * Sets up the communication between two window objects. The target origin can be omitted in which case it is set to `'*'`,
   *   which normally should be avoided.
   * @param {Window} self
   * @param {Window} target
   * @param {string} [targetOrigin='*']
   * @constructor
   */
  function PaperGlider (self, target, targetOrigin) {
    this._self = self;
    this._other = target;
    if (targetOrigin === undefined || targetOrigin === '*') {
      console.warn('You are using origin \'*\'. This is not recommended.');
      this._targetOrigin = '*';
    } else {
      this._targetOrigin = targetOrigin;
    }
    this._listeners = [];
    this._connected = false;
    this._connectCallbacks = [];

    var end = this.receive('paperglider:connect', function () {
      this._connected = true;
      this.send('paperglider:connect');
      this._connectCallbacks.forEach(function (callback) {
        callback();
      });
      end();
    }.bind(this));

    try {
      this.send('paperglider:connect');
    } catch (e) {
      console.warn('Connect failed from one end. It can still be established from the other end. This can happen because one end is not fully loaded yet.');
      console.warn(e);
    }
  }

    /**
     * This is a simple helper to connect to a child window (iframe, window.open)
     * @param {Window} child
     * @param {string} [childOrigin='*']
     * @returns {PaperGlider}
     */
  PaperGlider.connectChild = function (child, childOrigin) {
    return new PaperGlider(window, child, childOrigin);
  };

    /**
     * This is a simple helper to connect to a parent window (window.parent, window.opener)
     * @param {Window} parent
     * @param {string} [parentOrigin='*']
     * @returns {PaperGlider}
     */
  PaperGlider.connectParent = function (parent, parentOrigin) {
    return new PaperGlider(window, parent, parentOrigin);
  };

  PaperGlider.prototype._allowed = function (action, e) {
    return (this._targetOrigin === '*' || e.origin === this._targetOrigin) && e.data.action === action;
  };

  PaperGlider.prototype._listen = function (listener) {
    this._self.addEventListener('message', listener, false);
    this._listeners.push(listener);
    return function () {
      this._self.removeEventListener('message', listener, false);
      this._listeners.splice(this._listeners.indexOf(listener), 1);
    }.bind(this);
  };

    /**
     * Returns true if a connection was established.
     * @returns {boolean}
     */
  PaperGlider.prototype.isConnected = function () {
    return this._connected;
  };

  /**
   * Sends the action and the given arguments to the other window.
   * @param {string} action identifier
   * @param {any[]?} args arguments that get passed to the receiving callback. Should not contain functions or DOM elements.
   */
  PaperGlider.prototype.send = function (action, args) {
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
  PaperGlider.prototype.receive = function (action, callback) {
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
  PaperGlider.prototype.replyOn = function (action, callback) {
    return this._listen(function (e) {
      if (this._allowed(action, e)) {
        var answer = callback.apply(null, e.data.arguments);
        this.send(action, [answer]);
      }
    }.bind(this));
  };

  /**
   * Sends the action to the other window and waits for the same action and executes the callback once with the returned data.
   * @param {string} action identifier
   * @param {any[]} args arguments that get passed to the receiving callback. Should not contain functions or DOM elements.
   * @param {Function} callback gets passed the (single) answer to the request.
   */
  PaperGlider.prototype.request = function (action, args, callback) {
    var end = this.receive(action, function (answer) {
      end();
      callback(answer);
    });
    this.send(action, args);
  };

  /**
   * Removes all pending event listeners from the window object.
   */
  PaperGlider.prototype.dispose = function () {
    this._listeners.forEach(function (listener) {
      this._self.removeEventListener('message', listener, false);
    }.bind(this));
  };

    /**
     * The given callback will be executed as soon as PaperGlider has connected.
     * @param callback
     */
  PaperGlider.prototype.onConnect = function (callback) {
    if (this._connected) {
      callback();
    } else {
      this._connectCallbacks.push(callback);
    }
  };

  return PaperGlider;
}));
