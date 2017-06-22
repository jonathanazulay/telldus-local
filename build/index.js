(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('isomorphic-fetch'), require('query-string'), require('jwt-decode')) :
	typeof define === 'function' && define.amd ? define(['exports', 'isomorphic-fetch', 'query-string', 'jwt-decode'], factory) :
	(factory((global['telldus-local'] = global['telldus-local'] || {}),global.fetch,global.querystring,global.jwtDecode));
}(this, (function (exports,fetch,querystring,jwtDecode) { 'use strict';

fetch = 'default' in fetch ? fetch['default'] : fetch;
querystring = 'default' in querystring ? querystring['default'] : querystring;
jwtDecode = 'default' in jwtDecode ? jwtDecode['default'] : jwtDecode;

var api = (function (session) {
  return {
    getDevices: function getDevices() {
      return session.invoke('/devices/list');
    },

    getDeviceInfo: function getDeviceInfo(id) {
      return session.invoke('/device/info', { id: id });
    },

    bellDevice: function bellDevice(id) {
      return session.invoke('/device/bell', { id: id });
    },

    commandDevice: function commandDevice(id, method, value) {
      return session.invoke('/device/command', { id: id, method: method, value: value });
    },

    dimDevice: function dimDevice(id, level) {
      return session.invoke('/device/dim', { id: id, level: level });
    },

    downDevice: function downDevice(id) {
      return session.invoke('/device/down', { id: id });
    },

    infoDevice: function infoDevice(id) {
      return session.invoke('/device/info', { id: id });
    },

    learnDevice: function learnDevice(id) {
      return session.invoke('/device/learn', { id: id });
    },

    setNameDevice: function setNameDevice(id, name) {
      return session.invoke('/device/setName', { id: id, name: name });
    },

    stopDevice: function stopDevice(id) {
      return session.invoke('/device/stop', { id: id });
    },

    turnOffDevice: function turnOffDevice(id) {
      return session.invoke('/device/turnOff', { id: id });
    },

    turnOnDevice: function turnOnDevice(id) {
      return session.invoke('/device/turnOn', { id: id });
    },

    upDevice: function upDevice(id) {
      return session.invoke('/device/up', { id: id });
    }
  };
});

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var maybeAddAuthorizationHeader = function maybeAddAuthorizationHeader(options, accessToken) {
  return accessToken ? _extends({}, options, {
    headers: _extends({
      Authorization: "Bearer " + accessToken
    }, options.headers)
  }) : options;
};
var trailingSlash = function trailingSlash(path) {
  return path.substr(-1) === '/' ? path : path + '/';
};
var leadingSlash = function leadingSlash(path) {
  return path[0] === '/' ? path : '/' + path;
};
var TEN_MINUTES_MS = 60 * 10 * 1000;
var shouldRefreshToken = function shouldRefreshToken(token) {
  return jwtDecode(token, { header: true }).exp * 1000 < Date.now() + TEN_MINUTES_MS;
};

var TelldusSession = function () {
  function TelldusSession(deviceUrl) {
    classCallCheck(this, TelldusSession);

    this.fetch = function (url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return fetch(trailingSlash(deviceUrl) + 'api' + leadingSlash(url) + '?' + querystring.stringify(params), options);
    };
  }

  createClass(TelldusSession, [{
    key: 'api',
    value: function api() {
      var endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var accessToken = arguments[3];

      accessToken = accessToken || this.accessToken;
      options = maybeAddAuthorizationHeader(options, accessToken);
      return this.fetch(endpoint, params, options).then(function (resp) {
        return resp.json();
      });
    }
  }, {
    key: 'invoke',
    value: function invoke(endpoint) {
      var _this = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (shouldRefreshToken(this.accessToken)) {
        return this.refreshToken().then(function () {
          return _this.invoke(endpoint, params);
        }).catch(function () {
          return _this.invoke(endpoint, params);
        });
      }

      return this.api(endpoint, params);
    }
  }, {
    key: 'initLogin',
    value: function initLogin(app) {
      return this.api('/token', {}, {
        method: 'PUT',
        body: querystring.stringify({ app: app }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
      });
    }
  }, {
    key: 'resumeLogin',
    value: function resumeLogin(token) {
      var _this2 = this;

      return this.api('/token', { token: token }).then(function (resp) {
        if (resp.token) {
          return _this2.loginWithAccessToken(resp.token, { skipVerify: true });
        }
        throw resp;
      });
    }
  }, {
    key: 'loginWithAccessToken',
    value: function loginWithAccessToken(accessToken) {
      var _this3 = this;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$skipVerify = _ref.skipVerify,
          skipVerify = _ref$skipVerify === undefined ? false : _ref$skipVerify;

      if (skipVerify) {
        this.accessToken = accessToken;
        return new Promise(function (resolve) {
          resolve({
            success: true,
            token: accessToken
          });
        });
      }

      return this.api('/devices/list', {}, {}, accessToken).then(function (resp) {
        _this3.accessToken = accessToken;
        return { success: true, token: accessToken };
      });
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken() {
      var _this4 = this;

      return this.api('/refreshToken').then(function (resp) {
        if (resp.accessToken) {
          _this4.accessToken = resp.accessToken;
        }
        throw resp;
      });
    }
  }]);
  return TelldusSession;
}();

exports.api = api;
exports.Session = TelldusSession;

Object.defineProperty(exports, '__esModule', { value: true });

})));
