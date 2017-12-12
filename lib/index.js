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
  word: '[a-zA-Z0-9]',
  nonWord: '[^a-zA-Z0-9]',
  camel: function camel() {
    return '((?<a>[a-z])(?<b>[A-Z])|(?<a>[A-Z])(?<b>[A-Z])(?=[a-z]))';
  },
  start: function start(sep, b) {
    return '(^' + (sep || this.nonWord) + '*(?<b>' + (b || this.word) + '))';
  },
  split: function split(sep, a, b) {
    return '((?<a>' + (a || this.word) + '?)' + (sep || this.nonWord) + '+(?<b>' + (b || this.word) + '?))';
  },
  digit: function digit(sep) {
    return '((?<a>\\d?)' + (sep || this.nonWord) + '+(?<b>\\d))';
  }
};
// let generic = (a, b, sep) => a != null ? lo(a) + sep + lo(b) : lo(b)
var generic = function generic(a, b, sep) {
  return (a && lo(a) || '') + (a && b && sep || '') + (b && lo(b) || '');
};

var cases = {
  // any: [new Rexi(`((?<a>[a-z])(?<b>[A-Z])|(?<a>[A-Z])(?<b>[A-Z])(?=[a-z]))|(^[^a-zA-Z0-9]*(?<b>.))|((?<a>[a-zA-Z0-9]?)[^a-zA-Z0-9]+(?<b>[a-zA-Z0-9]?))`, 'g')],
  any: [new Rexi(reParts.camel() + '|' + reParts.start() + '|' + reParts.split(), 'g')],
  camel: [new Rexi(reParts.camel() + '|' + reParts.start('_') + '|' + reParts.digit('_'), 'g'),
  // (a, b) => a != null ? lo(a) + (isAnyDig(a + b) ? '_' : '') + up(b) : lo(b)],
  function (a, b) {
    return (a && lo(a) || '') + (a && b && isAnyDig(a + b) && '_' || '') + (a && b && up(b) || b && lo(b) || '');
  }],
  kebab: [new Rexi(reParts.start('-', '[^-]') + '|' + reParts.split('-', '[^-]', '[^-]'), 'g'), function (a, b) {
    return generic(a, b, '-');
  }],
  snake: [new Rexi(reParts.start('_', '[^_]') + '|' + reParts.split('_', '[^_]', '[^_]'), 'g'), function (a, b) {
    return generic(a, b, '_');
  }],
  dot: [new Rexi(reParts.start('\\.', '[^.]') + '|' + reParts.split('\\.', '[^.]', '[^.]'), 'g'), function (a, b) {
    return generic(a, b, '.');
  }],
  space: [new Rexi(reParts.start(' ', '[^ ]') + '|' + reParts.split(' ', '[^ ]', '[^ ]'), 'g'), function (a, b) {
    return generic(a, b, ' ');
  }],
  path: [new Rexi(reParts.start('/', '[^/]') + '|' + reParts.split('/', '[^/]', '[^/]'), 'g'), function (a, b) {
    return generic(a, b, '/');
  }],
  title: [new Rexi(reParts.start(' ', '[A-Z]') + '|' + reParts.split(' ', '[a-z]', '[A-Z]') + '|' + reParts.digit(' '), 'g'), function (a, b) {
    return (a && lo(a) || '') + (a && b && ' ' || '') + (b && up(b) || '');
  }],
  pascal: [new Rexi(reParts.camel() + '|' + reParts.start('_', '[A-Z]') + '|' + reParts.digit('_'), 'g'), function (a, b) {
    return (a && lo(a) || '') + (a && b && isAnyDig(a + b) && '_' || '') + (b && up(b) || '');
  }],
  header: [new Rexi(reParts.start('-', '[A-Z]') + '|' + reParts.split('-', '[a-z]', '[A-Z]') + '|' + reParts.digit('-'), 'g'), function (a, b) {
    return (a && lo(a) || '') + (a && b && '-' || '') + (b && up(b) || '');
  }]
};

function kase(str, from, to) {
  var re,
      fn,
      res = '',
      len,
      cur,
      pre = 0;
  if (from == to) return str; // Short circuit if no conversion.
  if (from != null && to == null) {
    // If only a `to` arg is supplied.
    ;

    var _ref = ['any', from];
    from = _ref[0];
    to = _ref[1];
  }if (!(cases[from] && (re = cases[from][0]))) throw new ReferenceError('Not a valid `from` argument.');

  if (!(cases[to] && (fn = cases[to][1]))) fn = false; // If there is no matching fn in the `cases` dict.

  // return re.replace(str, ({labels: {a, b}}) => fn && fn(a, b) || generic(a, b, to))
  // return re.replace(str, '$a-$b')

  for (var m, a, b; m = re.exec(str); pre = cur + len) {
    var _m = m;
    var _m$labels = _m.labels;
    a = _m$labels.a;
    b = _m$labels.b;
    cur = _m.index;
    len = _m.value.length;

    if (!a && !b) continue; // If `a` and `b` are blank, skip.
    // Grab the unmatched parts of the string, and add them to the result.
    cur > pre && (res += str.substring(pre, cur).toLowerCase());
    // If `fn` doesn't exist use `generic` with `to` arg as seperator.
    res += fn && fn(a, b) || generic(a, b, to);
  }
  res += str.substring(pre).toLowerCase(); // Grab the leftovers and add to the result.

  return res;
}

kase.isUpper = kase.isUpperCase = isUpperCase;
kase.isLower = kase.isLowerCase = isLowerCase;

exports.kase = kase;
exports.isUpperCase = isUpperCase;
exports.isLowerCase = isLowerCase;