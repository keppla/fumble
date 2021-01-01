"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
function evaluate(node, gen) {
    return node.visit(new EvaluationVisitor(gen, {
        min: new FumbleFunction('min', Math.min),
        max: new FumbleFunction('max', Math.max)
    }));
}
exports.evaluate = evaluate;
var FumbleNumber = (function () {
    function FumbleNumber(value) {
        this.value = value;
    }
    FumbleNumber.prototype.asNumber = function () {
        return this.value;
    };
    FumbleNumber.prototype.toString = function () {
        return "" + this.value;
    };
    FumbleNumber.prototype.infix = function (op, other) {
        var operations = {
            '+': function (l, r) { return l + r; },
            '*': function (l, r) { return l * r; },
            '-': function (l, r) { return l - r; },
            '/': function (l, r) { return l / r; },
            '>': function (l, r) { return l > r ? 1 : 0; },
            '>=': function (l, r) { return l >= r ? 1 : 0; },
            '<': function (l, r) { return l < r ? 1 : 0; },
            '<=': function (l, r) { return l <= r ? 1 : 0; },
            '=': function (l, r) { return l == r ? 1 : 0; },
        };
        return new FumbleNumber(operations[op](this.value, other.asNumber()));
    };
    FumbleNumber.prototype.property = function (name) {
        var func = this["property_" + name];
        if (!func) {
            throw new EvaluationError("unknown property: " + name);
        }
        return func.bind(this)();
    };
    FumbleNumber.prototype.property_abs = function () {
        return new FumbleNumber(Math.abs(this.value));
    };
    FumbleNumber.prototype.property_sign = function () {
        return new FumbleNumber(Math.sign(this.value));
    };
    FumbleNumber.prototype.call = function (args) {
        throw new EvaluationError('number cannot be called');
    };
    return FumbleNumber;
}());
var FumbleFunction = (function () {
    function FumbleFunction(name, handler) {
        this.name = name;
        this.handler = handler;
    }
    FumbleFunction.prototype.toString = function () {
        return "<" + this.name + ">";
    };
    FumbleFunction.prototype.asNumber = function () {
        throw new EvaluationError('function cannot be coerced to number');
    };
    FumbleFunction.prototype.property = function (name) {
        throw new EvaluationError("unknown property: " + name);
    };
    FumbleFunction.prototype.infix = function (op, other) {
        throw new EvaluationError("operator " + op + " is not defined for functions");
    };
    FumbleFunction.prototype.call = function (args) {
        var numberArgs = args.map(function (arg) { return arg.asNumber(); });
        return new FumbleNumber(this.handler.apply(this, numberArgs));
    };
    return FumbleFunction;
}());
var FumbleList = (function () {
    function FumbleList(items) {
        this.items = items;
    }
    FumbleList.prototype.toString = function () {
        return "[" + this.items.map(function (item) { return item.toString(); }).join(', ') + "]";
    };
    FumbleList.prototype.asNumber = function () {
        throw new EvaluationError('list cannot be coerced to number');
    };
    FumbleList.prototype.property = function (name) {
        if (name === 'sorted') {
            var items = this.items.slice().sort(function (l, r) {
                return (-1 * l.infix('<', r).asNumber()
                    + 1 * l.infix('>', r).asNumber());
            });
            return new FumbleList(items);
        }
        if (name === 'reversed') {
            return new FumbleList(this.items.reverse());
        }
        if (name.match(/^[0-9]+$/)) {
            var index = parseInt(name, 10);
            if (index < this.items.length) {
                return this.items[index];
            }
        }
        throw new EvaluationError("unknown property: " + name);
    };
    FumbleList.prototype.infix = function (op, other) {
        throw new EvaluationError("operator " + op + " is not defined for functions");
    };
    FumbleList.prototype.call = function (args) {
        throw new EvaluationError("lists cannot be called");
    };
    return FumbleList;
}());
var EvaluationError = (function (_super) {
    __extends(EvaluationError, _super);
    function EvaluationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EvaluationError;
}(Error));
exports.EvaluationError = EvaluationError;
var EvaluationVisitor = (function () {
    function EvaluationVisitor(generator, scope) {
        this.generator = generator;
        this.scope = scope;
    }
    EvaluationVisitor.prototype.number = function (n) {
        return new FumbleNumber(n.value);
    };
    EvaluationVisitor.prototype.const = function (c) {
        var value = this.scope[c.name];
        if (!value) {
            throw new EvaluationError("unknown name: " + c.name);
        }
        return value;
    };
    EvaluationVisitor.prototype.operation = function (o) {
        var left = o.left.visit(this);
        var right = o.right.visit(this);
        return left.infix(o.op, right);
    };
    EvaluationVisitor.prototype.dice = function (d) {
        var _this = this;
        return new FumbleNumber(util_1.range(0, d.amount)
            .map(function (i) { return _this.generator.int(1, d.sides); })
            .reduce(function (acc, val) { return acc + val; }, 0));
    };
    EvaluationVisitor.prototype.embraced = function (e) {
        return e.expression.visit(this);
    };
    EvaluationVisitor.prototype.list = function (l) {
        var _this = this;
        return new FumbleList(l.items.map(function (item) { return item.visit(_this); }));
    };
    EvaluationVisitor.prototype.propertyAccess = function (p) {
        return p.object.visit(this).property(p.propertyname);
    };
    EvaluationVisitor.prototype.call = function (c) {
        var _this = this;
        var obj = c.object.visit(this);
        var args = c.arguments.map(function (arg) { return arg.visit(_this); });
        return obj.call(args);
    };
    EvaluationVisitor.prototype.with = function (w) {
        var scope = {};
        for (var name_1 in this.scope) {
            scope[name_1] = this.scope[name_1];
        }
        for (var _i = 0, _a = w.bindings; _i < _a.length; _i++) {
            var binding = _a[_i];
            scope[binding.name] = binding.expression.visit(this);
        }
        return w.expression.visit(new EvaluationVisitor(this.generator, scope));
    };
    return EvaluationVisitor;
}());
exports.EvaluationVisitor = EvaluationVisitor;
