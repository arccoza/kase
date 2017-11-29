var print = console.log.bind(console)
var reNamed = /(?:\(\?[:=!])|(?:\(\?<(\S+?)>)|\(/g
var str = `((?<foo>aa))|(bc)(?<foo>.)`


function reParse(pattern, groups=[]) {
  return [pattern.replace(reNamed, (m, v, i) => {
    // print(m, v, i)
    if (v != null) {
      groups.push(v)
      return '('
    }

    if (pattern[i + 1] !== '?' && pattern[i - 1] !== '\\')
      groups.push(null)

    return m
  }), groups]
}

// var g = []
// print(reParse(str, g))

class Regi extends RegExp {
  constructor(srcPattern, flags) {
    var [regPattern, groups] = reParse(srcPattern)
    super(regPattern, flags)

    Object.defineProperty(this, 'source', {value: srcPattern, writable: false})
    Object.defineProperty(this, '_named', {value: groups, writable: false})
    Object.defineProperty(this, '_exec', {value: super.exec, writable: false})
  }

  exec(str) {
    var re = this
    return {
      index: 0,
      next() {
        let tmpIndex = re.lastIndex
        re.lastIndex = this.index
        let m = re._exec(str)
        print(m)
        if (m == null) return {done: true}
        if (re.lastIndex === m.index) ++re.lastIndex
        this.index = re.lastIndex
        re.lastIndex = tmpIndex
        return {done: false, value: m}
      }
    }
  }
}

var re = new Regi(str)
print(re.exec('aa').next())
