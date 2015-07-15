var test = require('tape');
var Pack = require('uart-pack-frame');
var Unpack = require('../');
var concat = require('concat-stream');

test('below threshold', function (t) {
    t.plan(1);
    var p = Pack();
    var u = Unpack({ threshold: 0.01 });
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

test('above threshold', function (t) {
    t.plan(1);
    var p = Pack();
    var u = Unpack({ threshold: 0.001 });
    u.pipe(concat(function (body) {
        t.notEqual(body.toString(), 'abcdefg');
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
    var fa = new Float32Array(buf.length * 8 * 2);
    for (var i = 0; i < buf.length; i++) {
        for (var j = 0; j < 8; j++) {
            fa[i*16+j*2] = (buf[i]>>j)&1 ? 1 : -1;
            fa[i*16+j*2+1] = (Math.random() * 2 - 1) * 0.01;
        }
    }
    return fa;
}
