"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
var fumblecode_1 = require("../../src/script/fumblecode");
describe("fumblecode", function () {
    it("can evaluate complex shit", function () {
        expect(evaluateString("a + max(b, 18 + [5, -2].0 - 1) "
            + " with a = 1 * 1, b = 5")).toBe(23);
    });
});
function evaluateString(code) {
    return fumblecode_1.evaluate(fumblecode_1.parse(code), null).asNumber();
}
