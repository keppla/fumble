import 'jasmine';
import './helpers';
import {evaluateAll} from '../../src/script/fumblecode/stats';


describe("the all evaluator", () => {
    it('evaluates non-random expressions', () => {
        let exp = () => "23";
        expect(evaluateAll(exp)).toEqual(['23']);
    });

    it('evaluates one-step random expressions', () => {
        let exp = (gen: any) => gen.int(1, 6);
        expect(evaluateAll(exp).sort()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('evaluates two-step symmetric random expressions', () => {
        let exp = (gen: any) => gen.int(0, 1) + gen.int(0, 1);
        expect(evaluateAll(exp).sort()).toEqual([0, 1, 1, 2]);
    });

    it('evaluates asymetric random expressions', () => {
        let exp = (gen: any) => {
            let r = gen.int(0, 1);
            return r == 0
                 ? 23
                 : gen.int(0, 1);
        }
        expect(evaluateAll(exp).sort()).toEqual([0, 1, 23]);
    });
});
