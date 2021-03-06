var parse = require('ret');
var types = parse.types;

module.exports = function (re, opts) {
    if (!opts) opts = {};
    var replimit = opts.limit === undefined ? 25 : opts.limit;
    
    if (isRegExp(re)) re = re.source;
    else if (typeof re !== 'string') re = String(re);
    
    try { re = parse(re) }
    catch (err) { return false }
    
    var reps = 0;
    return (function walk (node, starHeight) {
        if (node.type === types.REPETITION) {
            starHeight ++;
            reps ++;
            if (starHeight > 1) return false;
            if (reps > replimit) return false;
        }
        
        var options = node.options || (node.value && node.value.options) || [];
        for (var i = 0, len = options.length; i < len; i++) {
            var ok = walk({ stack: options[i] }, starHeight);
            if (!ok) return false;
        }

        var stack = node.stack || (node.value && node.value.stack) || [];
        for (var i = 0; i < stack.length; i++) {
            var ok = walk(stack[i], starHeight);
            if (!ok) return false;
        }

				/* Walk any values for safety. Undocumented but it seems REPETITION can have one, see ret #9. */
				if (node.value && typeof(node.value) === 'object') {
					var ok = walk(node.value);	
					if (!ok) return false;
				}	
        
        return true;
    })(re, 0);
};

function isRegExp (x) {
    return {}.toString.call(x) === '[object RegExp]';
}
