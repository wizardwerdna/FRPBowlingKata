import {test} from '../testsuite';
import {scorerTests} from './scorer.spec';
import {displayerTests} from './displayer.spec';
import {enablerTests} from './enabler.spec';

test('>>> FRP Bowling Kata', function() {
  test('>>> FRP Bowling Kata Scorer', scorerTests, false);
  test('>>> FRP Bowling Kata Displayer', displayerTests, false);
  test('>>> FRP Bowling Kata Enabler', enablerTests);
});
