var test = require('tape');
var concat = require('concat-stream');
var unpack = require('../');
var pack = require('uart-pack-frame');

test('big', function (t) {
    t.plan(1);
    var p = pack();
    var u = unpack();
    var xyz = Buffer(1024).fill('xyz');
    p.write(xyz);
    u.pipe(concat(function (body) {
        t.deepEqual(body, xyz);
    }));
    u.end(p.read(1024 * 10 / 8));
});
