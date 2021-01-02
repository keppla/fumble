
import {Node} from './index';

declare namespace Parser {
    export function SyntaxError(): any;
    export function parse(): Node;
}

export = Parser;
