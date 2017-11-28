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
  constructor(pattern, flags) {
    var [pattern, groups] = reParse(pattern)
    super(pattern, flags)
    this._exec = this.exec
  }

  exec(str) {
    for (let m; m = re._exec(str);) {
      print(m)
    }
  }
}

new Regi(str)
