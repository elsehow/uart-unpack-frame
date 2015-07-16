var Unpack = require('../');
var u = Unpack();
u.write(Buffer('c42aab2cb84012ebadb7e052f8', 'hex'));
u.pipe(process.stdout);
