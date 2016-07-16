import {hr, button, span, div} from '@cycle/dom';
import {enabler} from './enabler';
require('../styles.css');
require('../Rx_Logo_S.png');
require('../favicon.ico');

export function view(model$) {
  return model$.map(([display, scores, props, pastLength, futureLength]) =>
    div({key: props.id}, [
      vPlayerName(props),
      vFrames(display, scores),
      vRollButtons(display, scores),
      vActions(display, pastLength, futureLength),
      hr()
    ])
  );
};

function vPlayerName(props) {
  return div( '.name', props.name.toString() );
}

function vFrames(display, scores) {
  return div('.frames.clearfix', [
    ...Array(10).fill(0).map((_, frame) =>
      div('.frame', {class: {tenth: frame === 9}}, [
        ...Array(frame === 9 ? 3 : 2).fill(0).map((_, roll) =>
          div('.rollDisplay', display[2 * frame + roll] || '')
        ),
        div('.scoreDisplay', scores[frame])
      ])
    ),
  ]);
}

function vRollButtons(display, scores) {
  return span('.rollButtons', [
    ...Array(11).fill(0).map((_, pins) =>
      button(
        '.rollButton',
        {props: {disabled: pins > enabler(display, scores)}},
        pins.toString())
      )
  ]);
}

function vActions(display, pastLength, futureLength) {
  return span('.actions', [
    button('.newgame',
      {props: {disabled: display.length === 0}}, 'New'),
    button('.undo',
      {props: {disabled: pastLength <= 1}}, 'Undo'),
    button('.redo',
      {props: {disabled: futureLength === 0}}, 'Redo'),
    button('.delete', 'X')
  ]);
}
