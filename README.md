An abstraction for [Apimon](https://apimon.de/)'s HTTP APIs in Javascript.

- [Examples](https://github.com/hell-sh/apimon-js/tree/master/examples)

## For Websites

    <script src="https://cdn.hell.sh/apimon-js/latest/apimon.js" crossorigin="anonymous"></script>

[Need SRI?](https://cdn.hell.sh/#apimon-js)

## Error Handling

Because apimon-js is Promise-oriented, the Promise will be rejected with the standard Apimon error object of `error` and `got`, but in addition to `INVALID_ARGUMENT` and `INVALID_ARGUMENT_COUNT`, you might also find `NETWORK_ERROR` and `INVALID_STATUS` to be the value of `error` using apimon-js.
