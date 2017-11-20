var print = console.log.bind(console)


let up = x => x.toUpperCase()
let lo = x => x.toLowerCase()
let no = x => x

var cases = {
  auto: true,
  camel: [/^\w|[a-z][A-Z]/g, (a, b, up, lo) => b != null ? lo(a) + up(b) : lo(a)],
  kebab: [/^\w|.-./g, (a, b, up, lo) => b != null ? lo(a) + '-' + lo(b) : lo(a)],
  snake: [/^\w|._./g, (a, b, up, lo) => b != null ? lo(a) + '_' + lo(b) : lo(a)],
  dot: [/^\w|.\../g, (a, b, up, lo) => b != null ? lo(a) + '.' + lo(b) : lo(a)],
  space: [/^\w|. ./g, (a, b, up, lo) => b != null ? lo(a) + ' ' + lo(b) : lo(a)],
  path: [/^\w|.\/./g, (a, b, up, lo) => b != null ? lo(a) + '/' + lo(b) : lo(a)],
  title: [/^[A-Z]|[a-z] [A-Z]/g, (a, b, up, lo) => b != null ? lo(a) + ' ' + up(b) : up(a)],
  pascal: [/^[A-Z]|[a-z][A-Z]/g, (a, b, up, lo) => b != null ? lo(a) + up(b) : up(a)],
  header: [/^[A-Z]|[a-z]-[A-Z]/g, (a, b, up, lo) => b != null ? lo(a) + '-' + up(b) : up(a)],
}

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

function kase(str, from, to) {
  // if (from === to) return str  // Short circuit if no conversion.
  return str.replace(cases[from][0], m => {
    var a = m[0], b = m.length > 1 ? m[m.length - 1] : null
    print(a, b)
    return cases[to][1](a, b, up, lo)
  })
}

export {kase}
