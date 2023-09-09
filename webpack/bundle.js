(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],3:[function(require,module,exports){
const TwitchAPI = require("node-twitch").default;
const twitch = new TwitchAPI({
  client_id: "lh66uuow4pk6u3t8zu8aqep242yr6m",
  client_secret: "c0jnge0sw5bwa5ogetigryqaf34lfu",
  access_token: "bpl4y9hmovruk3vfgdc937gbanmgpm",
  refresh_token: "mq52sh1owz2p3bakfr1l2eed2q5boyaib400h285t3oe4nk7u5",
});

async function checkStream() {
  try {
    const data = await twitch.getStreams({ channel: ["sayeh"] });
    const result = data.data[0];

    const streamIsLive = localStorage.getItem("streamIsLive");
    const streamTitle = localStorage.getItem("streamTitle");
    const streamView = localStorage.getItem("streamView");
    const streamCategory = localStorage.getItem("streamCategory");

    if (result !== undefined && result.type === "live") {
      if (
        streamIsLive === "false" ||
        streamTitle !== result.title ||
        streamView !== result.viewer_count ||
        streamCategory !== result.game_name
      ) {
        const streamData = {
          streamIsLive: true,
          streamUsername: result.user_name,
          streamAlertEN: "Sayeh is now Live!",
          streamAlertFA: "سایه لایو شد!",
          streamTitle: result.title,
          streamView: result.viewer_count,
          streamCategory: result.game_name,
          streamThumbnail: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${result.user_name.toLowerCase()}-1920x1080.jpg?NgOqCvLCECvrHGtf=1`,
        };

        for (const key in streamData) {
          localStorage.setItem(key, streamData[key]);
        }
      }
    } else if (streamIsLive === "true") {
      const streamData = {
        streamIsLive: false,
        streamUsername: "Sayeh",
        streamAlertEN: "Sayeh is currently Offline.",
        streamAlertFA: "سایه آفلاینه!",
        streamTitle: "Stream is Offline...",
        streamView: "",
        streamCategory: "",
        streamThumbnail:
          "https://static-cdn.jtvnw.net/jtv_user_pictures/3439ad7b-cf49-4c6b-a4ac-ce047ab4bacb-channel_offline_image-1920x1080.jpeg",
      };

      for (const key in streamData) {
        localStorage.setItem(key, streamData[key]);
      }
    }
  } catch (error) {
    console.log("Error fetching twitch data:", error);
  }
}

module.exports = checkStream;

},{"node-twitch":7}],4:[function(require,module,exports){
const apiKey = "AIzaSyDk9jEbgPfyCvFYVF4DtGtsG9V2Az49_Xo";
const channelId = "UCRyvm_KWqZxQio5EOES5NQw";

const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

async function checkVideo() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {

      const videoId = localStorage.getItem("videoId");
      if (videoId === data.items[0].id.videoId) return;

      const videoData = {
        videoId: data.items[0].id.videoId,
        videoFirstTitle: data.items[0].snippet.title,
        videoFirstUrl: `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`,
        vidoeFirstThumbnail: `https://img.youtube.com/vi/${data.items[0].id.videoId}/maxresdefault.jpg`,
        videoSecondTitle: data.items[1].snippet.title,
        videoSecondUrl: `https://www.youtube.com/watch?v=${data.items[1].id.videoId}`,
        videoSecondThumbnail: `https://img.youtube.com/vi/${data.items[1].id.videoId}/maxresdefault.jpg`,
        videoThirdTitle: data.items[2].snippet.title,
        videoThirdUrl: `https://www.youtube.com/watch?v=${data.items[2].id.videoId}`,
        videoThirdThumbnail: `https://img.youtube.com/vi/${data.items[2].id.videoId}/maxresdefault.jpg`,
      };
      for (const key in videoData) {
        localStorage.setItem(key, videoData[key]);
      }
    })
    .catch((error) => {
      console.log("Error fetching youtube data:", error);
    });
}

module.exports = checkVideo;

},{}],5:[function(require,module,exports){
(function (global){(function (){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var globalObject = getGlobal();

module.exports = exports = globalObject.fetch;

// Needed for TypeScript and Webpack.
if (globalObject.fetch) {
	exports.default = globalObject.fetch.bind(globalObject);
}

exports.Headers = globalObject.Headers;
exports.Request = globalObject.Request;
exports.Response = globalObject.Response;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchApiRateLimitError = void 0;
class TwitchApiRateLimitError extends Error {
    constructor(ratelimit) {
        super("Twitch API rate limit reached");
        this.ratelimit = ratelimit;
    }
}
exports.TwitchApiRateLimitError = TwitchApiRateLimitError;

},{}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchApi = exports.TwitchApiRateLimitError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
const node_fetch_1 = __importDefault(require("node-fetch"));
const events_1 = require("events");
const util_1 = require("./util");
const errors_1 = require("./errors");
var errors_2 = require("./errors");
Object.defineProperty(exports, "TwitchApiRateLimitError", { enumerable: true, get: function () { return errors_2.TwitchApiRateLimitError; } });
/** Twitch API */
class TwitchApi extends events_1.EventEmitter {
    constructor(config) {
        var _a;
        super();
        this.client_secret = config.client_secret;
        this.client_id = config.client_id;
        this.access_token = config.access_token;
        this.refresh_token = config.refresh_token;
        this.scopes = config.scopes;
        this.redirect_uri = config.redirect_uri;
        this.throw_ratelimit_errors = (_a = config === null || config === void 0 ? void 0 : config.throw_ratelimit_errors) !== null && _a !== void 0 ? _a : false;
        this.base = "https://api.twitch.tv/helix";
        this.refresh_attempts = 0;
        this.ready = false;
        this._init();
    }
    /*
    ****************
    PRIVATE METHODS
    ****************
    */
    /** Initialize the api.
     * @internal
    */
    _init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.access_token) {
                const currentUser = yield this.getCurrentUser();
                this.user = currentUser;
            }
        });
    }
    /** Throw an error
     * @internal
    */
    _error(message) {
        throw new Error(message);
    }
    /** Get an app access token
     * @internal
     */
    _getAppAccessToken() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                client_id: this.client_id,
                client_secret: this.client_secret,
                grant_type: "client_credentials",
                scope: (_a = this.scopes) === null || _a === void 0 ? void 0 : _a.join(" ")
            };
            const endpoint = "https://id.twitch.tv/oauth2/token";
            const response = yield (0, node_fetch_1.default)(endpoint, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const result = yield response.text();
            try {
                const data = JSON.parse(result);
                return data.access_token;
            }
            catch (err) {
                this._error(`Error getting app access token. Expected twitch to return JSON object but got: ${result}`);
                return undefined;
            }
        });
    }
    /** Refresh the access token
     * @internal
    */
    _refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the current refresh token is valid.
            const valid = yield this._validate();
            if (valid)
                return;
            // Cancel execution and throw error if refresh token is not present.
            if (!this.refresh_token)
                return this._error("Refresh token is not set.");
            const refreshData = {
                client_id: this.client_id,
                client_secret: this.client_secret,
                grant_type: "refresh_token",
                refresh_token: encodeURIComponent(this.refresh_token)
            };
            const url = "https://id.twitch.tv/oauth2/token";
            const options = {
                method: "POST",
                body: JSON.stringify(refreshData),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const response = yield (0, node_fetch_1.default)(url, options);
            const result = yield response.json();
            const accessToken = result.access_token;
            const refreshToken = result.refresh_token;
            // Set the newly fetched access and refresh tokens.
            this.access_token = accessToken || this.access_token;
            this.refresh_token = refreshToken || this.refresh_token;
            if (this._isListeningFor("refresh"))
                this.emit("refresh", result);
            if (!accessToken)
                this.refresh_attempts++;
        });
    }
    /** Checks if an event is handled or not
     * @internal
    */
    _isListeningFor(event) {
        return this.eventNames().includes(event);
    }
    /** Check validity of refresh token
     * @internal
    */
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://id.twitch.tv/oauth2/validate";
            const options = {
                headers: {
                    "Authorization": `OAuth ${this.access_token}`
                }
            };
            const response = yield (0, node_fetch_1.default)(url, options);
            const result = yield response.json();
            const message = result.message;
            const valid = response.status === 200;
            if (message === "missing authorization token")
                this._error(message);
            return valid;
        });
    }
    /** Make a get request to the twitch api
     * @internal
    */
    _get(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.access_token) {
                const accessToken = yield this._getAppAccessToken();
                if (!accessToken)
                    throw new Error("App access token could not be fetched. Please make sure your `client_id` and `client_secret` are correct.");
                this.access_token = accessToken;
            }
            const url = this.base + endpoint;
            const options = {
                method: "GET",
                headers: {
                    "Client-ID": this.client_id,
                    "Authorization": `Bearer ${this.access_token}`
                }
            };
            const response = yield (0, node_fetch_1.default)(url, options);
            if (response.status === 401) {
                yield this._refresh();
                return this._get(endpoint);
            }
            else if (response.status === 429) {
                const ratelimit = {
                    limit: Number(response.headers.get("Ratelimit-Limit")),
                    remaining: Number(response.headers.get("Ratelimit-Remaining")),
                    reset: Number(response.headers.get("Ratelimit-Reset"))
                };
                this.emit("ratelimit", ratelimit);
                if (this.throw_ratelimit_errors) {
                    throw new errors_1.TwitchApiRateLimitError(ratelimit);
                }
                else {
                    yield (0, util_1.sleep)(ratelimit.reset * 1000 - Date.now());
                    return this._get(endpoint);
                }
            }
            const result = yield response.json();
            return result;
        });
    }
    /**
     * Send update request, ie. post, put, patch, delete.
     * @internal
     */
    _update(endpoint, data, method) {
        return __awaiter(this, void 0, void 0, function* () {
            if (endpoint.substring(0, 1) !== "/")
                this._error("Endpoint must start with a '/' (forward slash)");
            const url = this.base + endpoint;
            const options = {
                method: method || "post",
                body: data ? JSON.stringify(data) : "",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.access_token}`,
                    "Client-ID": this.client_id
                }
            };
            let ratelimit = {
                limit: 0,
                remaining: 0,
                reset: 0
            };
            try {
                const response = yield (0, node_fetch_1.default)(url, options);
                ratelimit = {
                    limit: Number(response.headers.get("Ratelimit-Limit")),
                    remaining: Number(response.headers.get("Ratelimit-Remaining")),
                    reset: Number(response.headers.get("Ratelimit-Reset"))
                };
                if (response.status === 200 || response.status === 202)
                    return response.json();
                else
                    return response.text();
            }
            catch (err) {
                const status = err.status;
                if (status === 401) {
                    yield this._refresh();
                    return this._post(endpoint, options);
                }
                else if (status === 429) {
                    this.emit("ratelimit", ratelimit);
                    if (this.throw_ratelimit_errors) {
                        throw new errors_1.TwitchApiRateLimitError(ratelimit);
                    }
                    else {
                        yield (0, util_1.sleep)(ratelimit.reset * 1000 - Date.now());
                        return this._post(endpoint, options);
                    }
                }
                this._error(err);
            }
        });
    }
    /** Send a post request to the Twitch API
     * @internal
     */
    _post(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._update(endpoint, data, "post");
        });
    }
    /** Send a delete request to the Twitch API
     * @internal
     */
    _delete(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._update(endpoint, data, "delete");
        });
    }
    /** Send a patch request to the Twitch API
     * @internal
    */
    _patch(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._update(endpoint, data, "patch");
        });
    }
    /** Send put request to the Twitch API
     * @internal
    */
    _put(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._update(endpoint, data, "put");
        });
    }
    /** Check if the current instance was created with a certain scope
     * @internal
     */
    _hasScope(scope) {
        var _a;
        if (this.scopes)
            return (_a = this.scopes) === null || _a === void 0 ? void 0 : _a.includes(scope);
        return false;
    }
    /*
    **************
    PUBLIC METHODS
    **************
    */
    /***************
    Authentication.
    ***************/
    /** Generate url required to get permission from users */
    generateAuthUrl() {
        var _a;
        const base = "https://id.twitch.tv/oauth2/authorize";
        const clientId = `client_id=${this.client_id}`;
        const redirectUri = `redirect_uri=${encodeURIComponent("" + this.redirect_uri)}`;
        const responseType = "response_type=code";
        const scope = `scope=${(_a = this.scopes) === null || _a === void 0 ? void 0 : _a.join(" ")}`;
        const url = `${base}?${clientId}&${responseType}&${redirectUri}&${scope}`;
        return url;
    }
    /** Get user access from a code generated by visiting the url created by `generateAuthUrl` */
    getUserAccess(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = "https://id.twitch.tv/oauth2/token" +
                `?client_id=${this.client_id}` +
                `&client_secret=${this.client_secret}` +
                `&code=${code}` +
                "&grant_type=authorization_code" +
                `&redirect_uri=${this.redirect_uri}`;
            const response = yield (0, node_fetch_1.default)(endpoint, { method: "POST" });
            const result = yield response.json();
            if (result.access_token)
                this.access_token = result.access_token;
            if (result.refresh_token)
                this.refresh_token = result.refresh_token;
            this.emit("user_auth", result);
        });
    }
    /************************************
    Methods NOT requiring user permissions
    *************************************/
    /** Get games by their name or id */
    getGames(games) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(games) && typeof games !== "string" && typeof games !== "number")
                this._error("games must be either a string or number or an array of strings and/or numbers");
            let query = "?";
            query += (0, util_1.parseMixedParam)({ values: games, stringKey: "name", numericKey: "id" });
            const endpoint = "/games" + query;
            const result = yield this._get(endpoint);
            return result;
        });
    }
    /** Gets games sorted by number of current viewers on Twitch, most popular first. */
    getTopGames(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = options ? (0, util_1.parseOptions)(options) : "";
            const endpoint = `/games/top?${query}`;
            return this._get(endpoint);
        });
    }
    /** Get one or more users by their login names or twitch ids. If only one user is needed, a single string will suffice. */
    getUsers(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "?";
            if (Array.isArray(ids)) {
                query += (0, util_1.parseMixedParam)({ values: ids, stringKey: "login", numericKey: "id" });
            }
            else {
                const key = (0, util_1.isNumber)("" + ids) ? "id" : "login";
                query += `${key}=${ids}`;
            }
            const endpoint = "/users" + query;
            return this._get(endpoint);
        });
    }
    /** Get follows to or from a channel. Must provide either from_id or to_id. */
    getFollows(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "?";
            if (options)
                query += (0, util_1.parseOptions)(options);
            const endpoint = `/users/follows${query}`;
            return this._get(endpoint);
        });
    }
    /** Get one or more live streams */
    getStreams(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "?";
            const endpoint = "/streams";
            if (!options)
                return this._get(endpoint);
            const { channel, channels } = options;
            if (channel) {
                const key = (0, util_1.isNumber)(channel) ? "user_id" : "user_login";
                query += `${key}=${channel}&`;
            }
            if (channels)
                query += (0, util_1.parseMixedParam)({
                    values: channels,
                    stringKey: "user_login",
                    numericKey: "user_id"
                });
            query += "&";
            query += (0, util_1.parseOptions)(options);
            const response = yield this._get(endpoint + query);
            response.data.map(util_1.addThumbnailMethod);
            return response;
        });
    }
    /** Gets the list of all stream tags defined by Twitch, optionally filtered by tag ID(s). */
    getAllStreamTags(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = options ? `?${(0, util_1.parseOptions)(options)}` : "";
            const endpoint = `/tags/streams${query}`;
            return this._get(endpoint);
        });
    }
    /** Gets the list of tags for a specified stream (channel). */
    getStreamTags(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/streams/tags${query}`;
            return this._get(endpoint);
        });
    }
    getGlobalBadges() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = "/chat/badges/global";
            return this._get(endpoint);
        });
    }
    getGlobalEmotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = "/chat/emotes/global";
            return this._get(endpoint);
        });
    }
    /** Fetch videos by a user id, game id, or one or more video ids. Only one of these can be specified at a time. */
    getVideos(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "?";
            query += (0, util_1.parseOptions)(options);
            const endpoint = `/videos${query}`;
            return this._get(endpoint);
        });
    }
    getClips(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/clips${query}`;
            return this._get(endpoint);
        });
    }
    getChannelInformation(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/channels${query}`;
            return this._get(endpoint);
        });
    }
    /** Returns a list of channels (users who have streamed within the past 6 months) that match the query via channel name or description either entirely or partially. Results include both live and offline channels. Online channels will have additional metadata (e.g. started_at, tag_ids). See sample response for distinction. */
    searchChannels(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options.query = encodeURIComponent(options.query);
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/search/channels${query}`;
            return this._get(endpoint);
        });
    }
    /** Returns a list of games or categories that match the query via name either entirely or partially. */
    searchCategories(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options.query = encodeURIComponent(options.query);
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/search/categories${query}`;
            return this._get(endpoint);
        });
    }
    /** Get Extension Transactions allows extension back end servers to fetch a list of transactions that have occurred for their extension across all of Twitch. */
    getExtensionTransactions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/extensions/transactions${query}`;
            return this._get(endpoint);
        });
    }
    /** Retrieves the list of available Cheermotes, animated emotes to which viewers can assign Bits, to cheer in chat. Cheermotes returned are available throughout Twitch, in all Bits-enabled channels. */
    getCheermotes(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = options ? `?${(0, util_1.parseOptions)(options)}` : "";
            const endpoint = `/bits/cheermotes${query}`;
            return this._get(endpoint);
        });
    }
    getChannelEmotes(broadcasterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `?broadcaster_id=${broadcasterId}`;
            const endpoint = `/chat/emotes${query}`;
            return this._get(endpoint);
        });
    }
    getChannelBadges(broadcasterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `?broadcaster_id=${broadcasterId}`;
            const endpoint = `/chat/badges${query}`;
            return this._get(endpoint);
        });
    }
    /*********************************
    Methods requiring user permissions
    **********************************/
    /** Gets the channel stream key for a user. */
    getStreamKey(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("channel:read:stream_key"))
                this._error("missing scope `channel:read:stream_key`");
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/streams/key${query}`;
            const result = yield this._get(endpoint);
            return result.data[0].stream_key;
        });
    }
    /** Gets the currently authenticated users profile information. */
    getCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = "/users";
            const result = yield this._get(endpoint);
            if (!result) {
                this._error("Failed to get current user. This could be because you haven't provided an access_token connected to a user.");
                return;
            }
            const user = result.data[0];
            return user;
        });
    }
    /** Gets a ranked list of Bits leaderboard information for an authorized broadcaster. */
    getBitsLeaderboard(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("bits:read"))
                this._error("missing scope `bits:read`");
            const query = options ? `?${(0, util_1.parseOptions)(options)}` : "";
            const endpoint = `/bits/leaderboard${query}`;
            return this._get(endpoint);
        });
    }
    /** Get all of a broadcaster’s subscriptions. */
    getSubs(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("channel:read:subscriptions"))
                this._error("missing scope `channel:read:subscriptions`");
            const query = `?${(0, util_1.parseOptions)(options)}`;
            const endpoint = `/subscriptions${query}`;
            return this._get(endpoint);
        });
    }
    /** Returns all banned and timed-out users in a channel. */
    getBannedUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("moderation:read"))
                this._error("missing scope `moderation:read`");
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/moderation/banned${query}`;
            return this._get(endpoint);
        });
    }
    /** Adds a specified user to the followers of a specified channel. A successful request does not return any content.
     * @deprecated
    */
    createUserFollows(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn("`createUserFollows` is deprecated. Twitch has already removed the related endpoint, and this method will be removed from `node-twitch` in a future version.");
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/users/follows${query}`;
            return this._post(endpoint);
        });
    }
    /** Deletes a specified user from the followers of a specified channel.
     * @deprecated
     */
    deleteUserFollows(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn("`deleteUserFollows` is deprecated. Twitch has already removed the related endpoint, and this method will be removed from `node-twitch` in a future version.");
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/users/follows${query}`;
            return this._delete(endpoint);
        });
    }
    /** Gets a list of markers for either a specified user’s most recent stream or a specified VOD/video (stream), ordered by recency. A marker is an arbitrary point in a stream that the broadcaster wants to mark; e.g., to easily return to later. The only markers returned are those created by the user identified by the Bearer token.

    The response has a JSON payload with a `data` field containing an array of marker information elements and a `pagination` field containing information required to query for more follow information. */
    getStreamMarkers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("user:read:broadcast"))
                this._error("missing scope `user:read:broadcast`");
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/streams/markers${query}`;
            return this._get(endpoint);
        });
    }
    /** Gets a list of all extensions (both active and inactive) for a specified user, identified by a Bearer token.

    The response has a JSON payload with a `data` field containing an array of user-information elements. */
    getUserExtensions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("user:read:broadcast"))
                this._error("missing scope `user:read:broadcast`");
            const endpoint = "/users/extensions/list";
            return this._get(endpoint);
        });
    }
    /** Gets information about active extensions installed by a specified user, identified by a user ID or Bearer token. */
    getUserActiveExtensions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("user:read:broadcast") && !this._hasScope("user:edit:broadcast"))
                this._error("Missing scope `user:read:broadcast` or `user:edit:broadcast`");
            const query = options ? "?" + (0, util_1.parseOptions)(options) : "";
            const endpoint = "/users/extensions" + query;
            return this._get(endpoint);
        });
    }
    /** Modifies channel information for users. */
    modifyChannelInformation(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("user:edit:broadcast"))
                this._error("Missing scope `user:edit:broadcast`");
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = "/channels" + query;
            return this._patch(endpoint);
        });
    }
    /** Updates the description of a user specified by a Bearer token. */
    updateUser(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("user:edit"))
                this._error("Missing scope `user:edit`");
            const query = options && options.description ? "?" + (0, util_1.parseOptions)(options) : "";
            const endpoint = "/users" + query;
            return this._put(endpoint);
        });
    }
    /** Creates a clip programmatically. This returns both an ID and an edit URL for the new clip.

    Note that the clips service returns a maximum of 1000 clips,

    Clip creation takes time. We recommend that you query Get Clips, with the clip ID that is returned here. If Get Clips returns a valid clip, your clip creation was successful. If, after 15 seconds, you still have not gotten back a valid clip from Get Clips, assume that the clip was not created and retry Create Clip.

    This endpoint has a global rate limit, across all callers. The limit may change over time, but the response includes informative headers: */
    createClip(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("clips:edit"))
                this._error("Missing scope `clips:edit`");
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = "/clips" + query;
            return this._post(endpoint);
        });
    }
    /** Returns all moderators in a channel. */
    getModerators(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("moderation:read"))
                this._error("Missing scope `moderation:read`");
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = "/moderation/moderators" + query;
            return this._get(endpoint);
        });
    }
    /** Gets the status of one or more provided Bits codes. This API requires that the caller is an authenticated Twitch user. The API is throttled to one request per second per authenticated user. Codes are redeemable alphanumeric strings tied only to the bits product. This third-party API allows other parties to redeem codes on behalf of users. Third-party app and extension developers can use the API to provide rewards of bits from within their games.

    All codes are single-use. Once a code has been redeemed, via either this API or the site page, then the code is no longer valid for any further use.

    This endpoint is only available for developers who have a preexisting arrangement with Twitch. We provide sets of codes to the third party as part of a contract agreement. The third-party program then calls this API to credit the Twitch user by submitting specific code(s). This means that a bits reward can be applied without users having to follow any manual steps. */
    getCodeStatus(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = "/entitlements/codes" + query;
            return this._get(endpoint);
        });
    }
    /** Applies specified tags to a specified stream, overwriting any existing tags applied to that stream. If no tags are specified, all tags previously applied to the stream are removed. Automated tags are not affected by this operation.

    Tags expire 72 hours after they are applied, unless the stream is live within that time period. If the stream is live within the 72-hour window, the 72-hour clock restarts when the stream goes offline. The expiration period is subject to change. */
    replaceStreamTags(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `?broadcaster_id=${options.broadcaster_id}`;
            const endpoint = "/streams/tags" + query;
            const data = options.tag_ids ? { tag_ids: options.tag_ids } : null;
            if (data)
                return this._put(endpoint, data);
            else
                return this._put(endpoint);
        });
    }
    /** Starts a commercial on a specified channel. */
    startCommercial(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._hasScope("channel:edit:commercial"))
                this._error("Missing scope `channel:edit:commercial`");
            const query = "?" + (0, util_1.parseOptions)(options);
            const endpoint = `/channels/commercial${query}`;
            return this._post(endpoint);
        });
    }
}
exports.TwitchApi = TwitchApi;
exports.default = TwitchApi;

},{"./errors":6,"./util":8,"events":2,"node-fetch":5}],8:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.addThumbnailMethod = exports.isNumber = exports.parseArrayToQueryString = exports.parseMixedParam = exports.parseOptions = exports.getLocalClientSecret = exports.getLocalClientId = exports.getLocalRefreshToken = exports.getLocalAccessToken = void 0;
const fs_1 = __importDefault(require("fs"));
const userFile = "./data/apiUser.json";
function getLocalAccessToken() {
    const data = JSON.parse(fs_1.default.readFileSync(userFile, "utf8"));
    return data.access_token;
}
exports.getLocalAccessToken = getLocalAccessToken;
function getLocalRefreshToken() {
    const data = JSON.parse(fs_1.default.readFileSync(userFile, "utf8"));
    return data.refresh_token;
}
exports.getLocalRefreshToken = getLocalRefreshToken;
function getLocalClientId() {
    const data = JSON.parse(fs_1.default.readFileSync(userFile, "utf8"));
    return data.client_id;
}
exports.getLocalClientId = getLocalClientId;
function getLocalClientSecret() {
    const data = JSON.parse(fs_1.default.readFileSync(userFile, "utf8"));
    return data.client_secret;
}
exports.getLocalClientSecret = getLocalClientSecret;
/**
 * Parses an object into a query string. If the value of a property is an array, that array will be parsed with the `parseArrayToQueryString` function. If a value is undefined or null, it will be skipped.
 * @param {Object} options - The options to parse.
 */
function parseOptions(options) {
    let query = "";
    for (const key in options) {
        const value = options[key];
        if (value === null || value === undefined)
            continue;
        if (Array.isArray(value))
            query += parseArrayToQueryString(key, value);
        else
            query += `${key}=${value}&`;
    }
    return query.replace(/&$/, "");
}
exports.parseOptions = parseOptions;
function parseMixedParam({ values, stringKey, numericKey }) {
    let query = "";
    function addToQuery(value) {
        const key = !isNumber(value) ? stringKey : numericKey;
        query += `${key}=${value}&`;
    }
    if (Array.isArray(values))
        values.forEach(addToQuery);
    else
        addToQuery(values);
    return query.replace(/&$/, "");
}
exports.parseMixedParam = parseMixedParam;
/**
 * Parse an array into a query string where every value has the same key.
 * @param {string} key - The key to use. This will be repeated in the query for every value in the array
 * @param {string[]|string} arr - Array of values to parse into query string.
 */
function parseArrayToQueryString(key, arr) {
    const list = Array.isArray(arr) ? arr : [arr];
    const result = list.map(value => `${key}=${value}`).join("&");
    return result;
}
exports.parseArrayToQueryString = parseArrayToQueryString;
/** Check if a string represents a number */
function isNumber(value) {
    if (typeof value === "undefined")
        return false;
    if (value === null)
        return false;
    if (("" + value).includes("x"))
        return false;
    return !isNaN(Number("" + value));
}
exports.isNumber = isNumber;
function addThumbnailMethod(stream) {
    const thumbnailUrl = stream.thumbnail_url;
    stream.getThumbnailUrl = (options = { width: 1920, height: 1080 }) => {
        const { width, height } = options;
        return thumbnailUrl.replace("{width}", "" + width).replace("{height}", "" + height);
    };
    return stream;
}
exports.addThumbnailMethod = addThumbnailMethod;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;

},{"fs":1}],9:[function(require,module,exports){
const checkStream = require("./checkStream");
const checkVideo = require("./checkVideo");

setInterval(() => {
  checkStream();
  checkVideo();
}, 5 * 60 * 1000);
},{"./checkStream":3,"./checkVideo":4}]},{},[9]);
