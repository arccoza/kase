'use strict';

exports.__esModule = true;
var print = console.log.bind(console);

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

var cases = {
  auto: true,
  camel: [/^\w|[a-z][A-Z]/g, function (a, b, up, lo) {
    return a != null ? lo(a) + up(b) : lo(b);
  }],
  kebab: [/^\w|.-./g, function (a, b, up, lo) {
    return a != null ? lo(a) + '-' + lo(b) : lo(b);
  }],
  snake: [/^\w|._./g, function (a, b, up, lo) {
    return a != null ? lo(a) + '_' + lo(b) : lo(b);
  }],
  dot: [/^\w|.\../g, function (a, b, up, lo) {
    return a != null ? lo(a) + '.' + lo(b) : lo(b);
  }],
  space: [/^\w|. ./g, function (a, b, up, lo) {
    return a != null ? lo(a) + ' ' + lo(b) : lo(b);
  }],
  path: [/^\w|.\/./g, function (a, b, up, lo) {
    return a != null ? lo(a) + '/' + lo(b) : lo(b);
  }],
  title: [/^[A-Z]|[a-z] [A-Z]/g, function (a, b, up, lo) {
    return a != null ? lo(a) + ' ' + up(b) : up(b);
  }],
  pascal: [/^[A-Z]|[a-z][A-Z]/g, function (a, b, up, lo) {
    return a != null ? lo(a) + up(b) : up(b);
  }],
  header: [/^[A-Z]|[a-z]-[A-Z]/g, function (a, b, up, lo) {
    return a != null ? lo(a) + '-' + up(b) : up(b);
  }]
};

function kase(str, from, to) {
  if (from === to) return str; // Short circuit if no conversion.
  return str.replace(cases[from][0], function (m) {
    var b = m[m.length - 1],
        a = m.length > 1 ? m[0] : null;
    return cases[to][1](a, b, up, lo);
  });
}

kase.isUpper = kase.isUpperCase = isUpperCase;
kase.isLower = kase.isLowerCase = isLowerCase;

exports.kase = kase;
exports.isUpperCase = isUpperCase;
exports.isLowerCase = isLowerCase;