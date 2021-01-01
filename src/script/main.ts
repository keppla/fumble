
import 'core-js/fn/array/find';

import {observable, applyBindings, pureComputed, bindingHandlers, unwrap} from 'knockout';
import {Chart, ChartOptions} from 'chart.js';

import {parse, evaluate, display, possibilities, Incidence, Node} from './fumblecode';
import {XorShiftNumberGenerator} from './lib';


interface KnockoutObservable<T> {
    (): T;
    (value: T): void;
    subscribe(callback: (value: T) => any): void;
}

function routePart(url: KnockoutObservable<string>, index: number, defaults: string[]) {
    return pureComputed<string>({
        read: () => {
            let fragments = url().split('/');
            return fragments[index] || defaults[index];
        },
        write: (value) => {
            let fragments = url().split('/');
            if (fragments.length - 1 < index) {
                fragments = [...fragments, ...defaults.slice(fragments.length)]
            }
            fragments[index] = value;
            location.hash = '#' + fragments.join('/');
        }
    });
}


export class Model {
    private readonly url = observable(location.hash.slice(1));

    public readonly dicecode: KnockoutObservable<string>;
    public readonly tab: KnockoutObservable<string>;
    public readonly seed: KnockoutObservable<string>;

    public readonly expression: KnockoutObservable<Node>;
    public readonly stats: KnockoutObservable<Incidence[]>;
    public readonly result: KnockoutObservable<any[]>;

    public readonly chart: KnockoutObservable<ChartOptions>;

    constructor() {
        let defaults = ['', '0', 'dice'];

        this.dicecode = routePart(this.url, 0, defaults);
        this.seed = routePart(this.url, 1, defaults);
        this.tab = routePart(this.url, 2, defaults);

        this.expression = pureComputed(() => {
            try {
                return parse(this.dicecode());
            }
            catch (err) {
                console.log("could not parse", err);
                return null;
            }
        });

        this.stats = pureComputed(() => {
            return (this.expression() === null)
                 ? []
                 : possibilities(this.expression());
        });

        this.result = pureComputed(() => {
            let exp = this.expression();

            if (exp === null) {
                return [];
            }

            let seed = parseInt(this.seed());

            return [
                ...display(exp, new XorShiftNumberGenerator(seed)),
                {
                    type: 'operator',
                    value: '='
                }, {
                    type: 'number',
                    value: evaluate(exp, new XorShiftNumberGenerator(seed)).toString()
                }
            ];
        });

        window.addEventListener('hashchange', (evt: HashChangeEvent) => {
            this.url(evt.newURL.replace(/^.*#/, ''));
        });
    }

    public roll() {
        this.seed(Math.round(Math.random() * Math.pow(2, 32) - 1).toString());
    }

    public dice_adder(code: string) {
        return () => {
            let d = this.dicecode;
            d((d().trim() === '' ? '' : d() + ' + ') + code);
        };
    }

    public tab_setter(value: string) {
        return () => { this.tab(value) };
    }

    public clear_code() {
        this.dicecode('');
    }
}


let charts: Chart[] = [];

bindingHandlers['chart'] = {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let incidences: Incidence[] = unwrap(valueAccessor());

        let chart = new Chart(element, {
            type: 'bar',
            data: {
                labels: incidences.map(inc => inc.value),
                datasets: [{
                    data: incidences.map(inc => inc.percent),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            }
        });
        charts.push(chart);
    },
    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let chart = charts.find(c => (c as any).chart.canvas === element);
        let incidences: Incidence[] = unwrap(valueAccessor());
        let data = chart.data as any;

        data.datasets[0].data = incidences.map(inc => inc.percent);
        data.labels = incidences.map(inc => inc.value);

        chart.update()
    }
};


let model = new Model();

applyBindings(model);



import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './components/app';

ReactDOM.render(
    React.createElement(App, {
        model,
        onChangeTab: (tab: any): any => model.tab_setter(tab),
        activeTab: 'dice'
    }),
    document.querySelector('#reactapplication')
);
