import {test} from '../testsuite';
import {bowlingLineTests} from './bowlingLine/index.spec';
import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';
import {main} from './main';
import {mainTests} from './main.spec';
require('./styles.css');

test('FRP Bowling Kata', function() {
  test('FRP Bowling Kata Application Mainline', mainTests);
  test('FRP Bowling Kata BowlingLine Component', bowlingLineTests);
});

run(main, {DOM: makeDOMDriver('#app')});
