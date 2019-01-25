var print = console.log.bind(console)
var {Rexi} = require('./rexi')


let up = x => x.toUpperCase()
let lo = x => x.toLowerCase()
let no = x => x
let isUpperCase = str => !(/[a-z]/g).test(str)
let isLowerCase = str => !(/[A-Z]/g).test(str)
let isAnyDig = str => (/\d/g).test(str)
let reParts = {
  word: `[a-zA-Z0-9]`,
  nonWord: `[^a-zA-Z0-9]`,
  camel() {return `((?<a>[a-z])(?<b>[A-Z])|(?<a>[A-Z])(?<b>[A-Z])(?=[a-z]))`},
  start(sep, b) {return `(^${sep || this.nonWord}*(?<b>${b || this.word}))`},
  split(sep, a, b) {return `((?<a>${a || this.word}?)${sep || this.nonWord}+(?<b>${b || this.word}?))`},
  digit(sep) {return `((?<a>\\d?)${sep || this.nonWord}+(?<b>\\d))`},
}
let generic = (a, b, sep) => (a && lo(a) || '') + (a && b && sep || '') + (b && lo(b) || '')

var cases = {
  // any: [new Rexi(`((?<a>[a-z])(?<b>[A-Z])|(?<a>[A-Z])(?<b>[A-Z])(?=[a-z]))|(^[^a-zA-Z0-9]*(?<b>.))|((?<a>[a-zA-Z0-9]?)[^a-zA-Z0-9]+(?<b>[a-zA-Z0-9]?))`, 'g')],
  any: [new Rexi(reParts.camel() + '|' + reParts.start() + '|' + reParts.split(),'g')],
  camel: [new Rexi(reParts.camel() + '|' + reParts.start('_') + '|' + reParts.digit('_'),'g'),
    (a, b) => (a && lo(a) || '') + (a && b && isAnyDig(a + b) && '_' || '') + (a && b && up(b) || b && lo(b) || '')],
  kebab: [new Rexi(reParts.start('-', '[^-]') + '|' + reParts.split('-', '[^-]', '[^-]'),'g'),
    (a, b) => generic(a, b, '-')],
  snake: [new Rexi(reParts.start('_', '[^_]') + '|' + reParts.split('_', '[^_]', '[^_]'),'g'),
    (a, b) => generic(a, b, '_')],
  dot: [new Rexi(reParts.start('\\.', '[^.]') + '|' + reParts.split('\\.', '[^.]', '[^.]'),'g'),
    (a, b) => generic(a, b, '.')],
  space: [new Rexi(reParts.start(' ', '[^ ]') + '|' + reParts.split(' ', '[^ ]', '[^ ]'),'g'),
    (a, b) => generic(a, b, ' ')],
  path: [new Rexi(reParts.start('/', '[^/]') + '|' + reParts.split('/', '[^/]', '[^/]'),'g'),
    (a, b) => generic(a, b, '/')],
  title: [new Rexi(reParts.start(' ', '[A-Z]') + '|' + reParts.split(' ', '[a-z]', '[A-Z]') + '|' + reParts.digit(' '),'g'),
    (a, b) => (a && lo(a) || '') + (a && b && ' ' || '') + (b && up(b) || '')],
  pascal: [new Rexi(reParts.camel() + '|' + reParts.start('_', '[A-Z]') + '|' + reParts.digit('_'),'g'),
    (a, b) => (a && lo(a) || '') + (a && b && isAnyDig(a + b) && '_' || '') + (b && up(b) || '')],
  header: [new Rexi(reParts.start('-', '[A-Z]') + '|' + reParts.split('-', '[a-z]', '[A-Z]') + '|' + reParts.digit('-'),'g'),
    (a, b) => (a && lo(a) || '') + (a && b && '-' || '') + (b && up(b) || '')],
}

function kase(str, from, to) {
  var re, fn, res = '', len, cur, pre = 0
  if (from == to) return str  // Short circuit if no conversion.
  if (from != null && to == null)  // If only a `to` arg is supplied.
    [from, to] = ['any', from]

  if (!(cases[from] && (re = cases[from][0])))
    throw new ReferenceError('Not a valid `from` argument.')

  if (!(cases[to] && (fn = cases[to][1])))
    fn = false  // If there is no matching fn in the `cases` dict.

  // return re.replace(str, ({labels: {a, b}}) => fn && fn(a, b) || generic(a, b, to))
  // return re.replace(str, '$a-$b')

  for(let m, a, b; m = re.exec(str); pre = cur + len) {
    ({labels: {a, b}, index: cur, value: {length: len}} = m)
    if (!a && !b) continue  // If `a` and `b` are blank, skip.
    // Grab the unmatched parts of the string, and add them to the result.
    cur > pre && (res += str.substring(pre, cur).toLowerCase())
    // If `fn` doesn't exist use `generic` with `to` arg as seperator.
    res += fn && fn(a, b) || generic(a, b, to)
  }
  res += str.substring(pre).toLowerCase()  // Grab the leftovers and add to the result.

  return res
}

kase.isUpper = kase.isUpperCase = isUpperCase
kase.isLower = kase.isLowerCase = isLowerCase

export {kase, isUpperCase, isLowerCase}
