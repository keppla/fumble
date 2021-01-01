"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Number = (function () {
    function Number(value) {
        this.value = value;
    }
    Number.prototype.visit = function (visitor) {
        return visitor.number(this);
    };
    return Number;
}());
exports.Number = Number;
var Const = (function () {
    function Const(name) {
        this.name = name;
    }
    Const.prototype.visit = function (visitor) {
        return visitor.const(this);
    };
    return Const;
}());
exports.Const = Const;
var Operation = (function () {
    function Operation(op, left, right) {
        this.op = op;
        this.left = left;
        this.right = right;
    }
    Operation.prototype.visit = function (visitor) {
        return visitor.operation(this);
    };
    return Operation;
}());
exports.Operation = Operation;
var Dice = (function () {
    function Dice(amount, sides) {
        this.amount = amount;
        this.sides = sides;
    }
    Dice.prototype.visit = function (visitor) {
        return visitor.dice(this);
    };
    return Dice;
}());
exports.Dice = Dice;
var Embraced = (function () {
    function Embraced(expression) {
        this.expression = expression;
    }
    Embraced.prototype.visit = function (visitor) {
        return visitor.embraced(this);
    };
    return Embraced;
}());
exports.Embraced = Embraced;
var List = (function () {
    function List(items) {
        this.items = items;
    }
    List.prototype.visit = function (visitor) {
        return visitor.list(this);
    };
    return List;
}());
exports.List = List;
var PropertyAccess = (function () {
    function PropertyAccess(object, methodname) {
        this.object = object;
        this.propertyname = methodname;
    }
    PropertyAccess.prototype.visit = function (visitor) {
        return visitor.propertyAccess(this);
    };
    return PropertyAccess;
}());
exports.PropertyAccess = PropertyAccess;
var Call = (function () {
    function Call(object, args) {
        this.object = object;
        this.arguments = args;
    }
    Call.prototype.visit = function (visitor) {
        return visitor.call(this);
    };
    return Call;
}());
exports.Call = Call;
var With = (function () {
    function With(expression, bindings) {
        this.expression = expression;
        this.bindings = bindings;
    }
    With.prototype.visit = function (visitor) {
        return visitor.with(this);
    };
    return With;
}());
exports.With = With;
