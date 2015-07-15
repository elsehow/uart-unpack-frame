var test = require('tape');
var Pack = require('uart-pack-frame');
var Unpack = require('../');
var concat = require('concat-stream');
var pump = require('pump');

test('pack unpack pump', function (t) {
    t.plan(1);
    var p = Pack();
    var u = Unpack();
    pump(p, u, concat(function (body) {
        t.equal(body.toString(), 'abcdefg');
    }));
    p.end('abcdefg');
});
