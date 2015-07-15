var test = require('tape');
var Pack = require('uart-pack-frame');
var Unpack = require('../');
var concat = require('concat-stream');

test('pipe delay', function (t) {
    t.plan(1);
    var p = Pack();
    var u = Unpack();
    p.pipe(u).pipe(concat(function (body) {
        t.equal(body.toString(), 'abcdefg');
    }));
    var chunks = [ 'ab', 'c', '', 'defg' ];
    var iv = setInterval(function () {
        if (chunks.length === 0) {
            p.end();
            return clearInterval(iv);
        }
        p.write(chunks.shift());
    }, 100);
});
