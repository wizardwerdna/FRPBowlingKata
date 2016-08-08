import {test, expect, assertMVIComponent} from '../../testsuite';
import {BowlingLine} from './';
import {testBowlingLineModel} from './model.spec';
import {testBowlingLineView} from './view.spec';
import {testBowlingLineIntent} from './intent.spec';
import {scorerTests} from './scorer.spec';
import {displayerTests} from './displayer.spec';
import {enablerTests} from './enabler.spec';
import {mockDOMSource} from '@cycle/dom';
import RxAdapter from '@cycle/rxjs-adapter';
import {Observable as O} from 'rxjs';

export function bowlingLineTests() {
  test('FRP Bowling Kata Unit Tests', function() {
    test('Scorer', scorerTests);
    test('Displayer', displayerTests);
    test('Enabler', enablerTests);
  });

  test('BowlingLine implements MVI Pattern', assertMVIComponent(BowlingLine));
  test('model(action$, source.props$)', testBowlingLineModel);
  test('view(model$)', testBowlingLineView);
  test('intent(DOMSource)', testBowlingLineIntent);

  test('Delete', function() {
    test('no delete clicked', function() {
      const testSources = mockSources('.rollButton', 3, 'Andrew');
      expect(BowlingLine(testSources).Delete.isEmpty()).toBeStreamOf(true);
    });

    test('with delete clicked', function() {
      const testSources = mockSources('.delete', 3, 'Andrew');
      expect(BowlingLine(testSources).Delete)
        .toBeStreamOf({type: 'DELETE', payload: 3});
    });

    function mockSources(selector, id, name) {
      return Object.assign({},
        {DOM: mockDOMSource(RxAdapter, {
          selector: {'click': O.of({target: {innerHTML: '5'}})}})},
        {props$: O.of({id, name})}
      );
    }

  });
}
