[travis]:       https://travis-ci.org/arccoza/kase
[travis-img]:   https://img.shields.io/travis/arccoza/kase.svg

# kase [![Travis Build Status][travis-img]][travis]
kase is a simple function for converting between common cases used in code.

Supporting:

* camelCase
* kebab-case
* snake_case
* dot.case
* space case
* path/case
* Title Case
* PascalCase
* Header-Case

or any custom seperator string you choose (eg. '@').

## Example

### Input

```js
var {kase} = require('kase')
// import {kase} from 'kase'  // If you're using es modules.

var str = 'testCase'
str = kase(str, 'camel', 'kebab')
console.log(str)
// or
str = 'testCase'
str = kase(str, 'snake')
console.log(str)
// or custom seperator
str = 'testCase'
str = kase(str, '@')
console.log(str)
```

### Output

```js
'test-case'
'test_case'
'test@case'
```

## API

### kase(str, from, to)

Convert `str` from `from` case style to `to` case style, return the modified `str`.

* `str` - the string to convert.
* `from` - the case to convert from, will only match seperators in this specific style, can be:
  * **any** - for any non-word or camel style seperator, a good general match, only use the others if you want to specifically match that style.
  * **camel** - for camelCase.
  * **kebab** - for kebab-case.
  * **snake** - for snake_case.
  * **dot** - for dot.case.
  * **space** - for space case.
  * **path** - for path/case.
  * **title** - for Title Case.
  * **pascal** - for PascalCase.
  * **header** - for Header-Case.
* `to` - the case to convert to, can be:
  * **camel** - for camelCase.
  * **kebab** - for kebab-case.
  * **snake** - for snake_case.
  * **dot** - for dot.case.
  * **space** - for space case.
  * **path** - for path/case.
  * **title** - for Title Case.
  * **pascal** - for PascalCase.
  * **header** - for Header-Case.
  * or any custom seperator string you'd like, eg. `'@'`.

### kase(str, to)

Convert `str` to `to` case style, `from` is automatically set to `any`, return the modified `str`.

### kase.isUpper(str) / kase.isUpperCase(str) / isUpperCase(str)

Return `true` if all characters in `str` are uppercase, `false` otherwise.

### kase.isLower(str) / kase.isLowerCase(str) / isLowerCase(str)

Return `true` if all characters in `str` are lowercase, `false` otherwise.
