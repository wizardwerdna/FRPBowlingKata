import {test} from '../testsuite';
import {scorerTests} from './scorer.spec';
import {displayerTests} from './displayer.spec';
import {enablerTests} from './enabler.spec';

import {run} from '@cycle/rxjs-run';
import {hr, button, img, span, h1, h3, div, makeDOMDriver} from '@cycle/dom';
import {Observable} from 'rxjs';
import {displayer$} from './displayer';
import {scorer$} from './scorer';
import {enabler} from './enabler';

require('./styles.css');

test('>>> FRP Bowling Kata', function() {
  test('>>> FRP Bowling Kata Scorer', scorerTests, false);
  test('>>> FRP Bowling Kata Displayer', displayerTests, false);
  test('>>> FRP Bowling Kata Enabler', enablerTests, false);
});

run(main, {DOM: makeDOMDriver('#app')});

function main(sources) {
  const newGameButton$ = sources.DOM.select('#newgame').events('click');
  const rollButton$ = sources.DOM.select('.rollButton').events('click');

  const action$ = Observable.merge(
    newGameButton$
      .startWith(null)
      .map(evt => (
        { type: 'NEWGAME' }
      )),

    rollButton$
      .map(evt => parseInt(evt.target.innerHTML))
      .map(payload => (
        { type: 'ROLL', payload }
      ))
  );

  const initialState = {
    roll$: Observable.empty(),
    display$: Observable.of(''),
    score$: Observable.empty()
  };

  const reducers$ = Observable.merge(
    action$
      .filter((action: any) => action.type === 'NEWGAME')
      .map(action =>
        function newGameReducer(state) {
          return initialState;
        }
      ),

    action$
      .filter((action: any) => action.type === 'ROLL')
      .map((action: any) =>
        function rollReducer(state) {
          const nextRoll$ = state.roll$.concat(Observable.of(action.payload));
          return {
            roll$: nextRoll$,
            display$: displayer$(nextRoll$),
            score$: scorer$(nextRoll$)
          };
        }
      )
  );

  const state$ = reducers$
    .scan((state, next) => next(state), initialState)
    ;

  const model$ = state$.map(state =>
    state.display$.withLatestFrom(state.score$.toArray())
  ).switch();

  return {DOM: model$.map(([display, scores]) =>
    div('.container', [
      div('.jumbotron', [
        h1([
          img({props: {src: 'Rx_Logo_S.png'}}),
          span('FRP Bowling Kata')
        ]),
        h3('The Classic Kata')
      ]),
      hr(),
      button('#newgame', 'New Game'),
      hr(),
      ...Array(11).fill(0).map((_, pins) =>
        button(
          '.rollButton',
          {props: {disabled: pins > enabler(display, scores)}},
          pins.toString())
        ),
      hr(),
      div('#frames.clearfix', [
        ...Array(10).fill(0).map((_, frame) =>
          div('.frame', {class: {tenth: frame === 9}}, [
            ...Array(frame === 9 ? 3 : 2).fill(0).map((_, roll) =>
              div('.rollDisplay', display[2 * frame + roll] || '')
            ),
            div('.scoreDisplay', scores[frame])
          ])
        ),
      ]),
      hr()
    ])
  )};
}
