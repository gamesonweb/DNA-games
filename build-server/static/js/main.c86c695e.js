const WebSocket = require('ws')
!function(){"use strict";!function(){var o=new WebSocket("wss://mmoactiongameserver.herokuapp.com/");o.onerror=function(){console.log("error trying to connect to socket on wss://mmoactiongameserver.herokuapp.com/")},o.onopen=function(){setInterval((function(){o.send("keepalive")}),5e3)}}()}();
//# sourceMappingURL=main.c86c695e.js.map