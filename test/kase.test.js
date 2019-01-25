const test = require('tape')
const print = console.log.bind(console)
const tapDiff = require('tap-diff')
const {kase, isUpperCase, isLowerCase} = require('../lib/index')


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
  space: 'test case test case',
  path: 'test/case/test/case',
  title: 'Test Case Test Case',
  pascal: 'TestCaseTestCase',
  header: 'Test-Case-Test-Case'
}


test(`kase fn should be able to convert between every combination \
of cases repeatedly, without introducing artifacts.`, function (t) {
  for (let from in fix) {
    for (let to in fix) {
      t.comment(from + ' -> ' + to)
      t.equal(kase(fix[from], from, to), fix[to])
    }
  }

  t.end()
})

test(`isUpperCase should return true if all chars are uppercase, \
false if even one char is lowercase.`, function (t) {
  t.ok(isUpperCase('TEST CASE'))
  t.notOk(isUpperCase('TEST CaSE'))
  t.notOk(isUpperCase('test case'))
  t.ok(kase.isUpperCase('TEST CASE'))
  t.notOk(kase.isUpperCase('TEST CaSE'))
  t.notOk(kase.isUpperCase('test case'))
  t.ok(kase.isUpper('TEST CASE'))
  t.notOk(kase.isUpper('TEST CaSE'))
  t.notOk(kase.isUpper('test case'))

  t.end()
})

test(`isLowerCase should return true if all chars are lowercase, \
false if even one char is uppercase.`, function (t) {
  t.ok(isLowerCase('test case'))
  t.notOk(isLowerCase('test cAse'))
  t.notOk(isLowerCase('TEST CASE'))
  t.ok(kase.isLowerCase('test case'))
  t.notOk(kase.isLowerCase('test cAse'))
  t.notOk(kase.isLowerCase('TEST CASE'))
  t.ok(kase.isLower('test case'))
  t.notOk(kase.isLower('test cAse'))
  t.notOk(kase.isLower('TEST CASE'))

  t.end()
})
