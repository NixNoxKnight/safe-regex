# safe-regex

[![Build Status: master](https://travis-ci.org/davisjam/safe-regex.svg?branch=master)](https://travis-ci.org/davisjam/safe-regex)
[![Build Status: v2](https://travis-ci.org/davisjam/safe-regex.svg?branch=V2)](https://travis-ci.org/davisjam/safe-regex)

This module detects potentially super-linear ("catastrophic") regular expressions.

TODO Expand me.

# Example

TODO Update for any changes to API.

``` js
var safe = require('safe-regex');
var regex = process.argv.slice(2).join(' ');
console.log(safe(regex));
```

```
$ node safe.js '(x+x+)+y'
false
$ node safe.js '(beep|boop)*'
true
$ node safe.js '(a+){10}'
false
$ node safe.js '\blocation\s*:[^:\n]+\b(Oakland|San Francisco)\b'
true
```

# Methods

TODO Update for any changes to API.

``` js
var safe = require('safe-regex')
```

## var ok = safe(re, opts={})

Return a boolean `ok` whether or not the regex `re` is safe and not possibly
catastrophic.

`re` can be a `RegExp` object or just a string.

If the `re` is a string and is an invalid regex, returns `false`.

* `opts.limit` - maximum number of allowed repetitions in the entire regex.
Default: `25`.

# History

This project is forked from [one started by @substack](https://github.com/substack/safe-regex).
@davisjam forked it when it became clear that @substack was no longer maintaining it.

# Related projects

1. The [vuln-regex-detector](https://github.com/davisjam/vuln-regex-detector) project ([npm module](https://www.npmjs.com/package/vuln-regex-detector), [eslint plugin](https://www.npmjs.com/package/eslint-plugin-vuln-regex-detector)) offers slower but more accurate analysis, coupled with dynamic verification.
2. TODO.

# Additional reading

1. [Discussion of heuristics on Reddit](https://www.reddit.com/r/node/comments/8azttj/security_psa_check_your_code_for_vulnerable/dx4hta5/).
2. TODO.

# License

MIT
