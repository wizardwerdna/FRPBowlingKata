import {Observable} from 'rxjs';
import {test, assertEqual, str2mbl$, mbl2str$, assertMarble} from './testsuite';

export function testTests() {
  test('str2mbl$', function () {
    test('empty', () => assertObs2str([], '-|'));
    test('empty', () => assertObs2str([1], '-1|'));
    test('empty', () => assertObs2str(['1'], '-1|'));
    test('empty', () => assertObs2str([1, 2], '-1-2|'));
    test('empty', () => assertObs2str([1, 2, 3], '-1-2-3|'));

    function assertObs2str(obs, expected) {
      const obs$ = Observable.from(obs);
      str2mbl$(obs$).subscribe(
        actual => assertEqual(expected, actual),
        err => console.error('ERROR: ' + err)
      );
    }
  });

  test('str2obs', function() {
    test('empty', () => assertStr2Obs('', '-|'));
    test('singleton', () => assertStr2Obs('1', '-1|'));
    test('doubleton', () => assertStr2Obs('1-2', '-1-2|'));
    test('multiple hyphens', () => assertStr2Obs('1----2', '-1-2|'));
    test('leading " |-"', () => assertStr2Obs('--  || ----1', '-1|'));
    test('trailing " |-"', () => assertStr2Obs('1--  |', '-1|'));
    function assertStr2Obs(str, expected) {
      str2mbl$(mbl2str$(str)).subscribe(
        actual => assertEqual(expected, actual)
      );
    }
  });

  test('assertMarble', function() {
    test('empty', () => assertMarble('-|', Observable.from([])));
    test('singleton', () => assertMarble('-1|', Observable.from([1])));
    test('doubleton', () => assertMarble('-1-2|', Observable.from([1, 2])));
  });
}
