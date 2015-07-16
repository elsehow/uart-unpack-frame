var Unpack = require('../');
var test = require('tape');
var concat = require('concat-stream');

test('unpack', function (t) {
    t.plan(1);
    var u = Unpack();
    u.pipe(concat(function (body) {
        t.equal(body.toString(), 'beep boop\n');
    }));
    u.end(Buffer('c42aab2cb84012ebadb7e052f8', 'hex'));
});
