var test = require('tape');
var pack = require('uart-pack-frame');
var unpack = require('../');
var concat = require('concat-stream');

test('pack unpack', function (t) {
    t.plan(1);
    var p = pack();
    var u = unpack();
    u.pipe(concat(function (body) {
        t.equal(body.toString(), 'abcdefg');
    }));
    p.write('abc');
    u.write(p.read(5));
    u.write(p.read(5));
    p.write('def');
    u.write(p.read(1));
    p.write('g');
    u.write(p.read(5));
    u.write(p.read(5));
    u.write(p.read(5));
    u.end();
});
