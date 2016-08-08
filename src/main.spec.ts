import {test, expect, assertMVIComponent} from '../testsuite';
import {main, makeBowlingLineWrapperFn} from './main';
import {modelTests} from './model.spec';
import {viewTests} from './view.spec';
import {intentTests} from './intent.spec';
import {Observable as O} from 'rxjs';
import {BowlingLine} from './bowlingLine';

export type Component<So, Si> = (sources: So, ...rest: Array<any>) => Si;
export function mainTests() {
  test('main component', function() {
    test('is MVI component', assertMVIComponent(main));
    test('model', modelTests);
    test('view', viewTests);
    test('intent', intentTests);
  });

  test('BowlingLine Wrapper', function(){
    const mockSources = {mock: 'sources'};

    test('is passed using sources to intent', function() {
      const mockIntent = sources => O.empty();
      const mockView = model$ => ({});
      function makeBowlingLine (id, name) {
        return <Component<any, any>>function(sources) {
          return {id, name};
        };
      }
      function model(action$, actualMakeBowlingLine) {
        expect(actualMakeBowlingLine).toEqual(makeBowlingLine);
        return O.of([]);
      }
      function makeBowlingLineWrapper(sources) {
        expect(sources).toEqual(mockSources);
        return makeBowlingLine;
      }
      main(mockSources, model, mockView, mockIntent,
        makeBowlingLineWrapper(mockSources));
    });

    test('wrapper invokes function that builds BowlingLine', function() {
      const makeFn = makeBowlingLineWrapperFn(mockSources, isolate, BowlingLine);
      let isolateCall = 0;
      let isolatedCall = 0;
      makeFn(1, 'Andrew');
      function isolated(sources) {
        isolatedCall++;
        expect(sources.mock).toEqual('sources');
        expect(sources.props$).toBeStreamOf({id: 1, name: 'Andrew'});
        return {DIV: O.empty()};
      }
      function isolate (component) {
        isolateCall++;
        expect(component).toBe(BowlingLine);
        return isolated;
      }
      expect(isolateCall).toBe(1);
      expect(isolatedCall).toBe(1);
    });
  });
}
