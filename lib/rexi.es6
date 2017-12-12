'use strict'
var print = console.log.bind(console)
var reNamed = /(?:\(\?[:=!])|(?:\(\?<(\S+?)>)|\(/g  // Matches named groups in a regex.
var reReplaceEscapes = '(?:\\${2})+|'  // Matches any `$` with a preceding `$`.
var str = `((?<foo>aa))|(bc)(?<foo>.)`


function reParse(pattern, labels=[], reReplace={}) {
  var hasLabels = false  // Used to indicate if there are named groups in the `pattern`.
  pattern = pattern.replace(reNamed, (m, v, i) => {
    if (v != null) {
      hasLabels = true
      labels.push(v)
      reReplace[`\\$(${v})`] = true
      return '('
    }

    if (pattern[i + 1] !== '?' && pattern[i - 1] !== '\\')
      labels.push(null)

    return m
  })

  reReplace = hasLabels ? new RegExp(reReplaceEscapes + Object.keys(reReplace).join('|'), 'g') : null

  return [pattern, labels, reReplace]
}

function matchMaker(labels, match, index, input) {
  // Faster alg to slice an array than Array.slice native.
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

  return match
}

function repeat(str, count){
  let res = '', n = count
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative")
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str
  return res
}

function Rexi(srcPattern, flags) {
  var [regPattern, labels, reReplace] = reParse(srcPattern)

  Object.defineProperty(this, '_re', {value: new RegExp(regPattern, flags), writable: false})
  Object.defineProperty(this, '_labels', {value: labels, writable: false})
  Object.defineProperty(this, '_pattern', {value: srcPattern, writable: false})
  Object.defineProperty(this, '_replacer', {value: reReplace, writable: false})

  return this
}

Rexi.prototype = Object.create(RegExp.prototype, {
  lastIndex: {get() {return this._re.lastIndex}, set(v) {this._re.lastIndex = v}},
  flags: {get() {return this._re.flags}},
  global: {get() {return this._re.global}},
  ignoreCase: {get() {return this._re.ignoreCase}},
  multiline: {get() {return this._re.multiline}},
  source: {get() {return this._pattern}},
  sticky: {get() {return this._re.sticky}},
  unicode: {get() {return this._re.unicode}},
})

Object.assign(Rexi.prototype, {
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
      return rep.replace(this._replacer, (m) => {
        let len = m.length
        // If the last character of the match is `$`, then we've matched
        // an escape sequence, with `reReplaceEscapes`, and must replace
        // the number of `$`s with half as many.
        if (m[len - 1] === '$')
          return repeat('$', len/2)

        // Otherwise we trim the leading dollar off the match, and look
        // for the associated label, matched earlier, for the replacement.
        let r = mch.labels[m.slice(1)]
        return r == null ? '' : r
      })
    })
  },

  toString() {
    return this.source
  },

  valueOf() {
    return this._re.valueOf()
  },
})

export {Rexi}
