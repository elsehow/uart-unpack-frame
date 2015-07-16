# uart-unpack-frame

unpack
[UART](https://en.wikipedia.org/wiki/Universal_asynchronous_receiver/transmitter#Data_framing)
data used for serial communication

# example

``` js
var Unpack = require('uart-unpack-frame');
var u = Unpack();
u.write(Buffer('c42aab2cb84012ebadb7e052f8', 'hex'));
u.pipe(process.stdout);
```

output:

```
beep boop
```

# api

``` js
var unpack = require('uart-unpack-frame')
```

## var u = unpack(opts)

Create an unpack transform stream `u` to decode uart serial data.

* `opts.polarity` - set to `-1` to flip the polarity. default: 1

# install

With [npm](https://npmjs.org) do:

```
npm install uart-unpack-frame
``

# license

MIT
