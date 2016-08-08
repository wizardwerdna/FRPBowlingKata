import {test, expect} from '../testsuite';
import {view} from './view';
import {Observable as O} from 'rxjs';
import {div} from '@cycle/dom';

const match =
  (<any> require('snabbdom-selector')).default as (s: string, v: any[]) => any;

export function viewTests() {

  const mockBowlingLine = (id, name) =>
    div('.line', {key: id}, [
      div('.name', name)
    ]);

  test('static view', function() {
    view(O.empty()).subscribe(vtree => {
      expect(match('.container', vtree).length).toBe(1);
      expect(match('.container input.name', vtree).length).toBe(1);
    });
  });

  test('dynamic view', function() {
    test('no lines', function() {
      view(O.of([]))
        .subscribe(vtree =>
          expect(match('div.name', vtree).length).toBe(0)
        );
    });
    test('singleton line', function() {
      view(O.of([
        mockBowlingLine(1, 'Andrew')
      ])).subscribe(vtree =>
          expect(match('div.name', vtree).map(match => match.text))
          .toEqual(['Andrew'])
      );
    });

    test('two lines', function() {
      view(O.of([
        mockBowlingLine(1, 'Andrew'),
        mockBowlingLine(2, 'William')
      ])).subscribe(vtree => {
        expect(match('div.name', vtree).map(match => match.text))
          .toEqual(['Andrew', 'William']);
      });
    });
  });
}
