"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
var fumblecode_1 = require("../../src/script/fumblecode");
describe("the fumblecode parser", function () {
    it("undestands simple numbers", function () {
        expect(evaluate("23")).toBe('"23"');
        expect(evaluate("-42")).toBe('"-42"');
    });
    it("undestands dice codes", function () {
        expect(evaluate("5w6")).toBe('"5d6"');
        expect(evaluate("10D20")).toBe('"10d20"');
    });
    it("undestands basic operators", function () {
        expect(evaluate("1 + 2")).toBe('["1" + "2"]');
        expect(evaluate("1 - 2")).toBe('["1" - "2"]');
        expect(evaluate("1 * 2")).toBe('["1" * "2"]');
        expect(evaluate("1 / 2")).toBe('["1" / "2"]');
    });
    it("undestands basic comparisions", function () {
        expect(evaluate("1 < 2")).toBe('["1" < "2"]');
        expect(evaluate("1 <= 2")).toBe('["1" <= "2"]');
        expect(evaluate("1 > 2")).toBe('["1" > "2"]');
        expect(evaluate("1 >= 2")).toBe('["1" >= "2"]');
        expect(evaluate("1 = 2")).toBe('["1" = "2"]');
    });
    it("understands constants", function () {
        expect(evaluate('const')).toBe('<const>');
    });
    it("understands function calls", function () {
        expect(evaluate("func()")).toBe('[<func> ()]');
        expect(evaluate("func(1, 2)")).toBe('[<func> ("1", "2")]');
    });
    it("understands lists", function () {
        expect(evaluate("[]")).toBe('[list ]');
        expect(evaluate("[1]")).toBe('[list "1"]');
        expect(evaluate("[1, 2, 3]")).toBe('[list "1", "2", "3"]');
    });
    it("understands properties", function () {
        expect(evaluate("-1.abs")).toBe('["-1" . "abs"]');
        expect(evaluate("-1.abs.sign")).toBe('[["-1" . "abs"] . "sign"]');
        expect(evaluate("[].0")).toBe('[[list ] . "0"]');
    });
    it("respects operator precedence", function () {
        expect(evaluate("1 + 2 * 3 + 4")).toBe('[["1" + ["2" * "3"]] + "4"]');
    });
    it("respects parenthesises", function () {
        expect(evaluate("(1 + 2) * (3 + 4)")).toBe('[(["1" + "2"]) * (["3" + "4"])]');
    });
    it("has left-associative operators", function () {
        expect(evaluate("3 - 2 - 1")).toBe('[["3" - "2"] - "1"]');
    });
    it("understands 'with' scopes", function () {
        expect(evaluate("a with a = 1")).toBe('[with <a> a = "1"]');
        expect(evaluate("a with a = 1, b = 2")).toBe('[with <a> a = "1", b = "2"]');
        expect(evaluate("a with a = 1, b = c with c = 3")).toBe('[with <a> a = "1", b = [with <c> c = "3"]]');
    });
    it("can parse complex shit", function () {
        expect(evaluate("(3w6 + (-3 / -1).abs + 1) * -23 + (5w6 - -3)"))
            .toBe('[[([["3d6" + [(["-3" / "-1"]) . "abs"]] + "1"]) * "-23"] + (["5d6" - "-3"])]');
    });
});
function evaluate(text) {
    return fumblecode_1.parse(text).visit(new Stringify());
}
var Stringify = (function () {
    function Stringify() {
    }
    Stringify.prototype.number = function (n) {
        return "\"" + n.value + "\"";
    };
    Stringify.prototype.operation = function (o) {
        return "[" + o.left.visit(this) + " " + o.op + " " + o.right.visit(this) + "]";
    };
    Stringify.prototype.dice = function (d) {
        return "\"" + d.amount + "d" + d.sides + "\"";
    };
    Stringify.prototype.embraced = function (e) {
        return "(" + e.expression.visit(this) + ")";
    };
    Stringify.prototype.propertyAccess = function (p) {
        return "[" + p.object.visit(this) + " . \"" + p.propertyname + "\"]";
    };
    Stringify.prototype.call = function (c) {
        var _this = this;
        return "[" + c.object.visit(this) + " (" + c.arguments.map(function (arg) { return arg.visit(_this); }).join(', ') + ")]";
    };
    Stringify.prototype.const = function (c) {
        return "<" + c.name + ">";
    };
    Stringify.prototype.list = function (l) {
        var _this = this;
        return "[list " + l.items.map(function (item) { return item.visit(_this); }).join(', ') + "]";
    };
    Stringify.prototype.with = function (w) {
        var _this = this;
        return "[with " + w.expression.visit(this) + " " + w.bindings.map(function (b) { return b.name + " = " + b.expression.visit(_this); }).join(', ') + "]";
    };
    return Stringify;
}());
