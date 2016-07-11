import {test} from '../testsuite';
import {scorerTests} from './scorer.spec';
import {displayerTests} from './displayer.spec';
import {enablerTests} from './enabler.spec';
export function mainTests() {
  test('>>> FRP Bowling Kata Scorer', scorerTests, false);
  test('>>> FRP Bowling Kata Displayer', displayerTests, false);
  test('>>> FRP Bowling Kata Enabler', enablerTests, false);
}
