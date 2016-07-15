import {test, expect} from '../../testsuite';
import {enabler} from './enabler';

export function enablerTests() {

  test('empty', testEnable('', [], 10));
  test('gutter', testEnable('-', [0], 10));
  test('other', testEnable('4', [4], 6));
  test('open', testEnable('44', [8], 10));
  test('spare', testEnable('4/', [], 10));
  test('spare/other', testEnable('4/4', [], 6));
  test('tenth frame', function() {
    const preDisplay = '------------------';
    const preScores = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    test('gutter', testEnable(preDisplay + '-', preScores.concat(0), 10));
    test('other', testEnable(preDisplay + '3', preScores.concat(3), 7));
    test('open', testEnable(preDisplay + '34', preScores.concat(7), -1));
    test('partial spare', testEnable(preDisplay + '3/', preScores, 10));
    test('complete spare', testEnable(
      preDisplay + '3/2', preScores.concat(12), -1));
    test('strike', testEnable(preDisplay + 'X', preScores, 10));
    test('strike/gutter', testEnable(preDisplay + 'X-', preScores, 10));
    test('strike/other', testEnable(preDisplay + 'X3', preScores, 7));
    test('strike/open', testEnable(preDisplay + 'X34', preScores.concat(13), -1));
    test('strike/spare', testEnable(preDisplay + 'X3/', preScores.concat(20), -1));
    test('double', testEnable(preDisplay + 'XX', preScores, 10));
    test('double/gutter', testEnable(
      preDisplay + 'XX-', preScores.concat(20), -1));
    test('double/other', testEnable(preDisplay + 'XX3', preScores.concat(23), -1));
    test('turkey', testEnable(preDisplay + 'XXX', preScores.concat(30), -1));
  });

  function testEnable(display, scores, expected) {
    return () => expect(enabler(display, scores)).toBe(expected);
  }
}
