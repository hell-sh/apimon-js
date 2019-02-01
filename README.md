# apimon-js

An abstraction for [Apimon](https://apimon.de/)'s HTTP APIs in Javascript.

- [Examples](https://github.com/hell-sh/apimon-js/tree/master/examples)

## For Websites

    <script src="https://cdn.hell.sh/apimon-js/latest/apimon.js" crossorigin="anonymous"></script>

[Need SRI?](https://cdn.hell.sh/#apimon-js)

## Usage

Once you have included apimon-js either via `const apimon = require("apimon");` or the HTML tag seen above, you can access `apimon` which has a function for [every Apimon HTTP API](https://apimon.de/http-apis) (except for "Generate QR Code"), e.g. `https://apimon.de/ip/arg` = `apimon.ip(arg)`.

Additionally, `apimon.myip()`, `.myipv4()`, and `.myipv6()` functions are available.

All functions will return a Promise, and your resolve and reject functions will be provided with an object, unless it's the resolve function to one of the IP functions, which will return the IP address in plain text.

Some objects will have additional values provided exclusively by apimon-js:

- **country**
  - `english_name`
  - `native_name`
- **mc**
  - `initial_name`

If an error occured, the Promise will be rejected with the HTTP error code or 0 in the case of a network error. See [Error Handling](https://apimon.de/http-apis#errors) for information on what HTTP error codes mean.
