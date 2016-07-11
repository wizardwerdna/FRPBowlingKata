import {run} from '@cycle/rxjs-run';
import {makeDOMDriver} from '@cycle/dom';

import {test} from '../testsuite';

import {main} from './main';
import {mainTests} from './main.spec';

test('>>> FRP Bowling Kata Tests', mainTests, false);
run(main, {DOM: makeDOMDriver('#app')});

