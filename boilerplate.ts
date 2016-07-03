console.clear();
import {Observable} from 'rxjs';
import {run} from '@cycle/rxjs-run';
import {div, input, li, hr, h1, button, b, br, span, ul, label, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import * as $ from 'jquery';

run(main, {DOM: makeDOMDriver('#app'), HTTP: makeHTTPDriver()});

function main(sources) {
  const loadButton$ = sources.DOM.select('button').events('click')
    .startWith(null);
  const searchInput$ = sources.DOM.select('#search').events('input');

  const search$ = searchInput$
    .map(evt => evt.target.value)
    .startWith('');

  const request$ = loadButton$
    .mapTo({
      url: eldenStream(),
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      category: 'eldenStream'
    })
    ;

  const products$ = sources.HTTP
    .select('eldenStream')
    .switch()
    .mergeMap(response =>
      Observable.of(parseAndInvert(response.text)))
    .startWith(null);

  const stuff$ = search$.combineLatest(products$, (search, products) =>
    [products && products
      .filter(product =>
         (product.PRODUCTNAME || '').length > 0 && (product.PRODUCTID || '').length > 0
      )
    , (products || [])
      .filter(product =>
         (product.PRODUCTNAME || '').length > 0 && (product.PRODUCTID || '').length > 0
      )
      .filter(product =>
      `${product.PRODUCTNAME} ${product.PRODUCTSKU} ${product.TYPE}`.toLowerCase()
        .indexOf(search.toLowerCase()) > -1
      )
    ]
  );

  return {
    DOM: stuff$.map(([products, selected]) =>
      products ? div('.container', [
        hr(),
        button('.btn.btn-sm', 'Reload eWinery JSON Feed'),
        h1('Digivino Marketing Shortcodes'),
        `You have selected ${selected.length || 0} of the ${products.length || 0} products provided by eWinery`,
        hr(),
        div('.form-group', [
          label('Search'),
          input('#search.form-control', {props: {type: 'search'}}),
        ]),
        br(),
        ul('.list-unstyled.list-group', [
          li('list-group-item', div(['what the fuck'])),
          ...selected.map(each => li([
            b(each.PRODUCTNAME),
            span(` SKU ${each.PRODUCTSKU} (${each.TYPE})`),
            br(),
            ul('.list-unstyled.list-group', [
              ...each.TYPE === 'Kit' ?  [
                li('.list-group-item', `[Buy1Kit id="${each.PRODUCTID}" price="${each.PRICE1}]"`),
                li('.list-group-item', `[ReturnToSpecials]`)
              ] : [
                li('.list-group-item', `[Buy1Bottle id="${each.PRODUCTID}" price="${each.PRICE1}"]`),
                li('.list-group-item', `[Buy1Case id="${each.PRODUCTID}" price="${each.PRICE2}"]`),
                li('.list-group-item',  `[ReturnToShop]`)
              ]
            ])
          ]))
        ])
      ]) :
      div('.container.jumbotron', [
        h1('Loading eWinery JSON stream...')
      ])
    ),
    HTTP: request$
  };
}

function eldenStream() {
  return 'http://elden.dev/wp-content/plugins/products/productjson.php';
}

function parseAndInvert(text) {
  if (!text) { return(null); }
  const json = JSON.parse(text);
  return json.DATA.ROWNUMBER.map((index) =>
    json.COLUMNS.reduce(
      (o, fieldName) => {
        o[fieldName] = json.DATA[fieldName][1 * index - 1];
        return o;
      }, {}
    )
  );
}

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
window['jQuery'] = $;
window['$'] = $;
require('bootstrap-loader');
