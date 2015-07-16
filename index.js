var inherits = require('inherits');
var Transform = require('readable-stream/transform');
var defined = require('defined');

module.exports = Unpack;
inherits(Unpack, Transform);

var STOP = 1;
var START = 2;
var BYTE = 3;

function Unpack (opts) {
    if (!(this instanceof Unpack)) return new Unpack(opts);
    if (!opts) opts = {};
    Transform.call(this, opts);
    this._state = STOP;
    this._nbit = 0;
    this._byte = 0;
    this._index = 0;
    this._polarity = defined(opts.polarity, 1);
    this._output = Buffer(256);
}

Unpack.prototype._transform = function (buf, enc, next) {
    this._index = 0;
    for (var i = 0; i < buf.length; i++) {
        for (var j = 0; j < 8; j++) {
            var x = (buf[i] >> j) & 1;
            this._tick(x);
        }
    }
    if (this._index > 0) {
        this.push(Buffer(this._output.slice(0, this._index)));
    }
    next();
};

Unpack.prototype._tick = function (x) {
    if (this._polarity < 0) x = 1-x;
    if (this._state === STOP && x === 1) {
        // still stopped
    }
    else if (this._state === STOP && x === 0) {
        // stop -> start transition
        this._state = START;
    }
    else if (this._state === START) {
        this._state = BYTE;
        this._nbit = 7;
        this._byte = x;
    }
    else if (this._state === BYTE) {
        this._byte += x << (8-this._nbit);
        if (--this._nbit === 0) {
            this._output[this._index++] = this._byte;
            if (this._index === this._output.length) {
                this.push(Buffer(this._output));
                this._index = 0;
            }
            this._state = STOP;
        }
    }
};
