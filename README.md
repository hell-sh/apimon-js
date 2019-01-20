An abstraction for [Apimon](https://apimon.de/)'s HTTP APIs in Javascript.

- <a href="https://github.com/hell-sh/apimon-js/tree/master/examples" target="_blank">Examples</a>

## For Websites

    <script src="https://cdn.hell.sh/apimon-js/latest/apimon.js" crossorigin="anonymous"></script>

<a href="https://cdn.hell.sh/#apimon-js" target="_blank">Need SRI?</a>

## Usage

Once you have included apimon-js either via `const apimon = require("apimon");` or the HTML tag seen above, you can access `apimon` which has a function for each of the [Apimon HTTP APIs](https://apimon.de/http-apis) mapped (except for "Generate QR Code"), e.g. `https://apimon.de/ip/arg` = `apimon.ip(arg)`.

Additionally, `apimon.myip()`, `.myipv4()`, and `.myipv6()` functions are available.

All functions will return a Promise, and your resolve and reject functions will be provided with an object, unless it's the resolve function to one of the IP functions, which will return the IP address in plain text.

Some objects will have additional values provided exclusively by apimon-js:

- **country** (including country fields in ip lookup responses)
  - `english_name`
  - `native_name`
- **mc**
  - `initial_name`

### Error Handling

If an error occured, the Promise will be rejected with the standard Apimon error object of `error` and `got`, but in addition to `INVALID_ARGUMENT` and `INVALID_ARGUMENT_COUNT`, you might also find `NETWORK_ERROR` and `INVALID_STATUS` to be the value of `error` using apimon-js.
