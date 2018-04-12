'use strict';

/**********
 * Dependencies.
 **********/

const regexpTree = require('regexp-tree');

/**********
 * Globals.
 **********/

/* Logging. */
const LOGGING = false;

/**********
 * isSafe
 **********/

const IS_SAFE_POLICY = {
	starHeight: {
		maxSafeStarHeight: 1, // (a+) safe, (a+)+ not
		maxSafeRepetitionUpperLimit: 10, // a{0,3} safe, a{0,50} not
		countQuestionMarks: false // (a+)? is safe
	}
};

/* TODO Document. */
function isSafeAndExplain (regex, options) {
	let transpiledRegex = createRegExp(regex); // TODO Might throw, document this.

	let safe = true;
	let explanation = {};

	const starHeight = countStarHeight(transpiledRegex, options);
	if (IS_SAFE_POLICY.starHeight.maxSafeStarHeight < starHeight) {
		explanation.starHeight = `Fails star height test: maxSafeStarHeight ${IS_SAFE_POLICY.starHeight.maxSafeStarHeight} < starHeight ${starHeight}`;
		safe = false;
	} else {
		explanation.starHeight = 'Safe';
	}

	const resultWithExplanation = {
		safe: safe,
		explanation: explanation
	};
	log(`isSafeAndExplain: got ${JSON.stringify(resultWithExplanation, null, 2)}`);
	return resultWithExplanation;
}

/* TODO Document. */
function isSafe (regex, options) {
	const resultWithExplanation = isSafeAndExplain(regex, options);
	return resultWithExplanation.safe;
}

/**********
 * Helpers.
 **********/

/**
 * @param regex: String representation 'abc' or RegExp object /abc/
 * @return A JS RegExp transpiled by regexpTree, or throws.
 */
function createRegExp (regex) {
	let pattern = regex.source || regex;

	let reOrPattern;
	try {
		reOrPattern = new RegExp(pattern);
	} catch (e) {
		/* Set reOrPattern to pattern, escaping every un-escaped / character. */

		let escapedPatternChars = []; // The pattern chars, with escapes added as needed.
		let isEscaped = false;
		for (let i = 0; i < pattern.length; i++) {
			if (isEscaped) {
				escapedPatternChars.push(pattern[i]);
				isEscaped = false;
				continue;
			}

			if (pattern[i] === '\\') {
				escapedPatternChars.push(pattern[i]);
				isEscaped = true;
				continue;
			}

			if (pattern[i] === '/') {
				escapedPatternChars.push('\\');
				escapedPatternChars.push('/');
			} else {
				escapedPatternChars.push(pattern[i]);
			}
		}

		reOrPattern = `/${escapedPatternChars.join('')}/`;
	}

	// Transpile Python-esque syntax (named groups, etc.?) to JS-friendly.
	let transpiledRE;
	try {
		transpiledRE = regexpTree.compatTranspile(reOrPattern).toRegExp();
	} catch (e) {
		throw e;
	}

	return transpiledRE;
}

/**
 * TODO Update, esp. options.
 * @param regex: String representation 'abc' or RegExp object /abc/
 * @param options: optional -- clarify what counts as 'star height'
 *	Keys:
 *		countQuestionMarks -- (a+)? is not really a problem
 *			default false (i.e. ignore ?'s)
 *		minimumRepetitionUpperLimit -- a{0,3} is probably OK, a{0,50} is not.
 *			default 0 (i.e. all of {x}, {x,}, {,x}, {x,y} are problematic)
 *
 * @return The regex's star height: an integer >= 0.
 */
function countStarHeight (regex, options) {
	/* TODO Confirm that this accepts both 'abc' and /abc/.

	/* Get an ast. */
	const ast = regexpTree.parse(regex);

	/* Options. */
	const defaultCountQuestionMarks = false;
	const defaultMinimumRepetitionUpperLimit = 0;
	if (!options) {
		options = {};
	}
	// Apply defaults.
	if (!options.countQuestionMarks) {
		options.countQuestionMarks = defaultCountQuestionMarks;
	}
	if (!options.minimumRepetitionUpperLimit) {
		options.minimumRepetitionUpperLimit = defaultMinimumRepetitionUpperLimit;
	}

	/* Here we go! */

	let currentStarHeight = 0;
	let maxObservedStarHeight = 0;

	/* TODO Duplicated code in pre and post. */
	regexpTree.traverse(ast, {
		'Repetition': {
			pre ({node}) {
				// Optional things to ignore
				if (node.quantifier && node.quantifier.kind === '?' && !options.countQuestionMarks) {
					return;
				} else if (node.quantifier.kind === 'Range' &&
					(!('to' in node.quantifier) || node.quantifier.to < options.minimumRepetitionUpperLimit)) {
					return;
				}

				currentStarHeight++;
				if (maxObservedStarHeight < currentStarHeight) {
					maxObservedStarHeight = currentStarHeight;
				}
			},

			post ({node}) {
				if (node.quantifier && node.quantifier.kind === '?' && !options.countQuestionMarks) {
					return;
				} else if (node.quantifier.kind === 'Range' &&
					(!('to' in node.quantifier) || node.quantifier.to < options.minimumRepetitionUpperLimit)) {
					return;
				}

				currentStarHeight--;
			}
		}
	});

	return maxObservedStarHeight;
}

/**********
 * Utilities.
 **********/

function log (msg) {
	if (LOGGING) {
		console.error(msg);
	}
}

/**********
 * Exports.
 **********/

module.exports = {
	isSafe: isSafe,
	isSafeAndExplain: isSafeAndExplain
};
