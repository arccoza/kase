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

var cases = {
  auto: true,
  camel: [/^\w|[a-z][A-Z]/g, function (a, b, up, lo) {
    return b != null ? lo(a) + up(b) : lo(a);
  }],
  kebab: [/^\w|.-./g, function (a, b, up, lo) {
    return b != null ? lo(a) + '-' + lo(b) : lo(a);
  }],
  snake: [/^\w|._./g, function (a, b, up, lo) {
    return b != null ? lo(a) + '_' + lo(b) : lo(a);
  }],
  dot: [/^\w|.\../g, function (a, b, up, lo) {
    return b != null ? lo(a) + '.' + lo(b) : lo(a);
  }],
  space: [/^\w|. ./g, function (a, b, up, lo) {
    return b != null ? lo(a) + ' ' + lo(b) : lo(a);
  }],
  path: [/^\w|.\/./g, function (a, b, up, lo) {
    return b != null ? lo(a) + '/' + lo(b) : lo(a);
  }],
  title: [/^[A-Z]|[a-z] [A-Z]/g, function (a, b, up, lo) {
    return b != null ? lo(a) + ' ' + up(b) : up(a);
  }],
  pascal: [/^[A-Z]|[a-z][A-Z]/g, function (a, b, up, lo) {
    return b != null ? lo(a) + up(b) : up(a);
  }],
  header: [/^[A-Z]|[a-z]-[A-Z]/g, function (a, b, up, lo) {
    return b != null ? lo(a) + '-' + up(b) : up(a);
  }]

  // var cases = {
  //   'camelCase': null,
  //   'kebab-case': null,
  //   'KEBAB-CASE': null,
  //   'snake_case': null,
  //   'SNAKE_CASE': null,
  //   'dot.case': null,
  //   'DOT.CASE': null,
  //   'Title Case': null,
  //   'space case': null,
  //   'SPACE CASE': null,
  //   'PascalCase': null,
  //   'Header-Case': null,
  //   ...cases,
  // }

};function kase(str, from, to) {
  // if (from === to) return str  // Short circuit if no conversion.
  return str.replace(cases[from][0], function (m) {
    var a = m[0],
        b = m.length > 1 ? m[m.length - 1] : null;
    print(a, b);
    return cases[to][1](a, b, up, lo);
  });
}

exports.kase = kase;