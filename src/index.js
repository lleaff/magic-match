const splitLast = arr => [ arr.slice(0, arr.length - 1), arr[arr.length - 1] ];

function _match_apply(dest, item, regexpMatches) {
  return typeof dest === 'function' ?
      (regexpMatches !== undefined ?
        dest(item, regexpMatches) :
        dest(item)) :
        dest;
}

export default function match(item, cases) {
  for (const cas of cases) {
    const [ tests, dest ] = splitLast(cas);
    if (tests.length === 0) {
      return _match_apply(dest, item);
    }
    let regexpMatches = null;
    if (tests.some(test => {
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
    })) {
      return _match_apply(dest, item, regexpMatches);
    }
  };
}
