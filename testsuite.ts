import {Observable} from 'rxjs';

export function testSuite () {
  test('should know the truth', function(){
    assertEqual(true, true);
  });
}

const data = {
  run : 0,
  passed : 0,
  failed : 0,
  error :  0,
  nest :  0,
};

export function str2mbl$(stream$: Observable<any>): Observable<string> {
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

export function assertMarble(expected: string, str$: Observable<any>) {
  data.run++;
  str2mbl$(str$).subscribe(
    actual => {
      if (expected === actual) {
        console.info('%cstream has expected marble diagram (%o)',
          'color: green', expected);
        data.passed++;
      } else {
        console.error('stream marble diagram (%o) is NOT as expected (%o)',
          actual, expected);
        data.failed++;
      }
    },
    err => {
      console.error('Error:', err);
      data.error++;
    }
  );
}

export function expect(actual) {
  return {
    toBe: expected => assertIdentical(expected, actual),
    toEqual: expected => assertEqual(expected, actual),
    toMarble: expected => assertMarble(expected, actual)
  };
}

export function assertIdentical(expected, actual) {
  data.run++;
  try {
    if (expected === actual) {
      console.info('%cactual  === expected (%o)', 'color: green', expected);
      data.passed++;
    } else {
      console.error('%o !== expected %o', actual, expected);
      data.failed++;
    }
  } catch (err) {
    console.error('Error:', err);
    data.error++;
  }
}

export function assertEqual(expected, actual) {
  data.run++;
  try {
    if (JSON.stringify(expected) === JSON.stringify(actual)) {
      console.info('%cactual is equal to expected (%o)', 'color: green', expected);
      data.passed++;
    } else {
      console.error('%o is NOT equal to expected %o', actual, expected);
      data.failed++;
    }
  } catch (err) {
    console.error('Error:', err);
    data.error++;
  }
}

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
