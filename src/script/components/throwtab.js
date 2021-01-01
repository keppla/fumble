"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.ThrowTab = function (props) { return (
//<span class="die" data-bind="css: {d4: sides === 4, d6: sides === 6, d8: sides === 8, d10: sides === 10, d12: sides === 12, d20: sides === 20}">
//        <span data-bind="text: value">?</span>
//    </span>
React.createElement("section", { id: "throw" },
    React.createElement("p", { className: "formula" }, props.tokens.map(function (token) { return (React.createElement("span", { className: token.type }, token.value)); })),
    React.createElement("p", null,
        React.createElement("button", { onClick: function (evt) { return props.onReroll(); } }, "Reroll")))); };
