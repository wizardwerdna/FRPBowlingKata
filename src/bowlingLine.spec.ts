import {test, expect} from '../testsuite';
import {Observable as O} from 'rxjs';
import {div, mockDOMSource} from '@cycle/dom';
import {BowlingLine} from './bowlingLine';
import {testBowlingLineModel} from './bowlingLine/model.spec';
import {testBowlingLineView} from './bowlingLine/view.spec';
import {testBowlingLineIntent} from './bowlingLine/intent.spec';
import RxJSAdapter from '@cycle/rxjs-adapter';

export function bowlingLineTests() {

  const nullModel = (action$) => O.empty();
  const nullView = (model$) => model$;
  const nullIntent = (DOMSource) => O.empty();

  test('model(action$)', testBowlingLineModel);
  test('view(model$)', testBowlingLineView);
  test('intent(DOMSource)', testBowlingLineIntent);
  test('BowlingLine component implements MVI Pattern', function() {
    test('DOM flows to intent', function() {
      const DOM = mockDOMSource(RxJSAdapter, {
        '.rollButton': {
          'click': O.of({target: {innerHTML: '5'}})
        }
      });
      BowlingLine({DOM}, nullView, nullModel, intent);
      function intent(DOMSource) {
        const rollButton$ = DOMSource.select('.rollButton').events('click');
        expect(rollButton$.map(evt => evt.target.innerHTML)).toBeStreamOf('5');
        return O.of({type: 'ROLL', payload: 5});
      }
    });

    test('intent flows action$ to model', function() {
      [
        {type: 'TASK_1', payload: 123},
        {type: 'TASK_2', payload: 'abcdef'}
      ].forEach(expected => {
        BowlingLine({}, nullView, model, intent);
        function intent(sources) {
          return O.merge(O.of(expected));
        }
        function model(action$) {
          expect(action$).toBeStreamOf(expected);
        }
      });
    });

    test('model flows model$ to view', function() {
      [{
        display: '', scores: [],
        enabledRolls: 10, enabledUndo: false, enabledRedo: false
      }, {
        display: '5/5', scores: [15, 20],
        enabledRolls: 5, enabledUndo: true, enabledRedo: false
      }, {
        display: '1-2-3-4-5-6-7-8-9-XXX',
        scores: [1, 3, 6, 10, 15, 21, 28, 36, 45, 75],
        enabledRolls: 0, enabledUndo: true, enabledRedo: true
      }].forEach(expected => {
        BowlingLine({}, view, model, nullIntent);
        function model(actions$) {
          return O.combineLatest(
            O.of(expected.display),
            O.of(expected.scores),
            O.of(expected.enabledUndo),
            O.of(expected.enabledRedo)
          );
        }
        function view(model$) {
          model$.subscribe( ([
            display, scores, enabledUndo, enabledRedo]) => {
            expect(display).toBe(expected.display);
            expect(scores).toEqual(expected.scores);
            expect(enabledUndo).toBe(enabledUndo);
            expect(enabledRedo).toBe(expected.enabledRedo);
          });
        }
      });
    });

    test('view flows vTree$ to sink BowlingLine(...).DOM', function() {
      const testView = (model$: O<any>) => O.of(div('testDOM'));
      expect(BowlingLine({}, testView, nullModel, nullIntent).DOM)
        .toBeStreamOf(div('testDOM'));
    });
  });
};
