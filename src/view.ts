import {a, img, input, label, span, h1, h3, div} from '@cycle/dom';
require('./styles.css');
require('./Rx_Logo_S.png');
require('./CycleJS_Logo.png');
require('./favicon.ico');

export function view(model$) {
  return model$.map(bowlingLines =>
    div('.container', [
      vTitle(),
      ...bowlingLines,
      vInput(),
      vFooter(),
    ])
  );
};

function vTitle() {
  return div('#title', [
    h1([
      img({props: {src: 'Rx_Logo_S.png'}}),
      a(
        {props: {href: 'https://github.com/wizardwerdna/FRPBowlingKata'}},
        'FRP Bowling'
      ),
      img({props: {src: 'CycleJS_Logo.png'}}),
    ]),
    h3('The Classic Kata in RxJS and CycleJS')
  ]);
}

function vInput() {
  return div('#input', [
    label('.playerLabel', 'New Player:'),
    input('.playerInput', {
      props: {autofocus: true},
      hook: {
        update: (oldVNode, {elm}) => {
          elm.value = '';
        }
      }
    })
  ]);
}

function vFooter() {
  return div('#footer', [
    a(
      '.footlink',
      {props: {href: 'https://github.com/wizardwerdna/FRPBowlingKata'}},
      'FRP Bowling'
    ),
    span(' built by '),
    a(
      '.footlinke',
      {props: {href: 'mailto:wizardwerdna@gmail.com'}},
      'Andrew C. Greenberg'
    )
  ]);
}
