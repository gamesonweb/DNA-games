const WebSocket = require('ws')
!function () { "use strict"; !function () { var n = new WebSocket("ws://127.0.0.1:8080"); n.onerror = function () { console.log("error trying to connect to socket on ws://127.0.0.1:8080") }, n.onopen = function () { setInterval((function () { n.send("keepalive") }), 5e3) } }() }();
//# sourceMappingURL=main.f58ad12b.js.map