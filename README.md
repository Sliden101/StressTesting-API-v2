## StressTesting API
Rewrite of previous api script.

Welcome to the StressTesting API! This API provides a simple, easy-to-use interface for performing stress testing operations on a given host/port.

It has a single endpoint, `/ddos`, that is accessible via a POST request. The body of the POST request should include 4 values:

- `host`: the hostname or IP address of the target host
- `port`: the port of the target host
- `time`: the duration of the test in milliseconds
- `method`: the type of request to use during the test

The result of the request will inform the user of the success or failure of the stress test.

Don't forget to setup your authentication key in config.json along with the rest of the info.

Thanks for using StressTesting API!
