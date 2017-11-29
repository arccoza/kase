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

function matchMaker(src, labels) {
  let match = {
    groups: src.slice(1),
    index: src.index,
    input: src.input,
    labels: {},
    value: src[0],
  }

  for (let i = 0, k, v, len = labels.length; k = labels[i], v = match.groups[i], i < len; i++) {
    if (k == null || v == null) continue
    match.labels[k] = match.groups[i]
  }
  // print(src, labels)
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

  exec(str) {
    var re = this, tmpIndex = 0
    return {
      index: 0,
      next() {
        [tmpIndex, re.lastIndex] = [re.lastIndex, this.index]
        let m = re._exec(str)

        if (m == null) return {done: true}
        if (re.lastIndex === m.index) { ++re.lastIndex }

        [re.lastIndex, this.index] = [tmpIndex, re.lastIndex]
        return {done: false, value: matchMaker(m, re._labels)}
      }
    }
  }
}

var re = new Regi(str)
print(re.exec('aa').next())
