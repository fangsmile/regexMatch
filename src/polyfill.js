//canvas toBlob polyfill
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {

      var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

      for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      console.log('polyfill:canvas toBlob');
      callback(new Blob([arr], { type: type || 'image/png' }));
    }
  });
}

//event propagationPath 
//xuanhun @ 2017-08-17
Event.prototype.propagationPath = function propagationPath() {
  var polyfill = function (evt) {
    var element = evt.target;
    var pathArr = [element];

    if (element === null || element.parentElement === null) {
      return [];
    }

    while (element.parentElement !== null) {
      element = element.parentElement;
      pathArr.unshift(element);
    }
    console.log('polyfill:event.path');
    return pathArr;
  };

  return this.path || (this.composedPath && this.composedPath()) || polyfill(this);
};

//endsWith方法，主要兼容IE
//xuanhun @ 2017-08-17
if (!String.prototype.endsWith)
  String.prototype.endsWith = function (searchStr, Position) {

    if (!(Position < this.length))
      Position = this.length;
    else
      Position |= 0; // round position
    return this.substr(Position - searchStr.length,
      searchStr.length) === searchStr;
  };

//wheel event
//xuanhun @ 2017-8-22
//使用方法window.addWheelListener(el:htmlElement,callBack:function,useCapture:boolean)
(function (window, document) {

  var prefix = "", _addEventListener, support;

  // detect event model
  if (window.addEventListener) {
    _addEventListener = "addEventListener";
  } else {
    _addEventListener = "attachEvent";
    prefix = "on";
  }

  // detect available wheel event
  support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
      "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

  window.addWheelListener = function (elem, callback, useCapture) {
    _addWheelListener(elem, support, callback, useCapture);

    // handle MozMousePixelScroll in older Firefox
    if (support == "DOMMouseScroll") {
      _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
    }
  };

  function _addWheelListener(elem, eventName, callback, useCapture) {
    elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : function (originalEvent) {
      !originalEvent && (originalEvent = window.event);

      // create a normalized event object
      var event = {
        // keep a ref to the original event object
        originalEvent: originalEvent,
        target: originalEvent.target || originalEvent.srcElement,
        type: "wheel",
        deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
        deltaX: 0,
        deltaZ: 0,
        preventDefault: function () {
          originalEvent.preventDefault ?
            originalEvent.preventDefault() :
            originalEvent.returnValue = false;
        }
      };

      // calculate deltaY (and deltaX) according to the event
      if (support == "mousewheel") {
        event.deltaY = - 1 / 40 * originalEvent.wheelDelta;
        // Webkit also support wheelDeltaX
        originalEvent.wheelDeltaX && (event.deltaX = - 1 / 40 * originalEvent.wheelDeltaX);
      } else {
        event.deltaY = originalEvent.detail;
      }

      // it's time to fire the callback
      return callback(event);

    }, useCapture || false);
  }

})(window, document);
//CustomEvent
//lff @ 2017-8-26
//兼容IE
(function () {
  if (typeof window.CustomEvent === "function") return false; //If not IE

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

//xuanhun @ 2017-8-29
window.requestAnimationFrame || function () {

  'use strict';

  window.requestAnimationFrame = window.msRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || function () {

      var fps = 60;
      var delay = 1000 / fps;
      var animationStartTime = Date.now();
      var previousCallTime = animationStartTime;

      return function requestAnimationFrame(callback) {

        var requestTime = Date.now();
        var timeout = Math.max(0, delay - (requestTime - previousCallTime));
        var timeToCall = requestTime + timeout;

        previousCallTime = timeToCall;

        return window.setTimeout(function onAnimationFrame() {

          callback(timeToCall - animationStartTime);

        }, timeout);
      };
    }();

  window.cancelAnimationFrame = window.mozCancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.cancelRequestAnimationFrame
    || window.msCancelRequestAnimationFrame
    || window.mozCancelRequestAnimationFrame
    || window.webkitCancelRequestAnimationFrame
    || function cancelAnimationFrame(id) {
      window.clearTimeout(id);
    };

}();

Element.prototype.getAttributeNames = function getAttributeNames() {
  return Array.prototype.map.call(this.attributes, function(a) {
      return a.name;
  });
};