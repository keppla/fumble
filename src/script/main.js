"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/fn/array/find");
var knockout_1 = require("knockout");
var chart_js_1 = require("chart.js");
var fumblecode_1 = require("./fumblecode");
var lib_1 = require("./lib");
function routePart(url, index, defaults) {
    return knockout_1.pureComputed({
        read: function () {
            var fragments = url().split('/');
            return fragments[index] || defaults[index];
        },
        write: function (value) {
            var fragments = url().split('/');
            if (fragments.length - 1 < index) {
                fragments = fragments.concat(defaults.slice(fragments.length));
            }
            fragments[index] = value;
            location.hash = '#' + fragments.join('/');
        }
    });
}
var Model = (function () {
    function Model() {
        var _this = this;
        this.url = knockout_1.observable(location.hash.slice(1));
        var defaults = ['', '0', 'dice'];
        this.dicecode = routePart(this.url, 0, defaults);
        this.seed = routePart(this.url, 1, defaults);
        this.tab = routePart(this.url, 2, defaults);
        this.expression = knockout_1.pureComputed(function () {
            try {
                return fumblecode_1.parse(_this.dicecode());
            }
            catch (err) {
                console.log("could not parse", err);
                return null;
            }
        });
        this.stats = knockout_1.pureComputed(function () {
            return (_this.expression() === null)
                ? []
                : fumblecode_1.possibilities(_this.expression());
        });
        this.result = knockout_1.pureComputed(function () {
            var exp = _this.expression();
            if (exp === null) {
                return [];
            }
            var seed = parseInt(_this.seed());
            return fumblecode_1.display(exp, new lib_1.XorShiftNumberGenerator(seed)).concat([
                {
                    type: 'operator',
                    value: '='
                }, {
                    type: 'number',
                    value: fumblecode_1.evaluate(exp, new lib_1.XorShiftNumberGenerator(seed)).toString()
                }
            ]);
        });
        window.addEventListener('hashchange', function (evt) {
            _this.url(evt.newURL.replace(/^.*#/, ''));
        });
    }
    Model.prototype.roll = function () {
        this.seed(Math.round(Math.random() * Math.pow(2, 32) - 1).toString());
    };
    Model.prototype.dice_adder = function (code) {
        var _this = this;
        return function () {
            var d = _this.dicecode;
            d((d().trim() === '' ? '' : d() + ' + ') + code);
        };
    };
    Model.prototype.tab_setter = function (value) {
        var _this = this;
        return function () { _this.tab(value); };
    };
    Model.prototype.clear_code = function () {
        this.dicecode('');
    };
    return Model;
}());
var charts = [];
knockout_1.bindingHandlers['chart'] = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var incidences = knockout_1.unwrap(valueAccessor());
        var chart = new chart_js_1.Chart(element, {
            type: 'bar',
            data: {
                labels: incidences.map(function (inc) { return inc.value; }),
                datasets: [{
                        data: incidences.map(function (inc) { return inc.percent; }),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
            }
        });
        charts.push(chart);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var chart = charts.find(function (c) { return c.chart.canvas === element; });
        var incidences = knockout_1.unwrap(valueAccessor());
        var data = chart.data;
        data.datasets[0].data = incidences.map(function (inc) { return inc.percent; });
        data.labels = incidences.map(function (inc) { return inc.value; });
        chart.update();
    }
};
knockout_1.applyBindings(new Model());
