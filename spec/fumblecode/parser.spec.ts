
import 'jasmine';
import {parse} from '../../src/script/fumblecode';
import {NodeVisitor, PropertyAccess, Number, Operation, Const, List, Dice, Embraced, Call, With} from '../../src/script/fumblecode/ast';


describe("the fumblecode parser", () => {

    it("undestands simple numbers", () => {
        expect(evaluate("23")).toBe('"23"');
        expect(evaluate("-42")).toBe('"-42"')
    });

    it("undestands dice codes", () => {
        expect(evaluate("5w6")).toBe('"5d6"');
        expect(evaluate("10D20")).toBe('"10d20"');
    });

    it("undestands basic operators", () => {
        expect(evaluate("1 + 2")).toBe('["1" + "2"]');
        expect(evaluate("1 - 2")).toBe('["1" - "2"]');
        expect(evaluate("1 * 2")).toBe('["1" * "2"]');
        expect(evaluate("1 / 2")).toBe('["1" / "2"]');
    });

    it("undestands basic comparisions", () => {
        expect(evaluate("1 < 2")).toBe('["1" < "2"]');
        expect(evaluate("1 <= 2")).toBe('["1" <= "2"]');
        expect(evaluate("1 > 2")).toBe('["1" > "2"]');
        expect(evaluate("1 >= 2")).toBe('["1" >= "2"]');
        expect(evaluate("1 = 2")).toBe('["1" = "2"]');
    });

    it("understands constants", () => {
        expect(evaluate('const')).toBe('<const>');
    });

    it("understands function calls", () => {
        expect(evaluate("func()")).toBe('[<func> ()]');
        expect(evaluate("func(1, 2)")).toBe('[<func> ("1", "2")]');
    });

    it("understands lists", () => {
        expect(evaluate("[]")).toBe('[list ]');
        expect(evaluate("[1]")).toBe('[list "1"]');
        expect(evaluate("[1, 2, 3]")).toBe('[list "1", "2", "3"]');
    });

    it("understands properties", () => {
        expect(evaluate("-1.abs")).toBe('["-1" . "abs"]');
        expect(evaluate("-1.abs.sign")).toBe('[["-1" . "abs"] . "sign"]');
        expect(evaluate("[].0")).toBe('[[list ] . "0"]');
    });

    it("respects operator precedence", () => {
        expect(evaluate("1 + 2 * 3 + 4")).toBe('[["1" + ["2" * "3"]] + "4"]');
    });

    it("respects parenthesises", () => {
        expect(evaluate("(1 + 2) * (3 + 4)")).toBe('[(["1" + "2"]) * (["3" + "4"])]');
    });

    it("has left-associative operators", () => {
        expect(evaluate("3 - 2 - 1")).toBe('[["3" - "2"] - "1"]');
    });

    it("understands 'with' scopes", () => {
        expect(evaluate("a with a = 1")).toBe('[with <a> a = "1"]');
        expect(evaluate("a with a = 1, b = 2")).toBe('[with <a> a = "1", b = "2"]');
        expect(evaluate("a with a = 1, b = c with c = 3")).toBe('[with <a> a = "1", b = [with <c> c = "3"]]');
    });

    it("can parse complex shit", () => {
        expect(evaluate("(3w6 + (-3 / -1).abs + 1) * -23 + (5w6 - -3)"))
            .toBe('[[([["3d6" + [(["-3" / "-1"]) . "abs"]] + "1"]) * "-23"] + (["5d6" - "-3"])]')
    });
});


function evaluate(text: string): string {
    return parse(text).visit(new Stringify());
}


class Stringify implements NodeVisitor<string> {
    number(n: Number): string {
        return `"${n.value}"`;
    }
    operation(o: Operation): string {
        return `[${o.left.visit(this)} ${o.op} ${o.right.visit(this)}]`;
    }
    dice(d: Dice): string {
        return `"${d.amount}d${d.sides}"`;
    }
    embraced(e: Embraced): string {
        return `(${e.expression.visit(this)})`;
    }
    propertyAccess(p: PropertyAccess): string {
        return `[${p.object.visit(this)} . "${p.propertyname}"]`;
    }
    call(c: Call): string {
        return `[${c.object.visit(this)} (${c.arguments.map(arg => arg.visit(this)).join(', ')})]`;
    }
    const(c: Const): string {
        return `<${c.name}>`;
    }
    list(l: List): string {
        return `[list ${l.items.map(item => item.visit(this)).join(', ') }]`;
    }
    with(w: With): string {
        return `[with ${w.expression.visit(this)} ${w.bindings.map(b => `${b.name} = ${b.expression.visit(this)}`).join(', ')}]`;
    }
}
