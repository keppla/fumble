
import {List, Number, Const, Dice, Operation, Embraced, PropertyAccess, Call, Node, NodeVisitor, With} from './ast';

import {range} from '../util';
import {NumberGenerator} from '../lib';


export function display(node: Node, gen: NumberGenerator): DisplayToken[] {
    return node.visit(new DisplayVisitor(gen));
}


export interface DisplayToken {
    type: string,
    value: string | number,
    sides?: number
}


class DisplayVisitor implements NodeVisitor<DisplayToken[]> {

    private generator: NumberGenerator;

    constructor(generator: NumberGenerator) {
        this.generator = generator;
    }

    number(n: Number): DisplayToken[] {
        return [{type: 'number', value: n.value}]
    }

    const(c: Const): DisplayToken[] {
        return [{type: 'operator', value: c.name}];
    }

    operation(o: Operation): DisplayToken[] {
        return [
            ...o.left.visit(this),
            {type: 'operator', value: o.op},
            ...o.right.visit(this)
        ];
    }

    dice(d: Dice): DisplayToken[] {
        return range(0, d.amount).map(() =>
                ({
                    type: 'die',
                    sides: d.sides,
                    value: this.generator.int(1, d.sides)
                }));
    }

    embraced(e: Embraced): DisplayToken[] {
        return [
            {type: 'bracket', value: '('},
            ...e.expression.visit(this),
            {type: 'bracket', value: ')'},
        ];
    }

    propertyAccess(p: PropertyAccess): DisplayToken[] {
        return [
            ...p.object.visit(this),
            {type: 'operator', value: `.${p.propertyname}`},
        ]
    }

    call(c: Call): DisplayToken[] {
        return [
            {type: 'operator', value: '('},
            ...c.arguments
                    .map(p => [
                        {type: 'operator', value: ','},
                        ...p.visit(this)
                    ])
                    .reduce((acc, v) => acc.concat(v), [])
                    .slice(1),
            {type: 'operator', value: ')'}
        ];
    }

    list(l: List): DisplayToken[] {
      return [
          {type: 'bracket', value: '['},
          ...l.items
                  .map(p => [
                      {type: 'operator', value: ','},
                      ...p.visit(this)
                  ])
                  .reduce((acc, v) => acc.concat(v), [])
                  .slice(1),

          {type: 'bracket', value: ']'},
      ];
    }

    with(w: With): DisplayToken[] {
        return [
            ...w.expression.visit(this),
            {type: 'operator', value: 'with'},
            ...w.bindings
                .map(b => [
                    {type: 'operator', value: ','},
                    {type: 'operator', value: b.name},
                    {type: 'operator', value: '='},
                    ...b.expression.visit(this)
                ])
                .reduce((acc, v) => acc.concat(v), [])
                .slice(1)
        ]
    }
}
