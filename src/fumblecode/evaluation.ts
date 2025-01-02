import {Call, Const, Dice, Embraced, List, Node, NodeVisitor, Number, Operation, PropertyAccess, With} from './ast';
import {range} from '../util';
import {NumberGenerator} from '../lib';


export function evaluate(node: Node, gen: NumberGenerator): FumbleObject {
    return node.visit(new EvaluationVisitor(gen, {
        min: new FumbleFunction('min', Math.min),
        max: new FumbleFunction('max', Math.max)
    }));
}


export interface FumbleObject {
    toString(): string;
    asNumber(): number;
    infix(op: string, other: FumbleObject): FumbleObject;
    property(name: string): FumbleObject;
    call(args: FumbleObject[]): FumbleObject;
}


class FumbleNumber implements FumbleObject {
    private readonly value: number;

    constructor(value: number) {
        this.value = value;
    }

    asNumber(): number {
        return this.value;
    }

    toString(): string {
        return `${this.value}`;
    }

    infix(op: string, other: FumbleObject): FumbleObject {
        const operations: {[name: string]: (l: number, r: number) => number} = {
            '+': (l, r) => l + r,
            '*': (l, r) => l * r,
            '-': (l, r) => l - r,
            '/': (l, r) => l / r,
            '>': (l, r) => l > r ? 1 : 0,
            '>=': (l, r) => l >= r ? 1 : 0,
            '<': (l, r) => l < r ? 1 : 0,
            '<=': (l, r) => l <= r ? 1 : 0,
            '=': (l, r) => l == r ? 1 : 0,
            '!=': (l, r) => l != r ? 1 : 0,
            'and': (l, r) => l && r ? 1 : 0,
            'or': (l, r) => l || r ? 1 : 0,
        };
        return new FumbleNumber(operations[op](this.value, other.asNumber()));
    }

    property(name: string): FumbleObject {
        let func: (() => FumbleObject) = (this as any)[`property_${name}`];
        if (!func) {
            throw new EvaluationError(`unknown property: ${name}`);
        }
        return func.bind(this)();
    }

    property_abs(): FumbleNumber {
        return new FumbleNumber(Math.abs(this.value));
    }

    property_sign(): FumbleNumber {
        return new FumbleNumber(Math.sign(this.value));
    }

    call(_: FumbleObject[]): FumbleObject {
        throw new EvaluationError('number cannot be called');
    }
}


class FumbleFunction implements FumbleObject {
    private name: string;
    private readonly handler: (...args: number[]) => number;

    constructor(name: string, handler: (...args: number[]) => number) {
        this.name = name;
        this.handler = handler;
    }

    toString(): string {
        return `<${this.name}>`;
    }

    asNumber(): number {
        throw new EvaluationError('function cannot be coerced to number');
    }

    property(name: string): FumbleObject {
        throw new EvaluationError(`unknown property: ${name}`);
    }

    infix(op: string, _: FumbleObject): FumbleObject {
        throw new EvaluationError(`operator ${op} is not defined for functions`);
    }

    call(args: FumbleObject[]): FumbleObject {
        let numberArgs = args.map(arg => arg.asNumber())
        return new FumbleNumber(this.handler(...numberArgs));
    }
}


class FumbleList implements FumbleObject {

    items: FumbleObject[];

    constructor(items: FumbleObject[]) {
        this.items = items;
    }

    toString(): string {
        return `[${this.items.map(item => item.toString()).join(', ')}]`;
    }

    asNumber(): number {
        throw new EvaluationError('list cannot be coerced to number');
    }

    property(name: string): FumbleObject {
        if (name === 'sorted') {
            let items = this.items.slice().sort((l, r) => {
                return (-1 * l.infix('<', r).asNumber()
                       + 1 * l.infix('>', r).asNumber());
            });
            return new FumbleList(items);
        }
        if (name === 'reversed') {
            return new FumbleList(this.items.reverse());
        }
        if (name === 'first') {
            return this.items[0];
        }
        if (name === 'last') {
            return this.items[this.items.length - 1];
        }
        if (name.match(/^[0-9]+$/)) {
            let index = parseInt(name, 10);
            if (index < this.items.length) {
                return this.items[index];
            }
        }

        throw new EvaluationError(`unknown property: ${name}`);
    }

    infix(op: string, _: FumbleObject): FumbleObject {
        throw new EvaluationError(`operator ${op} is not defined for functions`);
    }

    call(_: FumbleObject[]): FumbleObject {
        throw new EvaluationError(`lists cannot be called`);
    }

}


export class EvaluationError extends Error {}


type Scope = {[name: string]: FumbleObject};


export class EvaluationVisitor implements NodeVisitor<FumbleObject> {

    private generator: NumberGenerator;
    private scope: Scope;

    constructor(generator: NumberGenerator, scope: Scope) {
        this.generator = generator;
        this.scope = scope;
    }

    number(n: Number): FumbleObject {
        return new FumbleNumber(n.value);
    }

    const(c: Const): FumbleObject {
        let value = this.scope[c.name];
        if (!value) {
            throw new EvaluationError(`unknown name: ${c.name}`);
        }
        return value;
    }

    operation(o: Operation): FumbleObject {
        let left = o.left.visit(this);
        let right = o.right.visit(this);
        return left.infix(o.op, right);
    }

    dice(d: Dice): FumbleObject {
        return new FumbleNumber(
                range(0, d.amount)
                    .map(() => this.generator.int(1, d.sides))
                    .reduce((acc, val) => acc + val, 0))
    }

    embraced(e: Embraced): FumbleObject {
        return e.expression.visit(this);
    }

    list(l: List): FumbleObject {
        return new FumbleList(l.items.map(item => item.visit(this)));
    }

    propertyAccess(p: PropertyAccess): FumbleObject {
        return p.object.visit(this).property(p.propertyname);
    }

    call(c: Call): FumbleObject {
        let obj = c.object.visit(this);
        let args = c.arguments.map(arg => arg.visit(this));
        return obj.call(args);
    }

    with(w: With): FumbleObject {
        let scope: Scope = {};
        for (let name in this.scope) {
            scope[name] = this.scope[name];
        }
        for (let binding of w.bindings) {
            scope[binding.name] = binding.expression.visit(this);
        }
        return w.expression.visit(new EvaluationVisitor(this.generator, scope));
    }
}
