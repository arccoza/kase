var print = console.log.bind(console)


let up = x => x.toUpperCase()
let lo = x => x.toLowerCase()
let no = x => x
let isUpperCase = str => !(/[a-z]/g).test(str)
let isLowerCase = str => !(/[A-Z]/g).test(str)
// let general = (f1, sep, f2, f3) => (a, b) => a != null ? f1(a) + sep + f2(b) : f3(b)
let reGen = (fst, bef, sep, aft) => RegExp(`^${fst}|${bef}${sep}${aft}`, 'g')

var cases = {
  any: [/^.|.[-_. /].|[a-z][A-Z]/g],
  camel: [/^.|[a-z][A-Z]|\d\.\d/g, (a, b) => a != null ? lo(a) + up(b) : lo(b)],
  kebab: [/^.|.-./g, (a, b) => a != null ? lo(a) + '-' + lo(b) : lo(b)],
  snake: [/^.|._./g, (a, b) => a != null ? lo(a) + '_' + lo(b) : lo(b)],
  dot: [/^.|.\../g, (a, b) => a != null ? lo(a) + '.' + lo(b) : lo(b)],
  space: [/^.|. ./g, (a, b) => a != null ? lo(a) + ' ' + lo(b) : lo(b)],
  path: [/^.|.\/./g, (a, b) => a != null ? lo(a) + '/' + lo(b) : lo(b)],
  title: [/^[A-Z]|[a-z] [A-Z]/g, (a, b) => a != null ? lo(a) + ' ' + up(b) : up(b)],
  pascal: [/^[A-Z]|[a-z][A-Z]/g, (a, b) => a != null ? lo(a) + up(b) : up(b)],
  header: [/^[A-Z]|[a-z]-[A-Z]/g, (a, b) => a != null ? lo(a) + '-' + up(b) : up(b)],
}

function kase(str, from, to) {
  if (from === to) return str  // Short circuit if no conversion.
  return str.replace(cases[from][0], m => {
    var len = m.length, b = m[len - 1], a = len > 1 ? m[0] : null
    return cases[to][1](a, b)
  })
}

kase.isUpper = kase.isUpperCase = isUpperCase
kase.isLower = kase.isLowerCase = isLowerCase

export {kase, isUpperCase, isLowerCase}
