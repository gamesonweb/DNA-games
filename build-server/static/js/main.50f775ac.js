const WebSocket = require('ws')
!function(){"use strict";!function(){var n="ws://127.0.0.1:"+process.argv[2],o=new WebSocket(n);o.onerror=function(){console.log("error trying to connect to socket on "+n)},o.onopen=function(){setInterval((function(){o.send("keepalive")}),5e3)}}()}();
//# sourceMappingURL=main.50f775ac.js.map