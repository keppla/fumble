"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var react_router_dom_1 = require("react-router-dom");
var dicetab_1 = require("./dicetab");
var statstab_1 = require("./statstab");
var throwtab_1 = require("./throwtab");
exports.App = function (props) { return (React.createElement("div", null,
    React.createElement("nav", { id: "mainnav" },
        React.createElement("button", { onClick: props.onChangeTab('dice'), className: 'dice ' + props.activeTab === 'dice' ? 'active' : '' }, "dice"),
        React.createElement("button", { onClick: props.onChangeTab('throw'), className: 'dice ' + props.activeTab === 'throw' ? 'active' : '' }, "throw"),
        React.createElement("button", { onClick: props.onChangeTab('stats'), className: 'stats ' + props.activeTab === 'stats' ? 'active' : '' }, "stats")),
    React.createElement(react_router_dom_1.HashRouter, null,
        React.createElement("main", null,
            React.createElement(react_router_1.Route, { path: "/:code/dice", component: dicetab_1.DiceTab }),
            React.createElement(react_router_1.Route, { path: "/:code/throw", component: throwtab_1.ThrowTab }),
            React.createElement(react_router_1.Route, { path: "/:code/stat", component: statstab_1.StatsTab }))))); };
