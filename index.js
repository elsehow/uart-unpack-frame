var inherits = require('inherits');
var Transform = require('readable-stream/transform');
var defined = require('defined');

module.exports = Unpack;
inherits(Unpack, Transform);

var ZERO = 0;
var STOP = 1;
var START = 2;
var BYTE = 3;

function Unpack (opts) {
    if (!(this instanceof Unpack)) return new Unpack(opts);
    Transform.call(this, { objectMode: true });
    this._state = ZERO;
    this._nbit = 0;
    this._byte = 0;
    this._polarity = defined(opts.polarity, 1);
    this._output = Buffer(256);
}

Unpack.prototype._transform = function (buf, enc, next) {
    var index = 0;
    if (buf.constructor.name === 'Float32Array') {
        var min = 1, max = -1;
        for (var i = 0; i < buf.length; i++) {
            max = Math.max(max, buf[i]);
            min = Math.min(min, buf[i]);
        }
        if (max < 0.02 && min > -0.02) {
            this._state = ZERO;
            return next();
        }
        var tmax = 0.75 * max;
        var tmin = 0.75 * min;
        
        for (var i = 0; i < buf.length; i++) {
            var xr = buf[i] * this._polarity;
            var x = 0;
            if (xr > tmax) x = 1;
            else if (xr < tmin) x = -1;
            
            if (this._state === STOP && x === 1) {
                // still stopped
            }
            else if (this._state === STOP && x === -1) {
                // stop -> start transition
                this._state = START;
            }
            else if (this._state === START && x !== 0) {
                this._state = BYTE;
                this._nbit = 7;
                this._byte = x;
            }
            else if (this._state === BYTE && x !== 0) {
                this._byte += (x > 0 ? 1 : -1) << (8-this._nbit);
                if (--this._nbit === 0) {
                    this._output[index++] = this._byte;
                    this._state = STOP;
                }
            }
        }
    }
    else {
        throw new Error('unhandled input type');
    }
    if (index > 0) {
        this.push(this._output.slice(0, index));
    }
    next();
};
