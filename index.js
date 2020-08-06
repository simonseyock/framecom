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
     * Creates an object to communicate with another windows.
     * @param {Window} self
     * @constructor
     */
    function PaperGlider(self) {
      this._self = self;
      this._listeners = [];
      this._connected = false;
      this._connectCallbacks = [];
    }

    /**
     * Sets up the communication to another window. The target origin can be omitted in which case it is set to `'*'`,
     *   which normally should be avoided.
     * @param {Window} target
     * @param {string} [targetOrigin='*']
     */
    PaperGlider.prototype.init = function (target, targetOrigin) {
      this._other = target;

      if (targetOrigin === undefined || targetOrigin === '*') {
        console.warn('You are using origin \'*\'. This is not recommended.');
        this._targetOrigin = '*';
      } else {
        this._targetOrigin = targetOrigin;
      }

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
      }
    };

    /**
     * Helper to connect PaperGlider to another window
     * @param {Window} [self=window]
     * @returns {PaperGliderConnector}
     */
    PaperGlider.connect = function (self) {
      return new PaperGliderConnector(self);
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

    PaperGlider.prototype.getOther = function () {
      return this._other;
    };

    /**
     * Helper class to connect PaperGlider to another window
     * @param self
     * @constructor
     */
    function PaperGliderConnector(self) {
      this._self = self || window;
    }

    /**
     * This is a helper to connect to a window (iframe, window.open)
     * @param {Window} other
     * @param {string} [otherOrigin='*']
     * @returns {PaperGlider}
     */
    PaperGliderConnector.prototype.toWindow = function (other, otherOrigin) {
      var paperGlider = new PaperGlider(this._self);
      paperGlider.init(other, otherOrigin);
      return paperGlider;
    };

    /**
     * This is a helper to connect to a parent window (window.top or window.opener)
     * @param {string} [parentOrigin='*']
     * @returns {PaperGlider}
     */
    PaperGliderConnector.prototype.toParent = function (parentOrigin) {
      var paperGlider = new PaperGlider(this._self);
      if (this._self.opener !== null) {
        paperGlider.init(this._self.opener, parentOrigin);
      } else if (this._self.parent !== null) {
        paperGlider.init(this._self.parent, parentOrigin);
      } else {
        throw new Error('No parent window available');
      }

      return paperGlider;
    };

    /**
     * This is a helper to connect to a iframe. It waits for the contentWindow if neccessary.
     * @param {HTMLIFrameElement} iframe
     * @param {string} [iframeOrigin='*']
     * @returns {PaperGlider}
     */
    PaperGliderConnector.prototype.toIframe = function (iframe, iframeOrigin) {
      var paperGlider = new PaperGlider(this._self);
      if (iframe.contentWindow) {
        paperGlider.init(iframe.contentWindow, iframeOrigin)
      } else {
        var interval = setInterval(function () {
          if (iframe.contentWindow) {
            clearInterval(interval);
            paperGlider.init(iframe.contentWindow, iframeOrigin);
          }
        }, 200);
      }
      return paperGlider;
    };

    return PaperGlider;
  }));
