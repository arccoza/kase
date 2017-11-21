var {kase} = require('./lib/index')
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


var total = 0
for (let from in fix) {
  var start = process.hrtime()
  for (var i = 0; i < 10000; i++) {
    for (let to in fix) {
      kase(fix[from], from, to)
    }
  }
  var end = process.hrtime(start)
  // total += end
  print(from)
  print(end)
}

print(total)
