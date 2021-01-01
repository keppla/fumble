"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
require("./helpers");
var stats_1 = require("../../src/script/fumblecode/stats");
describe("the all evaluator", function () {
    it('evaluates non-random expressions', function () {
        var exp = function () { return "23"; };
        expect(stats_1.evaluateAll(exp)).toEqual(['23']);
    });
    it('evaluates one-step random expressions', function () {
        var exp = function (gen) { return gen.int(1, 6); };
        expect(stats_1.evaluateAll(exp).sort()).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it('evaluates two-step symmetric random expressions', function () {
        var exp = function (gen) { return gen.int(0, 1) + gen.int(0, 1); };
        expect(stats_1.evaluateAll(exp).sort()).toEqual([0, 1, 1, 2]);
    });
    it('evaluates asymetric random expressions', function () {
        var exp = function (gen) {
            var r = gen.int(0, 1);
            return r == 0
                ? 23
                : gen.int(0, 1);
        };
        expect(stats_1.evaluateAll(exp).sort()).toEqual([0, 1, 23]);
    });
});
