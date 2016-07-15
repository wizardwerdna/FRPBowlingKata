import {test, expect, mbl2str$} from '../../testsuite';
import {displayer$} from './displayer';

export function displayerTests() {
  test('empty', testDisplay('-|', ''));
  test('gutter', testDisplay('-0|', '-'));
  test('strike', testDisplay('-10|', ' X'));
  test('other', testDisplay('-1|', '1'));
  test('other', testDisplay('-9|', '9'));
  test('two rolls', testDisplay('-0-9|', '-9'));
  test('spare', testDisplay('-5-5|', '5/'));
  test('tenth frame', function() {
    const preRolls = '-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0';
    const preDisplay = '------------------';
    test('spare', testDisplay(preRolls + '-0-10|', preDisplay + '-/'));
    test('spare/non', testDisplay(preRolls + '-0-10-0|', preDisplay + '-/-'));
    test('spare/strike', testDisplay(preRolls + '-0-10-10|', preDisplay + '-/X'));
    test('strike', testDisplay(preRolls + '-10|', preDisplay + 'X'));
    test('strike/non', testDisplay(preRolls + '-10-0|', preDisplay + 'X-'));
    test('strike/open', testDisplay(preRolls + '-10-0-0|', preDisplay + 'X--'));
    test('strike/spare', testDisplay(preRolls + '-10-0-10|', preDisplay + 'X-/'));
    test('double', testDisplay(preRolls + '-10-10|', preDisplay + 'XX'));
    test('turkey', testDisplay(preRolls + '-10-10-10|', preDisplay + 'XXX'));
  });

  function testDisplay(rolls, expected) {
    return function() {
      const roll$ = mbl2str$(rolls);
      expect(displayer$(roll$)).toBeStreamOf(expected);
    };
  }
}
