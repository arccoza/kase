var print = console.log.bind(console)


let up = x => x.toUpperCase()
let lo = x => x.toLowerCase()
let no = x => x
let isUpperCase = str => !(/[a-z]/g).test(str)
let isLowerCase = str => !(/[A-Z]/g).test(str)

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

function kase(str, from, to) {
  if (from === to) return str  // Short circuit if no conversion.
  return str.replace(cases[from][0], m => {
    var a = m[0], b = m.length > 1 ? m[m.length - 1] : null
    return cases[to][1](a, b, up, lo)
  })
}

kase.isUpper = kase.isUpperCase = isUpperCase
kase.isLower = kase.isLowerCase = isLowerCase

export {kase, isUpperCase, isLowerCase}
