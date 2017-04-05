const splitLast = arr => [ arr.slice(0, arr.length - 1), arr[arr.length - 1] ];

/**
 * @param {(item, test, regexpMatches)=>*|*} dest
 */
function _match_apply(dest, ...args) {
  return typeof dest === 'function' ?
        dest(...args) :
        dest;
}

export default function match(item, cases) {
  for (const cas of cases) {
    const [ tests, dest ] = splitLast(cas);
    if (tests.length === 0) {
      return _match_apply(dest, item);
    }
    let regexpMatches = null;
    const successfulTestI = tests.findIndex(test => {
      switch(typeof test) {
        case 'function':
          return test(item);
        case 'object':
          if (typeof test.exec === 'function') {
            regexpMatches = test.exec(item);
            return !!regexpMatches;
          }
          if (typeof test.test === 'function') {
            return test.test(item);
          }
        default:
          return test === item;
      }
    });
    if (successfulTestI >= 0) {
      return _match_apply(dest, item, tests[successfulTestI], regexpMatches);
    }
  };
}
