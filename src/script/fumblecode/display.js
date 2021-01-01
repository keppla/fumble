"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
function display(node, gen) {
    return node.visit(new DisplayVisitor(gen));
}
exports.display = display;
var DisplayVisitor = (function () {
    function DisplayVisitor(generator) {
        this.generator = generator;
    }
    DisplayVisitor.prototype.number = function (n) {
        return [{ type: 'number', value: n.value }];
    };
    DisplayVisitor.prototype.const = function (c) {
        return [{ type: 'operator', value: c.name }];
    };
    DisplayVisitor.prototype.operation = function (o) {
        return o.left.visit(this).concat([
            { type: 'operator', value: o.op }
        ], o.right.visit(this));
    };
    DisplayVisitor.prototype.dice = function (d) {
        var _this = this;
        return util_1.range(0, d.amount).map(function () {
            return ({
                type: 'die',
                sides: d.sides,
                value: _this.generator.int(1, d.sides)
            });
        });
    };
    DisplayVisitor.prototype.embraced = function (e) {
        return [
            { type: 'bracket', value: '(' }
        ].concat(e.expression.visit(this), [
            { type: 'bracket', value: ')' },
        ]);
    };
    DisplayVisitor.prototype.propertyAccess = function (p) {
        return p.object.visit(this).concat([
            { type: 'operator', value: "." + p.propertyname },
        ]);
    };
    DisplayVisitor.prototype.call = function (c) {
        var _this = this;
        return [
            { type: 'operator', value: '(' }
        ].concat(c.arguments
            .map(function (p) { return [
            { type: 'operator', value: ',' }
        ].concat(p.visit(_this)); })
            .reduce(function (acc, v) { return acc.concat(v); }, [])
            .slice(1), [
            { type: 'operator', value: ')' }
        ]);
    };
    DisplayVisitor.prototype.list = function (l) {
        var _this = this;
        return [
            { type: 'bracket', value: '[' }
        ].concat(l.items
            .map(function (p) { return [
            { type: 'operator', value: ',' }
        ].concat(p.visit(_this)); })
            .reduce(function (acc, v) { return acc.concat(v); }, [])
            .slice(1), [
            { type: 'bracket', value: ']' },
        ]);
    };
    DisplayVisitor.prototype.with = function (w) {
        var _this = this;
        return w.expression.visit(this).concat([
            { type: 'operator', value: 'with' }
        ], w.bindings
            .map(function (b) { return [
            { type: 'operator', value: ',' },
            { type: 'operator', value: b.name },
            { type: 'operator', value: '=' }
        ].concat(b.expression.visit(_this)); })
            .reduce(function (acc, v) { return acc.concat(v); }, [])
            .slice(1));
    };
    return DisplayVisitor;
}());
