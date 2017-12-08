'use strict';

exports.__esModule = true;
var print = console.log.bind(console);

var _require = require('./rexi'),
    Rexi = _require.Rexi;

var up = function up(x) {
  return x.toUpperCase();
};
var lo = function lo(x) {
  return x.toLowerCase();
};
var no = function no(x) {
  return x;
};
var isUpperCase = function isUpperCase(str) {
  return !/[a-z]/g.test(str);
};
var isLowerCase = function isLowerCase(str) {
  return !/[A-Z]/g.test(str);
};
var isAnyDig = function isAnyDig(str) {
  return (/\d/g.test(str)
  );
};
var reParts = {
  nonWord: '[^a-zA-Z0-9]',
  camel: function camel() {
    return '((?<a>[a-z])(?<b>[A-Z])|(?<a>[A-Z])(?<b>[A-Z])(?=[a-z]))';
  },
  start: function start(sep) {
    var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
    return '(^' + (sep || this.nonWord) + '*(?<b>' + b + '))';
  },
  split: function split(sep) {
    var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
    var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
    return '((?<a>' + a + '?)' + (sep || this.nonWord) + '+(?<b>' + b + '))';
  },
  digit: function digit(sep) {
    return '((?<a>\\d?)' + (sep || this.nonWord) + '+(?<b>\\d))';
  }
};

var cases = {
  // any: [new Rexi(`((?<a>[a-z])(?<b>[A-Z])|(?<a>[A-Z])(?<b>[A-Z])(?=[a-z]))|(^[^a-zA-Z0-9]*(?<b>.))|((?<a>.?)[^a-zA-Z0-9]+(?<b>.?))`, 'g')],
  any: [new Rexi(reParts.camel() + '|' + reParts.start() + '|' + reParts.split(), 'g')],
  camel: [new Rexi(reParts.camel() + '|' + reParts.start('_') + '|' + reParts.digit('_'), 'g'), function (a, b) {
    return a != null ? lo(a) + (isAnyDig(a + b) ? '_' : '') + up(b) : lo(b);
  }],
  kebab: [new Rexi(reParts.start('-') + '|' + reParts.split('-'), 'g'), function (a, b) {
    return a != null ? lo(a) + '-' + lo(b) : lo(b);
  }],
  snake: [new Rexi(reParts.start('_') + '|' + reParts.split('_'), 'g'), function (a, b) {
    return a != null ? lo(a) + '_' + lo(b) : lo(b);
  }],
  dot: [new Rexi(reParts.start('\\.') + '|' + reParts.split('\\.'), 'g'), function (a, b) {
    return a != null ? lo(a) + '.' + lo(b) : lo(b);
  }],
  space: [new Rexi(reParts.start(' ') + '|' + reParts.split(' '), 'g'), function (a, b) {
    return a != null ? lo(a) + ' ' + lo(b) : lo(b);
  }],
  path: [new Rexi(reParts.start('/') + '|' + reParts.split('/'), 'g'), function (a, b) {
    return a != null ? lo(a) + '/' + lo(b) : lo(b);
  }],
  title: [new Rexi(reParts.start(' ', '[A-Z]') + '|' + reParts.split(' ', '[a-z]', '[A-Z]') + '|' + reParts.digit(' '), 'g'), function (a, b) {
    return a != null ? lo(a) + ' ' + up(b) : up(b);
  }],
  pascal: [new Rexi(reParts.camel() + '|' + reParts.start('_', '[A-Z]') + '|' + reParts.digit('_'), 'g'), function (a, b) {
    return a != null ? lo(a) + (isAnyDig(a + b) ? '_' : '') + up(b) : up(b);
  }],
  header: [new Rexi(reParts.start('-', '[A-Z]') + '|' + reParts.split('-', '[a-z]', '[A-Z]') + '|' + reParts.digit('-'), 'g'), function (a, b) {
    return a != null ? lo(a) + '-' + up(b) : up(b);
  }]
};

function kase(str, from, to) {
  if (from === to) return str; // Short circuit if no conversion.
  var re = cases[from][0],
      fn = cases[to][1];
  print(re.source);

  return re.replace(str, function (_ref) {
    var _ref$labels = _ref.labels,
        a = _ref$labels.a,
        b = _ref$labels.b;
    return fn(a, b);
  });
  // return re.replace(str, '$a-$b')
}

kase.isUpper = kase.isUpperCase = isUpperCase;
kase.isLower = kase.isLowerCase = isLowerCase;

exports.kase = kase;
exports.isUpperCase = isUpperCase;
exports.isLowerCase = isLowerCase;