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
}(this, function () {
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

  FrameCom.prototype.send = function (action, args) {
    args = args !== undefined ? args : [];
    this._other.postMessage({
      action: action,
      arguments: args
    }, this._targetOrigin);
  };

  FrameCom.prototype.receive = function (action, callback) {
    return this._listen(function (e) {
      if (this._allowed(action, e)) {
        callback.apply(null, e.data.arguments);
      }
    }.bind(this));
  };

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

  FrameCom.prototype.request = function (action, args, callback) {
    var end = this.receive(action, function (answer) {
      end();
      callback(answer);
    });
    this.send(action, args);
  };

  FrameCom.prototype.dispose = function () {
    this._listeners.forEach(function (listener) {
      this._self.removeEventListener('message', listener, false);
    }.bind(this));
  };

  return FrameCom;
}));
