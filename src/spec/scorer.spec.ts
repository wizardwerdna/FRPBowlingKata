import {test, expect, mbl2str$} from '../testsuite';
import {scorer$} from './scorer';
export function scorerTests() {
  test('empty', testScore('-|', '-|'));
  test('gutter', testScore('-0|', '-0|'));
  test('open', testScore('-0-0|', '-0|'));
  test('open', testScore('-0-1|', '-1|'));
  test('open', testScore('-1-1|', '-2|'));
  test('two open', testScore('-0-0-1-1|', '-0-2|'));
  test('two open', testScore('-1-1-2-2|', '-2-6|'));
  test('spare', testScore('-5-5-5|', '-15-20|'));
  test('spare', testScore('-5-5-9|', '-19-28|'));
  test('strike', testScore('-10-1-2|', '-13-16|'));
  test('partial spare', testScore('-5-5|', '-|'));
  test('spare game', testScore(
    '-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5|',
    '-15-30-45-60-75-90-105-120-135-150|'
  ));

  function testScore(rolls, expected) {
    return function () {
      const rolls$ = mbl2str$(rolls);
      expect(scorer$(rolls$)).toMarble(expected);
    };
  }
}
