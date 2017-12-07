'use strict';

exports.__esModule = true;
var print = console.log.bind(console);
var reNamed = /(?:\(\?[:=!])|(?:\(\?<(\S+?)>)|\(/g;
var reReplaceEscapes = '(?:\\${2})+|'; // Matches any `$` with a preceding `$`.
var str = '((?<foo>aa))|(bc)(?<foo>.)';

function reParse(pattern) {
  var labels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var reReplace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var hasLabels = false; // Used to indicate if there are named groups in the `pattern`.
  pattern = pattern.replace(reNamed, function (m, v, i) {
    // print(m, v, i)
    if (v != null) {
      hasLabels = true;
      labels.push(v);
      reReplace['\\$(' + v + ')'] = true;
      return '(';
    }

    if (pattern[i + 1] !== '?' && pattern[i - 1] !== '\\') labels.push(null);

    return m;
  });

  reReplace = hasLabels ? new RegExp(reReplaceEscapes + Object.keys(reReplace).join('|'), 'g') : null;

  return [pattern, labels, reReplace];
}

function matchMaker(labels, match, index, input) {
  match.groups = new Array(match.length - 1);
  for (var i = 1; i < match.length; match.groups[i - 1] = match[i++]) {}
  // match.groups = match.slice(1)
  match.index = match.index != null ? match.index : index;
  match.input = match.input != null ? match.input : input;
  match.labels = {};
  match.value = match[0];

  for (var _i = 0, k, v, len = labels.length; k = labels[_i], v = match[_i + 1], _i < len; _i++) {
    if (k == null || v == null) continue;
    match.labels[k] = v;
  }
  // print(match, labels)
  return match;
}

// var g = []
// print(reParse(str, g))

function Rexi(srcPattern, flags) {
  var _reParse = reParse(srcPattern),
      regPattern = _reParse[0],
      labels = _reParse[1],
      reReplace = _reParse[2];

  print(reReplace);

  Object.defineProperty(this, '_re', { value: new RegExp(regPattern, flags), writable: false });
  Object.defineProperty(this, '_labels', { value: labels, writable: false });
  Object.defineProperty(this, '_pattern', { value: srcPattern, writable: false });
  Object.defineProperty(this, '_replacer', { value: reReplace, writable: false });

  return this;
}

Rexi.prototype = Object.create(RegExp.prototype, {
  lastIndex: {
    get: function get() {
      return this._re.lastIndex;
    },
    set: function set(v) {
      this._re.lastIndex = v;
    }
  },
  flags: {
    get: function get() {
      return this._re.flags;
    }
  },
  global: {
    get: function get() {
      return this._re.global;
    }
  },
  ignoreCase: {
    get: function get() {
      return this._re.ignoreCase;
    }
  },
  multiline: {
    get: function get() {
      return this._re.multiline;
    }
  },
  source: {
    get: function get() {
      return this._pattern;
    }
  },
  sticky: {
    get: function get() {
      return this._re.sticky;
    }
  },
  unicode: {
    get: function get() {
      return this._re.unicode;
    }
  }
});

Object.assign(Rexi.prototype, {
  iterator: function iterator(str) {
    var re = this._re,
        labels = this._labels,
        tmpIndex = 0;
    return {
      index: 0,
      next: function next() {
        var _ref = [re.lastIndex, this.index];
        tmpIndex = _ref[0];
        re.lastIndex = _ref[1];

        var m = re.exec(str);

        if (m == null) return { done: true
          // TODO: Handle stuck indices better, cos simply increasing
          // the index pointer to avoid infinite loops means that
          // an index that is off by 1 is somtimes stored in the iterator.
        };if (re.lastIndex === m.index) {
          ++re.lastIndex;
        }

        var _ref2 = [tmpIndex, re.lastIndex];
        re.lastIndex = _ref2[0];
        this.index = _ref2[1];

        return { done: false, value: matchMaker(labels, m) };
      }
    };
  },
  exec: function exec(str) {
    var re = this._re,
        labels = this._labels;
    var m = re.exec(str);
    if (m == null) return m;
    if (re.lastIndex === m.index) {
      ++re.lastIndex;
    }
    return matchMaker(labels, m);
  },
  replace: function replace(str, rep) {
    var _this = this;

    var re = this._re,
        labels = this._labels;
    return str.replace(re, function () {
      for (var _len = arguments.length, m = Array(_len), _key = 0; _key < _len; _key++) {
        m[_key] = arguments[_key];
      }

      var len = m.length,
          idx = m[len - 2],
          inp = m[len - 1],
          mch;
      m.length = len - 2;
      mch = matchMaker(labels, m, idx, inp);

      if (typeof rep === 'function') return rep(mch);
      return rep.replace(_this._replacer, function (m) {
        var len = m.length;
        // If the last character of the match is `$`, then we've matched
        // an escape sequence, with `reReplaceEscapes`, and must replace
        // the number of `$`s with half as many.
        if (m[len - 1] === '$') return '$'.repeat(len / 2);

        // Otherwise we trim the leading dollar off the match, and look
        // for the associated label, matched earlier, for the replacement.
        var r = mch.labels[m.slice(1)];
        return r == null ? '' : r;
      });
    });
  }
});

exports.Rexi = Rexi;

// var re = new Rexi(str, 'g')
// print(re.iterator)
// var it = re.iterator('aabcd')
// print(it.next(), it.index, it.next(), it.index, it.next(), it.index, it.next())
// print(re.exec('aabcd'), re.lastIndex, re.exec('aabcd'), re.lastIndex, re.exec('aabcd'), re.lastIndex)
// print(re.replace('aabcd', 'b'), re.lastIndex)
// print('aabcd'.replace(re, 'b'))
// print('12aabcd'.match(re))