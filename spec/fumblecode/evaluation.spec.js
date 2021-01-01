"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
var helpers_1 = require("./helpers");
var ast_1 = require("../../src/script/fumblecode/ast");
var evaluation_1 = require("../../src/script/fumblecode/evaluation");
describe("the evaluation visitor", function () {
    var scope = {
        const: { asNumber: function () { return 23; } },
        right: { call: function (args) { return args[1]; } }
    };
    var gen = {
        int: function () { return 6; }
    };
    var ev = new evaluation_1.EvaluationVisitor(gen, scope);
    it('evaluates number nodes', function () {
        var node = new ast_1.Number(23);
        expect(ev.number(node)).toEqual(helpers_1.aFumbleNumber(23));
    });
    it('evaluates const nodes', function () {
        var node = new ast_1.Const('const');
        expect(ev.const(node)).toEqual(helpers_1.aFumbleNumber(23));
    });
    it('throws EvaluationError for unknown constants', function () {
        var node = new ast_1.Const('easterbunny');
        expect(function () { return ev.const(node); })
            .toThrow(new evaluation_1.EvaluationError('unknown name: easterbunny'));
    });
    it('evaluates embraced nodes', function () {
        var node = new ast_1.Embraced(new ast_1.Number(23));
        expect(ev.embraced(node)).toEqual(helpers_1.aFumbleNumber(23));
    });
    it('evaluates list nodes', function () {
        var node = new ast_1.List([new ast_1.Number(23)]);
        expect(ev.list(node)).toEqual(helpers_1.aFumbleList([23]));
    });
    it('evaluates operation nodes', function () {
        var node = new ast_1.Operation('+', new ast_1.Number(20), new ast_1.Number(3));
        expect(ev.operation(node)).toEqual(helpers_1.aFumbleNumber(23));
    });
    it('evaluates dice nodes', function () {
        var node = new ast_1.Dice(4, 6);
        expect(ev.dice(node)).toEqual(helpers_1.aFumbleNumber(24));
    });
    it('evaluates property access', function () {
        var node = new ast_1.PropertyAccess(new ast_1.Number(-23), 'abs');
        expect(ev.propertyAccess(node)).toEqual(helpers_1.aFumbleNumber(23));
    });
    it('evaluates function calls', function () {
        var node = new ast_1.Call(new ast_1.Const('right'), [new ast_1.Number(5), new ast_1.Number(23)]);
        expect(ev.call(node).asNumber()).toBe(23);
        expect(ev.call(node)).toEqual(helpers_1.aFumbleNumber(23));
    });
    it('evaluates with', function () {
        var node = new ast_1.With(new ast_1.Const('a'), [{ name: 'a', expression: new ast_1.Number(23) }]);
        expect(ev.with(node)).toEqual(helpers_1.aFumbleNumber(23));
    });
});
