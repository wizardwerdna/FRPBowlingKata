import {a, hr, button, img, span, h1, h3, div} from '@cycle/dom';
import {enabler} from '../enabler';
require('../styles.css');
require('../Rx_Logo_S.png');
require('../favicon.ico');

export function view(model$) {
  return model$.map(([display, scores, props, pastLength, futureLength]) =>
    div([
      div('.name', props.name.toString() + '(' + props.id.toString() + ')'),
      div('.frames.clearfix', [
        ...Array(10).fill(0).map((_, frame) =>
          div('.frame', {class: {tenth: frame === 9}}, [
            ...Array(frame === 9 ? 3 : 2).fill(0).map((_, roll) =>
              div('.rollDisplay', display[2 * frame + roll] || '')
            ),
            div('.scoreDisplay', scores[frame])
          ])
        ),
      ]),
      span('.rollButtons', [
        ...Array(11).fill(0).map((_, pins) =>
          button(
            '.rollButton',
            {props: {disabled: pins > enabler(display, scores)}},
            pins.toString())
          ),
      ]),
      span('.actions', [
        button('.newgame',
          {props: {disabled: display.length === 0}}, 'New'),
        button('.undo',
          {props: {disabled: pastLength <= 1}}, 'Undo'),
        button('.redo',
          {props: {disabled: futureLength === 0}}, 'Redo'),
        // button('.delete', 'X'),
      ]),
      hr()
    ])
  );
};
