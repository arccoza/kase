'use strict';

exports.__esModule = true;
var print = console.log.bind(console);

var _require = require('./regi'),
    Regi = _require.Regi;

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
// let general = (f1, sep, f2, f3) => (a, b) => a != null ? f1(a) + sep + f2(b) : f3(b)
// let reGen = (fst, bef, sep, aft) => RegExp(`^${fst}|${bef}${sep}${aft}`, 'g')
var isAnyDig = function isAnyDig(str) {
  return (/\d/g.test(str)
  );
};

var cases = {
  all: [/^.|.[-_. /]+.|[a-z][A-Z]/g],
  // any: [/(([a-z]?)([A-Z])|([A-Z]?)([A-Z]))|((.?)[^a-zA-Z0-9]+(.?))|(^[^a-zA-Z0-9]*(.))/g],
  any: [new Regi('((?<a>[a-z]?)(?<b>[A-Z])|(?<a>[A-Z]?)(?<b>[A-Z]))|((?<a>.?)[^a-zA-Z0-9]+(?<b>.?))|(^[^a-zA-Z0-9]*(?<b>.))', 'g')],
  camel: [/(([a-z])([A-Z]))|((\d?)_+(\d?))|(^_*(.))/g, function (a, b) {
    return a != null ? lo(a) + (isAnyDig(a + b) ? '_' : '') + up(b) : lo(b);
  }],
  kebab: [/((.?)-+(.?))|(^-*(.))/g, function (a, b) {
    return a != null ? lo(a) + '-' + lo(b) : lo(b);
  }],
  snake: [/^.|._./g, function (a, b) {
    return a != null ? lo(a) + '_' + lo(b) : lo(b);
  }],
  dot: [/^.|.\../g, function (a, b) {
    return a != null ? lo(a) + '.' + lo(b) : lo(b);
  }],
  space: [/^.|. ./g, function (a, b) {
    return a != null ? lo(a) + ' ' + lo(b) : lo(b);
  }],
  path: [/^.|.\/./g, function (a, b) {
    return a != null ? lo(a) + '/' + lo(b) : lo(b);
  }],
  title: [/^[A-Z]|[a-z] [A-Z]/g, function (a, b) {
    return a != null ? lo(a) + ' ' + up(b) : up(b);
  }],
  pascal: [/^[A-Z]|[a-z][A-Z]/g, function (a, b) {
    return a != null ? lo(a) + up(b) : up(b);
  }],
  header: [/^[A-Z]|[a-z]-[A-Z]/g, function (a, b) {
    return a != null ? lo(a) + '-' + up(b) : up(b);
  }]
};

function kase(str, from, to) {
  if (from === to) return str; // Short circuit if no conversion.
  var re = cases[from][0],
      fn = cases[to][1];

  // return str.replace(re, (...m) => {
  //   var len = m.length, mch = m[0], subs = m.slice(1, -2), i = m[len - 2], v = m[len - 1]

  //   var [a, b] =
  //     subs[0] != null ? [subs[1], subs[2]] :
  //     subs[3] != null ? [subs[4], subs[5]] :
  //     subs[6] != null ? [null, subs[7]] :
  //     [null, null]
  //   print(a, b)
  //   // var a = v[i - 1], b = v[i + 1]
  //   // var len = m.length, b = m[len - 1], a = len > 1 ? m[0] : null
  //   // print(m, a + b, isAnyDig(a + b))
  //   return fn(a, b)
  // })

  return re.replace(str, function (_ref) {
    var _ref$labels = _ref.labels,
        a = _ref$labels.a,
        b = _ref$labels.b;
    return fn(a, b);
  });
}

// for (let m, re = cases[from][0], fn = cases[to][1]; m = re.exec(str);) {
//     print(m)
//   }

kase.isUpper = kase.isUpperCase = isUpperCase;
kase.isLower = kase.isLowerCase = isLowerCase;

exports.kase = kase;
exports.isUpperCase = isUpperCase;
exports.isLowerCase = isLowerCase;