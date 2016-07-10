import {Observable} from 'rxjs';
import {test, str2mbl$, mbl2str$, expect} from './testsuite';

export function testTests() {

  test('General Expectation Tests', function() {
    test('expect(value).toBe(value)', function() {
      expect(1).toBe(1);
      expect('a').toBe('a');
      expect(null).toBe(null);
      expect(true).toBe(true);
      expect(1).not.toBe(2);
      expect('a').not.toBe('b');
      expect(null).not.toBe(undefined);
      expect(true).not.toBe(false);
    });

    test('expect(value).toEqual(value)', function() {
      expect(1).toEqual(1);
      expect('a').toEqual('a');
      expect(null).toEqual(null);
      expect(true).toEqual(true);
      expect([1, 2, 3]).toEqual([1, 2, 3]);
      expect(1).not.toEqual(2);
      expect('a').not.toEqual('b');
      expect(null).not.toEqual(100);
      expect(true).not.toEqual(false);
      expect([1, 2, 3]).not.toEqual([9, 2, 3]);
    });

    test('expect(stream).toMarble(string)', function() {
      expect(Observable.from([])).toMarble('-|');
      expect(Observable.from([1])).toMarble('-1|');
      expect(Observable.from([1, 2])).toMarble('-1-2|');
      expect(Observable.from([])).not.toMarble('-0|');
      expect(Observable.from([1])).not.toMarble('-0-1|');
      expect(Observable.from([1, 2])).not.toMarble('-0-1-2|');
    });

    test('expect(stream-of-value).toBeStreamOf(value)', function() {
      expect(Observable.empty()).toBeStreamOf(0);
      expect(Observable.of(0)).toBeStreamOf(0);
      expect(Observable.of(undefined)).toBeStreamOf(undefined);
      expect(Observable.of('here')).toBeStreamOf('here');
      expect(Observable.of(false)).toBeStreamOf(false);
      expect(Observable.of(NaN)).not.toBeStreamOf(NaN);
      expect(Observable.of(undefined)).not.toBeStreamOf(NaN);
      expect(Observable.of('here')).not.toBeStreamOf(NaN);
      expect(Observable.of(false)).not.toBeStreamOf(true);
    });
  });

  test('Stream Utility Functions', function() {
    test('str2mbl$', function () {
      assertStr2mbl([], '-|');
      assertStr2mbl([1], '-1|');
      assertStr2mbl(['1'], '-1|');
      assertStr2mbl([1, 2], '-1-2|');
      assertStr2mbl([1, 2, 3], '-1-2-3|');

      function assertStr2mbl(obs, expected) {
        const obs$ = Observable.from(obs);
        str2mbl$(obs$).subscribe(
          actual => expect(actual).toEqual(expected),
          err => console.error('ERROR: ' + err)
        );
      }
    });

    test('str2mbl$ using Observable.from', function () {
      test('empty', () => assertStr2mbl([], '-|'));
      test('singleton', () => assertStr2mbl([1], '-1|'));
      test('string', () => assertStr2mbl(['1'], '-1|'));
      test('doubleton', () => assertStr2mbl([1, 2], '-1-2|'));
      test('tripleton', () => assertStr2mbl([1, 2, 3], '-1-2-3|'));

      function assertStr2mbl(obs, expected) {
        const obs$ = Observable.from(obs);
        str2mbl$(obs$).subscribe(
          actual => expect(actual).toEqual(expected),
          err => console.error('ERROR: ' + err)
        );
      }
    });

    test('str2mbl$ using mbl2str$', function() {
      test('empty', () => assertStr2mbl('', '-|'));
      test('singleton', () => assertStr2mbl('1', '-1|'));
      test('doubleton', () => assertStr2mbl('1-2', '-1-2|'));
      test('multiple hyphens', () => assertStr2mbl('1----2', '-1-2|'));
      test('leading " |-"', () => assertStr2mbl('--  || ----1', '-1|'));
      test('trailing " |-"', () => assertStr2mbl('1--  |', '-1|'));
      function assertStr2mbl(str, expected) {
        str2mbl$(mbl2str$(str)).subscribe(
          actual => expect(actual).toEqual(expected)
        );
      }
    });
  });
};
