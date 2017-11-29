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
    match.groups = match.slice(1),
    match.index = match.index != null ? match.index : index
    match.input = match.input != null ? match.input : input
    match.labels = {}
    match.value = match[0]

  for (let i = 0, k, v, len = labels.length; k = labels[i], v = match.groups[i], i < len; i++) {
    if (k == null || v == null) continue
    match.labels[k] = v
  }
  // print(match, labels)
  return match
}

// var g = []
// print(reParse(str, g))

class Regi extends RegExp {
  constructor(srcPattern, flags) {
    var [regPattern, labels] = reParse(srcPattern)
    super(regPattern, flags)

    Object.defineProperty(this, 'source', {value: srcPattern, writable: false})
    Object.defineProperty(this, '_labels', {value: labels, writable: false})
    Object.defineProperty(this, '_exec', {value: super.exec, writable: false})
  }

  iterator(str) {
    var re = this, tmpIndex = 0
    return {
      index: 0,
      next() {
        [tmpIndex, re.lastIndex] = [re.lastIndex, this.index]
        let m = re._exec(str)

        if (m == null) return {done: true}
        if (re.lastIndex === m.index) { ++re.lastIndex }

        [re.lastIndex, this.index] = [tmpIndex, re.lastIndex]
        return {done: false, value: matchMaker(re._labels, m)}
      }
    }
  }

  exec(str) {
    var re = this
    re._it = re.lastIndex === 0 ? re.iterator(str) : re._it

    let res = re._it.next()
    re.lastIndex = re._it.index

    if (res.done === true) {
      re.lastIndex = 0
      return null
    }

    return res.value
  }

  replace(str, rep) {
    var re = this
    return str.replace(re, (...m) =>  {
      m = matchMaker(re._labels, m.slice(0, -2), ...m.slice(-2))
      if (typeof rep === 'function') return rep(m)
      return rep
    })
  }
}

var re = new Regi(str, 'g')
var it = re.iterator('aaaa')
// print(it.next(), it.next(), it.next(), it.next())
// print(re.exec('aabcd'), re.exec('aaaa'), re.exec('aaaa'))
print(re.replace('aabcd', 'b'), re.lastIndex)
