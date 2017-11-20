var {kase} = require('./lib/index')
var print = console.log.bind(console)


var src = {
  camel: 'whatWhat',
  kebab: 'what-what',
  snake: 'what_what',
}

var start = process.hrtime()
for (var i = 0; i < 100000; i++)
  var str = kase(src.camel)
print(process.hrtime(start))

print(str)
