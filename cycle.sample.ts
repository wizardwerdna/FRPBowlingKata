import {Observable} from 'rxjs';
import {run} from '@cycle/rxjs-run';
import {div, h1, makeDOMDriver} from '@cycle/dom';
import * as $ from 'jquery';
console.clear();

run(main, {DOM: makeDOMDriver('#app')});

function main() {
  return {DOM: Observable.of(
    div('.container', [
      div('.jumbotron', [
        h1('Cycle.js Starter Pack')
      ])
    ])
  )};
}

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
window['jQuery'] = $;
window['$'] = $;
require('bootstrap-loader');

