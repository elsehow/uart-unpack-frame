var test = require('tape');
var Pack = require('uart-pack-frame');
var Unpack = require('../');
var concat = require('concat-stream');

test('pack unpack pipe', function (t) {
    t.plan(1);
    var p = Pack();
    var u = Unpack();
    p.pipe(u).pipe(concat(function (body) {
        t.equal(body.toString(), 'abcdefg');
    }));
    p.end('abcdefg');
});
