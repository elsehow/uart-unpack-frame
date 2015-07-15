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
    Transform.call(this, {
        writableObjectMode: true,
        highWaterMark: defined(opts.highWaterMark, 16)
    });
    this._state = STOP;
    this._nbit = 0;
    this._byte = 0;
    this._polarity = defined(opts.polarity, 1);
    this._output = Buffer(256);
}

Unpack.prototype._transform = function (buf, enc, next) {
    /*
    if (buf.constructor.name === 'Float32Array') {
        var min = 1, max = -1;
        for (var i = 0; i < buf.length; i++) {
            max = Math.max(max, buf[i]);
            min = Math.min(min, buf[i]);
        }
        if (max < 0.02 && min > -0.02) {
            this._state = STOP;
            return next();
        }
        var tmax = 0.75 * max;
        var tmin = 0.75 * min;
        
    }
    */
    
    var index = 0;
    for (var i = 0; i < buf.length; i++) {
        for (var j = 0; j < 8; j++) {
            var x = (buf[i] >> j) & 1;
            if (this._polarity < 0) x = !x;
            
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
                    this._output[index++] = this._byte;
                    if (index >= this._output.length) {
                        this.push(this._output);
                        index = 0;
                    }
                    this._state = STOP;
                }
            }
        }
    }
    if (index > 0) {
        this.push(Buffer(this._output.slice(0, index)));
    }
    process.nextTick(next);
};
