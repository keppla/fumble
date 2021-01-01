"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XorShiftNumberGenerator = (function () {
    function XorShiftNumberGenerator(seed) {
        this.state = new Uint32Array(1);
        this.state[0] = seed;
    }
    XorShiftNumberGenerator.prototype.next = function () {
        this.state[0] ^= this.state[0] << 13;
        this.state[0] ^= this.state[0] >> 17;
        this.state[0] ^= this.state[0] << 5;
    };
    XorShiftNumberGenerator.prototype.int = function (min, max) {
        this.next();
        return min + this.state[0] % (1 + max - min);
    };
    return XorShiftNumberGenerator;
}());
exports.XorShiftNumberGenerator = XorShiftNumberGenerator;
