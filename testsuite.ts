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
      .map(each => isNaN(parseInt(each)) ? each : parseInt(each))
  );
}

export function assertMarble(expected: string, str$: Observable<any>) {
  str2mbl$(str$).subscribe(
    actual => assertEqual(expected, actual)
  );
}

export function assertEqual(expected, value) {
  data.run++;
  try {
    if (JSON.stringify(expected) === JSON.stringify(value)) {
      console.info('%cexpected value %o was returned', 'color: green', expected);
      data.passed++;
    } else {
      console.error('expected %o, but got %o', expected, value);
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
  tests();
  console.groupEnd();
  data.nest--;
  if (data.nest === 0) {
    console.log('%cReport: %d run; %d passed; %d failed; %d errors',
      (data.run === data.passed ? 'color: green' : 'color: red'),
      data.run, data.passed, data.failed, data.error);
  }
}
