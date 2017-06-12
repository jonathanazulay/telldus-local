(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node-fetch'), require('query-string')) :
	typeof define === 'function' && define.amd ? define(['exports', 'node-fetch', 'query-string'], factory) :
	(factory((global['telldus-local'] = global['telldus-local'] || {}),global.fetch,global.querystring));
}(this, (function (exports,fetch,querystring) { 'use strict';

fetch = 'default' in fetch ? fetch['default'] : fetch;
querystring = 'default' in querystring ? querystring['default'] : querystring;

var TelldusAPI = (function (_ref) {
  var invoke = _ref.invoke;
  return {
    getDevices: function getDevices() {
      return invoke('/devices/list');
    },

    getDeviceInfo: function getDeviceInfo(id) {
      return invoke('/device/info', { id: id });
    },

    bellDevice: function bellDevice(id) {
      return invoke('/device/bell', { id: id });
    },

    commandDevice: function commandDevice(id, method, value) {
      return invoke('/device/command', { id: id, method: method, value: value });
    },

    dimDevice: function dimDevice(id, level) {
      return invoke('/device/dim', { id: id, level: level });
    },

    downDevice: function downDevice(id) {
      return invoke('/device/down', { id: id });
    },

    infoDevice: function infoDevice(id) {
      return invoke('/device/info', { id: id });
    },

    learnDevice: function learnDevice(id) {
      return invoke('/device/learn', { id: id });
    },

    setNameDevice: function setNameDevice(id, name) {
      return invoke('/device/setName', { id: id, name: name });
    },

    stopDevice: function stopDevice(id) {
      return invoke('/device/stop', { id: id });
    },

    turnOffDevice: function turnOffDevice(id) {
      return invoke('/device/turnOff', { id: id });
    },

    turnOnDevice: function turnOnDevice(id) {
      return invoke('/device/turnOn', { id: id });
    },

    upDevice: function upDevice(id) {
      return invoke('/device/up', { id: id });
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
var buildUrl = function buildUrl(base, path, params) {
  return trailingSlash(base) + 'api' + leadingSlash(path) + '?' + querystring.stringify(params);
};

var TelldusSession = function () {
  function TelldusSession(deviceUrl) {
    classCallCheck(this, TelldusSession);

    this.fetch = function (url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return fetch(buildUrl(deviceUrl, url, params), options);
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
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.api(endpoint, params);
    }
  }, {
    key: 'authorize',
    value: function authorize(app) {
      return this.api('/token', {}, {
        method: 'PUT',
        body: querystring.stringify({ app: app }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
      });
    }
  }, {
    key: 'loginWithAccessToken',
    value: function loginWithAccessToken(accessToken) {
      var _this = this;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$refresh = _ref.refresh,
          refresh = _ref$refresh === undefined ? true : _ref$refresh;

      return this.api('/devices/list', {}, {}, accessToken).then(function (resp) {
        if (resp.device) {
          _this.accessToken = accessToken;
          return { success: true, token: accessToken };
        } else {
          throw resp;
        }
      });
    }
  }, {
    key: 'loginWithToken',
    value: function loginWithToken(token) {
      var _this2 = this;

      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$refresh = _ref2.refresh,
          refresh = _ref2$refresh === undefined ? true : _ref2$refresh;

      return this.api('/token', { token: token }).then(function (resp) {
        if (resp.token && resp.expires) {
          return _this2.loginWithAccessToken(resp.token);
        }
        throw resp;
      });
    }
  }, {
    key: 'logout',
    value: function logout() {}
  }]);
  return TelldusSession;
}();

exports.api = TelldusAPI;
exports.Session = TelldusSession;

Object.defineProperty(exports, '__esModule', { value: true });

})));
