import 'jasmine';
import {evaluate, parse} from '../../src/script/fumblecode';


describe("fumblecode", () => {
    it("can evaluate complex shit", () => {
        expect(evaluateString("a + max(b, 18 + [5, -2].0 - 1) "
                                  + " with a = 1 * 1, b = 5")).toBe(23)
    });
});


function evaluateString(code: string): number {
    return evaluate(parse(code), null).asNumber();
}
