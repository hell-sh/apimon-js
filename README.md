# apimon-js

Get [Apimon](https://apimon.de/)'s power in Javascript without a hassle.

- [Examples](https://github.com/hell-sh/apimon-js/tree/master/examples)

## For Websites

    <script src="https://cdn.hell.sh/apimon-js/latest/apimon.js" crossorigin="anonymous"></script>

[Need SRI?](https://cdn.hell.sh/#apimon-js)

## Usage

When using nodejs, you can simply use `npm i apimon` and then `const apimon = require("apimon");`, but you can also run `npm -g i apimon` to have global access to the `apimon` CLI utility, which you might like.

Regardless of NPM or `<script>` tag, you will have access to the `apimon` object which has a function for [every Apimon HTTP API](https://apimon.de/http-apis) except for "Generate QR Code," e.g. `https://apimon.de/ip/arg` = `apimon.ip(arg)`.

All of these functions will return a Promise, which, if resolved, will provide you with an object corresponding to the JSON object that Apimon has returned; however, some objects will have additional values provided exclusively by apimon-js:

- **country**
  - `english_name`
  - `native_name`
- **mc**
  - `initial_name`

Instead of `apimon.`, you can also use `apimon.hi.` to get a humanly-readable `\n`-terminated string in response to these functions.

If an error occured, the Promise will be rejected with the HTTP error code or 0 in the case of a network error. See [Error Handling](https://apimon.de/http-apis#errors) for information on what HTTP error codes mean.
`apimon.hi` also exposes the `errors` object which contains the meanings of some reject codes in English.

Additionally, `apimon.myip()`, `.myipv4()`, and `.myipv6()` functions are also available, which will provide a string rather than an object if resolved.
