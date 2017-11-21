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

## Example

### Input

```js
var {kase} = require('kase')
// import {kase} from 'kase'  // If you're using es modules.

var str = 'testCase'
str = kase(str, 'camel', 'kebab')
```

### Output

```js
'test-case'
```
