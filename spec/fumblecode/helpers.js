"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
function aFumbleNumber(expected) {
    return {
        asymmetricMatch: function (actual) { return actual.asNumber && actual.asNumber() === expected; },
    };
}
exports.aFumbleNumber = aFumbleNumber;
function aFumbleList(expected) {
    return {
        asymmetricMatch: function (actual) {
            return actual.items
                && actual.items.every(function (item, index) { return item.asNumber() === expected[index]; });
        }
    };
}
exports.aFumbleList = aFumbleList;
