'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var print = console.log.bind(console);
var reNamed = /(?:\(\?[:=!])|(?:\(\?<(\S+?)>)|\(/g;
var str = '((?<foo>aa))|(bc)(?<foo>.)';

function reParse(pattern) {
  var labels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return [pattern.replace(reNamed, function (m, v, i) {
    // print(m, v, i)
    if (v != null) {
      labels.push(v);
      return '(';
    }

    if (pattern[i + 1] !== '?' && pattern[i - 1] !== '\\') labels.push(null);

    return m;
  }), labels];
}

function matchMaker(labels, match, index, input) {
  match.groups = match.slice(1), match.index = match.index != null ? match.index : index;
  match.input = match.input != null ? match.input : input;
  match.labels = {};
  match.value = match[0];

  for (var i = 0, k, v, len = labels.length; k = labels[i], v = match.groups[i], i < len; i++) {
    if (k == null || v == null) continue;
    match.labels[k] = v;
  }
  // print(match, labels)
  return match;
}

// var g = []
// print(reParse(str, g))

var Regi = function (_RegExp) {
  _inherits(Regi, _RegExp);

  function Regi(srcPattern, flags) {
    _classCallCheck(this, Regi);

    var _reParse = reParse(srcPattern),
        regPattern = _reParse[0],
        labels = _reParse[1];

    var _this = _possibleConstructorReturn(this, _RegExp.call(this, regPattern, flags));

    Object.defineProperty(_this, 'source', { value: srcPattern, writable: false });
    Object.defineProperty(_this, '_labels', { value: labels, writable: false });
    Object.defineProperty(_this, '_exec', { value: _RegExp.prototype.exec, writable: false });
    return _this;
  }

  Regi.prototype.iterator = function iterator(str) {
    var re = this,
        tmpIndex = 0;
    return {
      index: 0,
      next: function next() {
        var _ref = [re.lastIndex, this.index];
        tmpIndex = _ref[0];
        re.lastIndex = _ref[1];

        var m = re._exec(str);

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

        return { done: false, value: matchMaker(re._labels, m) };
      }
    };
  };

  Regi.prototype.exec = function exec(str) {
    // TODO: Simplify `exec` by simply calling `_exec` and
    // bundling the match with `matchMaker` fn.
    // No need to get an iterator.
    // var re = this
    // re._it = re.lastIndex === 0 ? re.iterator(str) : re._it

    // let res = re._it.next()
    // re.lastIndex = re._it.index

    // if (res.done === true) {
    //   re.lastIndex = 0
    //   return null
    // }

    // return res.value

    var re = this;
    var m = re._exec(str);
    if (m == null) return m;
    if (re.lastIndex === m.index) {
      ++re.lastIndex;
    }
    return matchMaker(re._labels, m);
  };

  Regi.prototype.replace = function replace(str, rep) {
    var re = this;
    return str.replace(re, function () {
      for (var _len = arguments.length, m = Array(_len), _key = 0; _key < _len; _key++) {
        m[_key] = arguments[_key];
      }

      m = matchMaker.apply(undefined, [re._labels, m.slice(0, -2)].concat(m.slice(-2)));
      if (typeof rep === 'function') return rep(m);
      // TODO: parse `rep` string for named groups, via `${name}`.
      return rep;
    });
  };

  return Regi;
}(RegExp);

exports.Regi = Regi;


var re = new Regi(str, 'g');
print(re.iterator);
var it = re.iterator('aaaa');
print(it.next(), it.next(), it.next(), it.next());
print(re.exec('aabcd'), re.exec('aaaa'), re.exec('aaaa'));
print(re.replace('aabcd', 'b'), re.lastIndex);