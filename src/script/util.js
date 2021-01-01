"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function range(start, end) {
    var result = [];
    for (var i = start; i < end; i += 1) {
        result.push(i);
    }
    return result;
}
exports.range = range;
