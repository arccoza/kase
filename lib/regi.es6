var print = console.log.bind(console)
var reNamed = /(?:\(\?[:=!])|(?:\(\?<(\S+?)>)|\(/g
var str = `((?<foo>aa))|(bc)(?<foo>.)`


function reParse(pattern, labels=[]) {
  return [pattern.replace(reNamed, (m, v, i) => {
    // print(m, v, i)
    if (v != null) {
      labels.push(v)
      return '('
    }

    if (pattern[i + 1] !== '?' && pattern[i - 1] !== '\\')
      labels.push(null)

    return m
  }), labels]
}

function matchMaker(labels, match, index, input) {
  match.groups = new Array(match.length - 1)
  for (let i = 1; i < match.length; match.groups[i - 1] = match[i++]);
  // match.groups = match.slice(1)
  match.index = match.index != null ? match.index : index
  match.input = match.input != null ? match.input : input
  match.labels = {}
  match.value = match[0]

  for (let i = 0, k, v, len = labels.length; k = labels[i], v = match[i+1], i < len; i++) {
    if (k == null || v == null) continue
    match.labels[k] = v
  }
  // print(match, labels)
  return match
}

// var g = []
// print(reParse(str, g))

function Regi(srcPattern, flags) {
  var [regPattern, labels] = reParse(srcPattern)

  Object.defineProperty(this, '_re', {value: new RegExp(regPattern, flags), writable: false})
  Object.defineProperty(this, '_labels', {value: labels, writable: false})
  Object.defineProperty(this, '_pattern', {value: srcPattern, writable: false})

  return this
}

Regi.prototype = Object.create(RegExp.prototype, {
  lastIndex: {get() {return this._re.lastIndex}, set(v) {this._re.lastIndex = v}},
  flags: {get() {return this._re.flags}},
  global: {get() {return this._re.global}},
  ignoreCase: {get() {return this._re.ignoreCase}},
  multiline: {get() {return this._re.multiline}},
  source: {get() {return this._pattern}},
  sticky: {get() {return this._re.sticky}},
  unicode: {get() {return this._re.unicode}},
})

Object.assign(Regi.prototype, {
  iterator(str) {
    var re = this._re, labels = this._labels, tmpIndex = 0
    return {
      index: 0,
      next() {
        [tmpIndex, re.lastIndex] = [re.lastIndex, this.index]
        let m = re.exec(str)

        if (m == null) return {done: true}
        // TODO: Handle stuck indices better, cos simply increasing
        // the index pointer to avoid infinite loops means that
        // an index that is off by 1 is somtimes stored in the iterator.
        if (re.lastIndex === m.index) { ++re.lastIndex }

        [re.lastIndex, this.index] = [tmpIndex, re.lastIndex]
        return {done: false, value: matchMaker(labels, m)}
      }
    }
  },

  exec(str) {
    var re = this._re, labels = this._labels
    var m = re.exec(str)
    if (m == null) return m
    if (re.lastIndex === m.index) { ++re.lastIndex }
    return matchMaker(labels, m)
  },

  replace(str, rep) {
    var re = this._re, labels = this._labels
    return str.replace(re, (...m) =>  {
      var len = m.length, idx = m[len - 2], inp = m[len - 1], mch
      m.length = len - 2
      mch = matchMaker(labels, m, idx, inp)
      if (typeof rep === 'function') return rep(mch)
      // TODO: parse `rep` string for named groups, via `${name}`.
      return rep
    })
  },
})

export {Regi}

// var re = new Regi(str, 'g')
// print(re.iterator)
// var it = re.iterator('aabcd')
// print(it.next(), it.index, it.next(), it.index, it.next(), it.index, it.next())
// print(re.exec('aabcd'), re.lastIndex, re.exec('aabcd'), re.lastIndex, re.exec('aabcd'), re.lastIndex)
// print(re.replace('aabcd', 'b'), re.lastIndex)
// print('aabcd'.replace(re, 'b'))
// print('12aabcd'.match(re))
