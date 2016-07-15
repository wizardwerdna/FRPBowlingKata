import {test} from '../testsuite';
import {scorerTests} from './bowlingLine/scorer.spec';
import {displayerTests} from './bowlingLine/displayer.spec';
import {enablerTests} from './bowlingLine/enabler.spec';

export function mainTests() {
  test('>>> FRP Bowling Kata Scorer', scorerTests, false);
  test('>>> FRP Bowling Kata Displayer', displayerTests, false);
  test('>>> FRP Bowling Kata Enabler', enablerTests, false);
}
