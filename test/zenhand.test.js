const test = require('tape')
const print = console.log.bind(console)
const tapDiff = require('tap-diff')
const {toStyleStr, fromStyleStr, zenhand} = require('../lib/index')


if(!module.parent) {
  test.createStream()
    .pipe(tapDiff())
    .pipe(process.stdout);
}

let fix = {
  style: {
    obj: {
      kebab: {
        position: 'absolute',
        'background-color': '#ff0000',
      },
      camel: {
        position: 'absolute',
        backgroundColor: '#ff0000',
      },
    },
    toStr: {
      kebab: 'position:absolute; background-color:#ff0000;',
      camel: 'position:absolute; backgroundColor:#ff0000;',
    }
  }
}

function Results() {
  let ret = []
  Object.defineProperty(ret, 'last', { get: function(v) { return this[this.length - 1] } })
  return Object.defineProperty(ret, 'more', { set: function(v) { this.push(v) } })
}


test(`toStyleStr should return a string inline CSS style definition, \
when supplied with an object with style properties.`, function (t) {
  t.equal(r = toStyleStr(fix.style.obj.camel), fix.style.toStr.camel)
  t.equal(r = toStyleStr(fix.style.obj.kebab), fix.style.toStr.kebab)
  t.comment(r)

  t.end()
})
