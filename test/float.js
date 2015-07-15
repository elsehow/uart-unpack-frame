var test = require('tape');
var Pack = require('uart-pack-frame');
var Unpack = require('../');
var concat = require('concat-stream');

test('float pack unpack', function (t) {
    t.plan(1);
    var p = Pack();
    var u = Unpack();
    u.pipe(concat(function (body) {
        t.equal(body.toString(), 'abcdefg');
    }));
    p.write('abc');
    u.write(tof(p.read(5)));
    u.write(tof(p.read(5)));
    p.write('def');
    u.write(tof(p.read(1)));
    p.write('g');
    u.write(tof(p.read(5)));
    u.write(tof(p.read(5)));
    u.write(tof(p.read(5)));
    u.end();
});

function tof (s) {
    var buf = Buffer(s);
    var fa = new Float32Array(buf.length * 8);
    for (var i = 0; i < buf.length; i++) {
        for (var j = 0; j < 8; j++) {
            fa[i*8+j] = (buf[i]>>j)&1 ? 1 : -1;
        }
    }
    return fa;
}
