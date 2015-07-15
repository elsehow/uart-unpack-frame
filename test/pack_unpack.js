var test = require('tape');
var Pack = require('uart-pack-frame');
var Unpack = require('../');
var concat = require('concat-stream');

test('pack unpack pipe', function (t) {
    t.plan(1);
    var p = Pack();
    var u = Unpack();
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
