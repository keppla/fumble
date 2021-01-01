"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grammar_1 = require("./grammar");
var ast_1 = require("./ast");
var context = {
    List: ast_1.List,
    Number: ast_1.Number,
    Dice: ast_1.Dice,
    Operation: ast_1.Operation,
    Embraced: ast_1.Embraced,
    PropertyAccess: ast_1.PropertyAccess,
    Call: ast_1.Call,
    Const: ast_1.Const,
    With: ast_1.With,
    asInt: function (letters) { return parseInt(letters.join('')); }
};
function parse(source) {
    return grammar_1.parse.apply(context, [source]);
}
exports.parse = parse;
