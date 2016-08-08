import {test, expect} from '../../testsuite';
import {view} from './view';
import {Observable as O} from 'rxjs';
import {BowlingLine} from './';

const match =
  (<any> require('snabbdom-selector')).default as (s: any, v: any) => any;

export function testBowlingLineView() {
  const nullModel = (action$) => O.empty();
  const nullIntent = (DOMSource) => O.empty();

  test('static bowlingLine DOM', function() {
    view(O.of(['', [], 10, false, false])).subscribe( vtree => {
      expect(vtree.sel).toBe('div');
      expect(match('.frames.clearfix', vtree).length).toBe(1);
      expect(match('.frames .frame', vtree).length).toBe(10);
      expect(match('.frame.tenth:nth-child(10)', vtree).length).toBe(1);
      expect(match('.frame div.rollDisplay', vtree).length).toBe(21);
      expect(match('.frame div.scoreDisplay', vtree).length).toBe(10);
      expect(match('button.rollButton', vtree).length).toBe(11);
      Array(11).fill(0).forEach((_, index) =>
        expect(match(`.rollButton:nth-child(${index + 1})`, vtree)[0].text)
          .toEqual(index)
      );
      expect(match('span.actions button.newgame', vtree)[0].text).toBe('New');
      expect(match('span.actions button.undo', vtree)[0].text).toBe('Undo');
      expect(match('span.actions button.redo', vtree)[0].text).toBe('Redo');
      expect(match('span.actions button.delete', vtree)[0].text).toBe('X');
    });
  });

  test('dynamic bowlingLine DOM', function() {
    [{
      display: '', scores: [],
      enabledRolls: 10, enabledUndo: false, enabledRedo: false,
      props: {id: 1, name: 'Andrew'}
    }, {
      display: '5/5', scores: [15, 20],
      enabledRolls: 5, enabledUndo: true, enabledRedo: false,
      props: {id: 2, name: 'Andrew'}
    }, {
      display: '1-2-3-4-5-6-7-8-9-XXX',
      scores: [1, 3, 6, 10, 15, 21, 28, 36, 45, 75],
      enabledRolls: -1, enabledUndo: true, enabledRedo: true,
      props: {id: 3, name: 'Andrew'}
    }].forEach(expected => {
      BowlingLine({}, nullModel, () => view(O.combineLatest(
        O.of(expected.display),
        O.of(expected.scores),
        O.of(expected.enabledUndo),
        O.of(expected.enabledRedo),
        O.of(expected.props)
      )), nullIntent).DOM.subscribe( vtree => {
        const actual = evaluateFromVtree(vtree);
        expect(actual.display).toBe(expected.display);
        expect(actual.scores).toEqual(expected.scores);
        expect(actual.enabledRolls).toBe(expected.enabledRolls);
        expect(actual.enabledUndo).toBe(expected.enabledUndo);
        expect(actual.enabledRedo).toBe(expected.enabledRedo);
        expect(actual.props).toEqual(expected.props);
      }, nullIntent);
    });

    function evaluateFromVtree(vtree) {
      return {
        display: match('.rollDisplay', vtree).map(v => v.text).join(''),
        scores: match('.scoreDisplay', vtree)
          .map(v => v.text)
          .filter(score => score),
        enabledRolls: match('.rollButton', vtree)
          .map(v => !!v.data.props.disabled)
          .lastIndexOf(false),
        enabledUndo: match('.undo', vtree).map(v => !v.data.props.disabled)[0],
        enabledRedo: match('.redo', vtree).map(v => !v.data.props.disabled)[0],
        props: {id: vtree.key, name: match('.name', vtree).map(v => v.text)[0]}
      };
    }
  });

}
