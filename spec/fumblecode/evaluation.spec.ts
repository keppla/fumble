import 'jasmine';
import {aFumbleNumber, aFumbleList} from './helpers';
import {Call, Const, Dice, Embraced, List, Number, Operation, PropertyAccess, With} from '../../src/script/fumblecode/ast';
import {EvaluationVisitor, EvaluationError} from '../../src/script/fumblecode/evaluation';


describe("the evaluation visitor", () => {
    let scope: any = {
        const: { asNumber: () => 23 },
        right: { call: (args: any[]) => args[1] }
    };

    let gen: any = {
        int: () => 6
    };

    let ev = new EvaluationVisitor(gen, scope);

    it('evaluates number nodes', () => {
        let node = new Number(23);
        expect(ev.number(node)).toEqual(aFumbleNumber(23));
    });

    it('evaluates const nodes', () => {
        let node = new Const('const');
        expect(ev.const(node)).toEqual(aFumbleNumber(23));
    });

    it('throws EvaluationError for unknown constants', () => {
        let node = new Const('easterbunny');
        expect(() => ev.const(node))
            .toThrow(new EvaluationError('unknown name: easterbunny'));
    });

    it('evaluates embraced nodes', () => {
        let node = new Embraced(new Number(23));
        expect(ev.embraced(node)).toEqual(aFumbleNumber(23));
    });

    it('evaluates list nodes', () => {
        let node = new List([new Number(23)]);
        expect(ev.list(node)).toEqual(aFumbleList([23]));
    });

    it('evaluates operation nodes', () => {
        let node = new Operation('+', new Number(20), new Number(3));
        expect(ev.operation(node)).toEqual(aFumbleNumber(23));
    });

    it('evaluates dice nodes', () => {
        let node = new Dice(4, 6);
        expect(ev.dice(node)).toEqual(aFumbleNumber(24));
    });

    it('evaluates property access', () => {
        let node = new PropertyAccess(new Number(-23), 'abs');
        expect(ev.propertyAccess(node)).toEqual(aFumbleNumber(23));
    });

    it('evaluates function calls', () => {
        let node = new Call(new Const('right'), [new Number(5), new Number(23)]);
        expect(ev.call(node).asNumber()).toBe(23);
        expect(ev.call(node)).toEqual(aFumbleNumber(23));
    });

    it('evaluates with', () => {
        let node = new With(new Const('a'), [{name: 'a', expression: new Number(23)}]);
        expect(ev.with(node)).toEqual(aFumbleNumber(23));
    });

});
