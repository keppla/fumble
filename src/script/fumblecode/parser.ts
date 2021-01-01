import {parse as _parse} from './grammar';
import {Call, Const, Dice, Embraced, List, Node, Number, Operation, PropertyAccess, With} from './ast';

let context = {
    List,
    Number,
    Dice,
    Operation,
    Embraced,
    PropertyAccess,
    Call,
    Const,
    With,
    asInt: (letters: string[]) => parseInt(letters.join(''))
};

export function parse(source: string): Node {
    return _parse.apply(context, [source]);
}
