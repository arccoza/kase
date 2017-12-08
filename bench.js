var {kase} = require('./lib/index')
var {Rexi} = require('./lib/rexi')
var print = console.log.bind(console)


let fix = {
  camel: 'testCaseTestCase',
  kebab: 'test-case-test-case',
  snake: 'test_case_test_case',
  dot: 'test.case.test.case',
  space: 'test case test case',
  path: 'test/case/test/case',
  title: 'Test Case Test Case',
  pascal: 'TestCaseTestCase',
  header: 'Test-Case-Test-Case'
}


// for (let from in fix) {
//   console.time('kase')
//   for (var i = 0; i < 10000; i++) {
//     for (let to in fix) {
//       kase(fix[from], 'any', to)
//     }
//   }
//   console.timeEnd('kase')
// }

// console.time('kase')
// for (var i = 0; i < 100000; i++) {
//   kase('tCTTTe', 'any', 'kebab')
// }
// console.timeEnd('kase')

print(kase('@@@-----CTTTeTmpppLateYYYYYY_YYYYi8_8', 'camel', 'kebab'))
print(kase('@@@-----CTt-te-tmppp-late-yYYYYY_YYy-yi8-8', 'kebab', 'title'))
print(kase('@@@-----CTt Te Tmppp Late YYYYYY_YYy Yi8 8', 'title', 'pascal'))
print(kase('@@@-----CTtTeTmpppLateYYYYYY_YYyYi8_8', 'pascal', 'header'))

// print(kase('-', 'any', 'camel'))

// var reStr = `((?<foo>aa))|(bc)(?<foo>.)`
// var re = new Rexi(reStr, 'g')
// var re2 = new RegExp(`((aa))|(bc)(.)`, 'g')
// // var it = re.iterator('aaaa')
// // print(it.next(), it.next(), it.next(), it.next())
// // print(re.exec('aabcd'), re.exec('aaaa'), re.exec('aaaa'))
// // print(re.replace('aabcd', 'b'), re.lastIndex)
// console.time('Rexi')
// var start = process.hrtime()
// for (var i = 0; i < 100000; i++) {
//   var res = re.exec('aabcd')
//   // var res = 'aabcd'.replace(re, 'b')
// }
// print(res)
// var end = process.hrtime(start)
// console.timeEnd('Rexi')
// print(end)
