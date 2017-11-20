const test = require('tape')
const print = console.log.bind(console)
const tapDiff = require('tap-diff')
const {kase} = require('../lib/index')


if(!module.parent) {
  test.createStream()
    .pipe(tapDiff())
    .pipe(process.stdout);
}

let fix = {
  camel: 'testCaseTestCase',
  kebab: 'test-case-test-case',
  snake: 'test_case_test_case',
  dot: 'test.case.test.case',
  title: 'Test Case Test Case',
}


test(`test`, function (t) {
  for (let from in fix) {
    for (let to in fix) {
      t.comment(from + ' -> ' + to)
      t.equal(kase(fix[from], from, to), fix[to])
    }
  }

  t.end()
})
