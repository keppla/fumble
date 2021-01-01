"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.DiceTab = function (props) { return (React.createElement("section", { id: "dice" },
    React.createElement("p", null,
        React.createElement("textarea", { id: "main", placeholder: "e.g. 3w6 + 2", value: props.dicecode, onChange: function (evt) { return props.onDicecodeChange(evt.target.value); } })),
    React.createElement("p", null, [4, 6, 8, 10, 12, 20, 100].map(function (sides) {
        return React.createElement("button", { onClick: function (evt) { return props.onDiceAdd("w" + sides); } },
            React.createElement("span", { className: "die d" + sides }, "+"));
    })),
    React.createElement("p", null,
        React.createElement("button", { className: "action", onClick: function (evt) { return props.onDicecodeChange(''); } }, "Clear"),
        React.createElement("button", { className: "action", onClick: function (evt) { return props.onTabChange('throw'); } }, "Roll")))); };
