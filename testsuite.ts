import {Observable} from 'rxjs';

// test driver global state shared among all tests
export const initTestData = {
  run : 0,
  passed : 0,
  failed : 0,
  error :  0,
  nest :  0,
};
export let data = initTestData;

export function test(testName, tests, isOpen = true) {
  data.nest++;
  if (isOpen) {
    console.group(testName);
  } else {
    console.groupCollapsed(testName);
  }
  try {
    tests();
  } catch (err) {
    console.error('Error Runing Test:', err);
    data.error++;
  }
  console.groupEnd();
  data.nest--;
  if (data.nest === 0) {
    console.log('%cReport: %d run; %d passed; %d failed; %d errors',
      (data.run === data.passed ? 'color: green' : 'color: red'),
      data.run, data.passed, data.failed, data.error);
  }
}

export function expect(actual) {
  return {
    toBe: expected => assertIdentical(expected, actual),
    toEqual: expected => assertEqual(expected, actual),
    toMarble: expected => assertMarble(expected, actual),
    toBeStreamOf: expected => assertStreamOf(expected, actual),
    not: {
      toBe: expected => assertIdentical(expected, actual, true),
      toEqual: expected => assertEqual(expected, actual, true),
      toMarble: expected => assertMarble(expected, actual, true),
      toBeStreamOf: expected => assertStreamOf(expected, actual, true),
    }
  };
}

function markPass1(message, string1, negated) {
  if (negated) {
    console.error(message, 'color: red', string1);
    data.failed++;
  } else {
    console.info(message, 'color: green', string1);
    data.passed++;
  }
};

function markPass2(message, string1, string2,  negated) {
  if (negated) {
    console.error(message, 'color: red', string1, string2);
    data.failed++;
  } else {
    console.info(message, 'color: green', string1, string2);
    data.passed++;
  }
}

export function assertIdentical(expected, actual, negated = false) {
  data.run++;
  try {
    if (expected === actual) {
      markPass1('%cactual is equal to expected "%o"', expected, negated);
    } else {
      markPass2('%c%o is NOT equal to expected "%o"', actual, expected, !negated);
    }
  } catch (err) {
    console.error('Error:', err);
    data.error++;
  }
}

export function assertEqual(expected, actual, negated = false) {
  data.run++;
  try {
    if (JSON.stringify(expected) === JSON.stringify(actual)) {
      markPass1('%cactual is equal to expected "%o"', actual, negated);
    } else {
      markPass2('%c%o is NOT equal to expected "%o"', actual, expected, !negated);
    }
  } catch (err) {
    console.error('Error:', err);
    data.error++;
  }
}

export function assertMarble(
  expected: string, str$: Observable<any>, negated = false
) {
  data.run++;
  str2mbl$(str$).subscribe(
    actual => {
      if (expected === actual) {
        markPass1('%cstream has expected marble diagram %o', expected, negated);
      } else {
        markPass2('%cstream marble diagram %o is NOT the expected %o',
          actual, expected, !negated);
      }
    },
    err => {
      console.error('Error:', err);
      data.error++;
    }
  );
}

export function assertStreamOf(
  expected, stream$: Observable<any>, negated = false
) {
  if (!stream$) { throw('stream is not defined'); };
  if (typeof stream$.subscribe !== 'function') {
    throw('%s is not a stream', typeof stream$);
  }
  stream$.subscribe(
    actual => {
      data.run++;
      if (expected === actual) {
        markPass1('%cstream contains expected value %o', expected, negated);
      } else {
        markPass2('%cstream contained %o, NOT the expected value %o',
         actual, expected, !negated);
      }
    },
    err => {
      data.run++;
      console.error('Error:', err);
      data.error++;
    }
  );
}

export function str2mbl$(stream$: Observable<any>): Observable<string> {
  if (!stream$) { throw('Undefined is not a stream'); };
  if (typeof stream$.subscribe !== 'function') {
    throw(stream$, 'is not a stream');
  }
  return stream$
    .defaultIfEmpty('')
    .reduce((acc, item) => acc  + '-' + item.toString())
    .map(mbl => '-' + mbl + '|');
}

export function mbl2str$(mbl: string): Observable<any> {
  return Observable.from(
    mbl
      .replace(/--+/g, '-')
      .replace(/[ |]/g, '')
      .replace(/^[ |-]+/, '')
      .replace(/[ |-]+$/, '')
      .split('-')
      .filter(each => each !== '')
      .map(each => isNaN(parseInt(each)) ? each : parseInt(each))
  );
}
