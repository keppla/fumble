import 'core-js/fn/object/entries';
import 'core-js/fn/object/values';
    

import {Node} from './ast';
import {evaluate, FumbleObject} from './evaluation';

import {range} from '../util';
import {NumberGenerator} from '../lib';


export function possibilities(node: Node): Incidence[] {
    let amounts: {[name: string]: number} = {};
    let namesToValues: {[name: string]: FumbleObject} = {};
    let values = evaluateAll((gen) => evaluate(node, gen));

    for (let value of values) {
        let name = value.toString();
        amounts[name] = (amounts[name] || 0) + 1;
        namesToValues[name] = value;
    }

    return Object
        .entries(amounts)
        .map(([name, amount]) => ({
            value: name,
            amount: amount,
            percent: 100.0 * amount / values.length
        }))
        .sort((left, right) => {
            let l = namesToValues[left.value];
            let r = namesToValues[right.value];
            try {
                return -1 * l.infix('<', r).asNumber()
                      + 1 * l.infix('>', r).asNumber();
            }
            catch (error) {
                return 0;
            }
        });
}


export interface Incidence {
    readonly value: string;
    readonly amount: number;
    readonly percent: number;
}


class QuantumNumberGenerator implements NumberGenerator {

    private index: number;
    private path: number[];
    private open: number[][];

    constructor(path: number[]) {
        this.index = 0;
        this.path = path;
        this.open = [path];
    }

    int(min: number, max: number): number {
        if (this.index < this.path.length) {
            return this.path[this.index++];
        }
        else {
            let first = this.open[0];
            let firstCrossed = range(min, max + 1).map(n => first.concat(n));
            let rest = this.open.slice(1);

            this.open = firstCrossed.concat(rest);

            return min;
        }
    }

    parallels(): QuantumNumberGenerator[] {
        return this.open.slice(1).map(path => new QuantumNumberGenerator(path));
    }
}


type QuantumExpression<T> = (gen: NumberGenerator) => T;


export function evaluateAll<T>(func: QuantumExpression<T>): T[] {
    return ea(func, new QuantumNumberGenerator([]));
}


function ea<T>(func: QuantumExpression<T>, gen: QuantumNumberGenerator): T[] {
    return [func(gen)].concat(...gen.parallels().map(p => ea(func, p)));
}
