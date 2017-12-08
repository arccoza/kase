var print = console.log.bind(console)
var {Rexi} = require('./rexi')


let up = x => x.toUpperCase()
let lo = x => x.toLowerCase()
let no = x => x
let isUpperCase = str => !(/[a-z]/g).test(str)
let isLowerCase = str => !(/[A-Z]/g).test(str)
let isAnyDig = str => (/\d/g).test(str)
let reParts = {
  nonWord: `[^a-zA-Z0-9]`,
  camel() {return `((?<a>[a-z])(?<b>[A-Z])|(?<a>[A-Z])(?<b>[A-Z])(?=[a-z]))`},
  start(sep, b='.') {return `(^${sep || this.nonWord}*(?<b>${b}))`},
  split(sep, a='.', b='.') {return `((?<a>${a}?)${sep || this.nonWord}+(?<b>${b}))`},
  digit(sep) {return `((?<a>\\d?)${sep || this.nonWord}+(?<b>\\d))`},
}

var cases = {
  // any: [new Rexi(`((?<a>[a-z])(?<b>[A-Z])|(?<a>[A-Z])(?<b>[A-Z])(?=[a-z]))|(^[^a-zA-Z0-9]*(?<b>.))|((?<a>.?)[^a-zA-Z0-9]+(?<b>.?))`, 'g')],
  any: [new Rexi(reParts.camel() + '|' + reParts.start() + '|' + reParts.split(),'g')],
  camel: [new Rexi(reParts.camel() + '|' + reParts.start('_') + '|' + reParts.digit('_'),'g'),
    (a, b) => a != null ? lo(a) + (isAnyDig(a + b) ? '_' : '') + up(b) : lo(b)],
  kebab: [new Rexi(reParts.start('-') + '|' + reParts.split('-'),'g'),
    (a, b) => a != null ? lo(a) + '-' + lo(b) : lo(b)],
  snake: [new Rexi(reParts.start('_') + '|' + reParts.split('_'),'g'),
    (a, b) => a != null ? lo(a) + '_' + lo(b) : lo(b)],
  dot: [new Rexi(reParts.start('\\.') + '|' + reParts.split('\\.'),'g'),
    (a, b) => a != null ? lo(a) + '.' + lo(b) : lo(b)],
  space: [new Rexi(reParts.start(' ') + '|' + reParts.split(' '),'g'),
    (a, b) => a != null ? lo(a) + ' ' + lo(b) : lo(b)],
  path: [new Rexi(reParts.start('/') + '|' + reParts.split('/'),'g'),
    (a, b) => a != null ? lo(a) + '/' + lo(b) : lo(b)],
  title: [new Rexi(reParts.start(' ', '[A-Z]') + '|' + reParts.split(' ', '[a-z]', '[A-Z]') + '|' + reParts.digit(' '),'g'),
    (a, b) => a != null ? lo(a) + ' ' + up(b) : up(b)],
  pascal: [new Rexi(reParts.camel() + '|' + reParts.start('_', '[A-Z]') + '|' + reParts.digit('_'),'g'),
    (a, b) => a != null ? lo(a) + (isAnyDig(a + b) ? '_' : '') + up(b) : up(b)],
  header: [new Rexi(reParts.start('-', '[A-Z]') + '|' + reParts.split('-', '[a-z]', '[A-Z]') + '|' + reParts.digit('-'),'g'),
    (a, b) => a != null ? lo(a) + '-' + up(b) : up(b)],
}

function kase(str, from, to) {
  if (from === to) return str  // Short circuit if no conversion.
  var re = cases[from][0], fn = cases[to][1]
  print(re.source)

  return re.replace(str, ({labels: {a, b}}) => fn(a, b))
  // return re.replace(str, '$a-$b')
}

kase.isUpper = kase.isUpperCase = isUpperCase
kase.isLower = kase.isLowerCase = isLowerCase

export {kase, isUpperCase, isLowerCase}
