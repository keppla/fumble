"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/fn/object/entries");
require("core-js/fn/object/values");
var evaluation_1 = require("./evaluation");
var util_1 = require("../util");
function possibilities(node) {
    var amounts = {};
    var namesToValues = {};
    var values = evaluateAll(function (gen) { return evaluation_1.evaluate(node, gen); });
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        var name_1 = value.toString();
        amounts[name_1] = (amounts[name_1] || 0) + 1;
        namesToValues[name_1] = value;
    }
    return Object
        .entries(amounts)
        .map(function (_a) {
        var name = _a[0], amount = _a[1];
        return ({
            value: name,
            amount: amount,
            percent: 100.0 * amount / values.length
        });
    })
        .sort(function (left, right) {
        var l = namesToValues[left.value];
        var r = namesToValues[right.value];
        try {
            return -1 * l.infix('<', r).asNumber()
                + 1 * l.infix('>', r).asNumber();
        }
        catch (error) {
            return 0;
        }
    });
}
exports.possibilities = possibilities;
var QuantumNumberGenerator = (function () {
    function QuantumNumberGenerator(path) {
        this.index = 0;
        this.path = path;
        this.open = [path];
    }
    QuantumNumberGenerator.prototype.int = function (min, max) {
        if (this.index < this.path.length) {
            return this.path[this.index++];
        }
        else {
            var first_1 = this.open[0];
            var firstCrossed = util_1.range(min, max + 1).map(function (n) { return first_1.concat(n); });
            var rest = this.open.slice(1);
            this.open = firstCrossed.concat(rest);
            return min;
        }
    };
    QuantumNumberGenerator.prototype.parallels = function () {
        return this.open.slice(1).map(function (path) { return new QuantumNumberGenerator(path); });
    };
    return QuantumNumberGenerator;
}());
function evaluateAll(func) {
    return ea(func, new QuantumNumberGenerator([]));
}
exports.evaluateAll = evaluateAll;
function ea(func, gen) {
    return (_a = [func(gen)]).concat.apply(_a, gen.parallels().map(function (p) { return ea(func, p); }));
    var _a;
}
