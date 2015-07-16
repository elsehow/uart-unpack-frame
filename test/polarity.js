var unpack = require('../');
var test = require('tape');
var concat = require('concat-stream');

test('polarity', function (t) {
    t.plan(1);
    var u = unpack({ polarity: -1 });
    u.pipe(concat(function (body) {
        t.equal(body.toString(), 'beep boop\n');
    }));
    u.end(Buffer('3bd554d347bfed1452481fad07', 'hex'));
});
