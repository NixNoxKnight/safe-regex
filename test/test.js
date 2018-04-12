/* eslint-env node, mocha */

const safeRegex = require('..');
const assert = require('assert');

/* Helpers. */
function shouldBeSafe (re) {
	assert(safeRegex.isSafe(re), `Error, re ${re.source} should be safe`);
	assert(safeRegex.isSafe(re.source), `Error, string ${re.source} should be safe`);
}

function shouldNotBeSafe (re) {
	assert(!safeRegex.isSafe(re), `Error, re ${re.source} should not be safe`);
	assert(!safeRegex.isSafe(re.source), `Error, string ${re.source} should not be safe`);
}

describe('safe-regex', () => {
	/* API: isSafe */
	describe('isSafe', () => {
		describe('star height', () => {
			describe('catches star height > 1', () => {
				it('handles ++', () => {
					shouldNotBeSafe(/(a+)+/);
				});

				it('handles nested group', () => {
					shouldNotBeSafe(/(a*|b)+$/);
					shouldNotBeSafe(/((a*)|b)+$/);
					shouldNotBeSafe(/((((a*))|b))+$/);
				});
			});
			// TODO +* *+ ** {}+ +{} {}* *{}

			describe('ignores star height <= 1', () => {
				it('is OK with star height 0', () => {
					shouldBeSafe(/a/);
					shouldBeSafe(/[a]/);
					shouldBeSafe(/(a)/);
					shouldBeSafe(/(a|a)/);
				});

				it('does not think ? increases star height', () => {
					shouldBeSafe(/a?/);
					shouldBeSafe(/(a?)?/);
					shouldBeSafe(/((a?))?/);
					shouldBeSafe(/(((a?)))?/);
				});
				// TODO Star height 1: * + *? +? ?* ?+
			});
		});
	});

	/* API: isSafeAndExplain */
	describe('isSafeAndExplain', () => {
		it('explains star height > 1', () => {
			// TODO
		});
	});
});

/*
var good = [
	/\bOakland\b/,
	/\b(Oakland|San Francisco)\b/i,
	/^\d+1337\d+$/i,
	/^\d+(1337|404)\d+$/i,
	/^\d+(1337|404)*\d+$/i,
	RegExp(Array(26).join('a?') + Array(26).join('a'))
];

test('safe regex', function (t) {
	t.plan(good.length);
	good.forEach(function (re) {
		t.equal(safe(re), true);
	});
});

var bad = [
	/^(a?){25}(a){25}$/,
	RegExp(Array(27).join('a?') + Array(27).join('a')),
	/(x+x+)+y/,
	/foo|(x+x+)+y/,
	/(a+){10}y/,
	/(a+){2}y/,
	/(.*){1,32000}[bc]/,
	/(a*|b)+$/
];

test('unsafe regex', function (t) {
	t.plan(bad.length);
	bad.forEach(function (re) {
		t.equal(safe(re), false);
	});
});

var invalid = [
	'*Oakland*',
	'hey(yoo))',
	'abcde(?>hellow)',
	'[abc'
];

test('invalid regex', function (t) {
	t.plan(invalid.length);
	invalid.forEach(function (re) {
		t.equal(safe(re), false);
	});
});
*/
