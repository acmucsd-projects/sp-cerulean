/*!
 * chartjs-chart-matrix v1.0.0-beta
 * https://github.com/kurkle/chartjs-chart-matrix#readme
 * (c) 2020 Jukka Kurkela
 * Released under the MIT license
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Chart));
}(this, (function (Chart) { 'use strict';

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Chart__default = /*#__PURE__*/_interopDefaultLegacy(Chart);

function _extends() {
  _extends = Object.assign || function (target) {
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

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var MatrixController = /*#__PURE__*/function (_DatasetController) {
  _inheritsLoose(MatrixController, _DatasetController);

  function MatrixController() {
    return _DatasetController.apply(this, arguments) || this;
  }

  var _proto = MatrixController.prototype;

  _proto.initialize = function initialize() {
    this.enableOptionSharing = true;

    _DatasetController.prototype.initialize.call(this);
  };

  _proto.update = function update(mode) {
    var me = this;
    var meta = me._cachedMeta;
    me.updateElements(meta.data, 0, meta.data.length, mode);
  };

  _proto.updateElements = function updateElements(rects, start, count, mode) {
    var me = this;
    var reset = mode === 'reset';
    var _me$_cachedMeta = me._cachedMeta,
        xScale = _me$_cachedMeta.xScale,
        yScale = _me$_cachedMeta.yScale;
    var firstOpts = me.resolveDataElementOptions(start, mode);
    var sharedOptions = me.getSharedOptions(mode, rects[start], firstOpts);

    for (var i = start; i < start + count; i++) {
      var parsed = !reset && me.getParsed(i);
      var x = reset ? xScale.getBasePixel() : xScale.getPixelForValue(parsed.x);
      var y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(parsed.y);
      var options = me.resolveDataElementOptions(i, mode);
      var width = options.width,
          height = options.height,
          anchorX = options.anchorX,
          anchorY = options.anchorY;
      var properties = {
        x: anchorX === 'left' ? x : x - width / (anchorX === 'right' ? 1 : 2),
        y: anchorY === 'top' ? y : y - height / (anchorY === 'bottom' ? 1 : 2),
        width: width,
        height: height,
        options: options
      };
      me.updateElement(rects[i], i, properties, mode);
    }

    me.updateSharedOptions(sharedOptions, mode);
  };

  _proto.draw = function draw() {
    var me = this;
    var data = me.getMeta().data || [];
    var i, ilen;

    for (i = 0, ilen = data.length; i < ilen; ++i) {
      data[i].draw(me._ctx);
    }
  };

  return MatrixController;
}(Chart.DatasetController);
MatrixController.id = 'matrix';
MatrixController.defaults = {
  dataElementType: 'matrix',
  dataElementOptions: ['backgroundColor', 'borderColor', 'borderWidth', 'anchorX', 'anchorY', 'width', 'height'],
  hover: {
    mode: 'nearest',
    intersect: true
  },
  datasets: {
    animation: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'width', 'height']
      }
    },
    anchorX: 'center',
    anchorY: 'center'
  },
  tooltips: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    x: {
      type: 'linear',
      offset: true
    },
    y: {
      type: 'linear',
      reverse: true
    }
  }
};

function isObject(value) {
  return value !== null && Object.prototype.toString.call(value) === '[object Object]';
}

var supportsEventListenerOptions = function () {
  var passiveSupported = false;

  try {
    var options = {
      get passive() {
        passiveSupported = true;
        return false;
      }

    };
    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (e) {}

  return passiveSupported;
}();

/**
 * Helper function to get the bounds of the rect
 * @param {Matrix} rect the rect
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the rect
 * @private
 */

function getBounds(rect, useFinalPosition) {
  var _rect$getProps = rect.getProps(['x', 'y', 'width', 'height'], useFinalPosition),
      x = _rect$getProps.x,
      y = _rect$getProps.y,
      width = _rect$getProps.width,
      height = _rect$getProps.height;

  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height
  };
}

function limit(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

function parseBorderWidth(rect, maxW, maxH) {
  var value = rect.options.borderWidth;
  var t, r, b, l;

  if (isObject(value)) {
    t = +value.top || 0;
    r = +value.right || 0;
    b = +value.bottom || 0;
    l = +value.left || 0;
  } else {
    t = r = b = l = +value || 0;
  }

  return {
    t: limit(t, 0, maxH),
    r: limit(r, 0, maxW),
    b: limit(b, 0, maxH),
    l: limit(l, 0, maxW)
  };
}

function boundingRects(rect) {
  var bounds = getBounds(rect);
  var width = bounds.right - bounds.left;
  var height = bounds.bottom - bounds.top;
  var border = parseBorderWidth(rect, width / 2, height / 2);
  return {
    outer: {
      x: bounds.left,
      y: bounds.top,
      w: width,
      h: height
    },
    inner: {
      x: bounds.left + border.l,
      y: bounds.top + border.t,
      w: width - border.l - border.r,
      h: height - border.t - border.b
    }
  };
}

function _inRange(rect, x, y, useFinalPosition) {
  var skipX = x === null;
  var skipY = y === null;
  var bounds = !rect || skipX && skipY ? false : getBounds(rect, useFinalPosition);
  return bounds && (skipX || x >= bounds.left && x <= bounds.right) && (skipY || y >= bounds.top && y <= bounds.bottom);
}

var Matrix = /*#__PURE__*/function (_Element) {
  _inheritsLoose(Matrix, _Element);

  function Matrix(cfg) {
    var _this;

    _this = _Element.call(this) || this;
    _this.options = undefined;
    _this.width = undefined;
    _this.height = undefined;

    if (cfg) {
      _extends(_assertThisInitialized(_this), cfg);
    }

    return _this;
  }

  var _proto = Matrix.prototype;

  _proto.draw = function draw(ctx) {
    var options = this.options;

    var _boundingRects = boundingRects(this),
        inner = _boundingRects.inner,
        outer = _boundingRects.outer;

    ctx.save();

    if (outer.w !== inner.w || outer.h !== inner.h) {
      ctx.beginPath();
      ctx.rect(outer.x, outer.y, outer.w, outer.h);
      ctx.clip();
      ctx.rect(inner.x, inner.y, inner.w, inner.h);
      ctx.fillStyle = options.backgroundColor;
      ctx.fill();
      ctx.fillStyle = options.borderColor;
      ctx.fill('evenodd');
    } else {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(inner.x, inner.y, inner.w, inner.h);
    }

    ctx.restore();
  };

  _proto.inRange = function inRange(mouseX, mouseY, useFinalPosition) {
    return _inRange(this, mouseX, mouseY, useFinalPosition);
  };

  _proto.inXRange = function inXRange(mouseX, useFinalPosition) {
    return _inRange(this, mouseX, null, useFinalPosition);
  };

  _proto.inYRange = function inYRange(mouseY, useFinalPosition) {
    return _inRange(this, null, mouseY, useFinalPosition);
  };

  _proto.getCenterPoint = function getCenterPoint(useFinalPosition) {
    var _this$getProps = this.getProps(['x', 'y', 'width', 'height'], useFinalPosition),
        x = _this$getProps.x,
        y = _this$getProps.y,
        width = _this$getProps.width,
        height = _this$getProps.height;

    return {
      x: x + width / 2,
      y: y + height / 2
    };
  };

  _proto.tooltipPosition = function tooltipPosition() {
    return this.getCenterPoint();
  };

  _proto.getRange = function getRange(axis) {
    return axis === 'x' ? this.width / 2 : this.height / 2;
  };

  return Matrix;
}(Chart.Element);
Matrix.id = 'matrix';
Matrix.defaults = {
  width: 20,
  height: 20
};

Chart__default['default'].register(MatrixController, Matrix);

})));
