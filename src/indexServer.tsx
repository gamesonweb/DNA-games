import { ArcRotateCamera, NullEngine, PointLight, Scene, Vector3 } from "babylonjs";
import { Avatar } from "./clients/babylon/avatars/avatar";
import { avatar_update_from_serveur, receiveContent, serverMessages } from "./clients/connectionWS";
var night_monster_list: Map<string, Avatar> = new Map();

export function main() {

  // var BABYLON = require("../../dist/preview release/babylon.max");
  // var LOADERS = require("../../dist/preview release/loaders/babylonjs.loaders");
  // global.XMLHttpRequest = require('xhr2').XMLHttpRequest;

  var engine = new NullEngine();
  var scene = new Scene(engine);

  var light = new PointLight("Omni", new Vector3(20, 20, 100), scene);

  var camera = new ArcRotateCamera("Camera", 0, 0.8, 100, Vector3.Zero(), scene);

  var port = "8080"
  var adr = "ws://127.0.0.1:" + port
  var ws = new WebSocket(adr);

  ws.onerror = () => {
    console.log("error trying to connect to socket on " + adr);
  };


  //we start our request process when the connection is established
  ws.onopen = () => {

    //ecoute les infos zombie du serveur
    ws.addEventListener('message', function (event) {
      let messageReceived = JSON.parse(event.data);
      switch (messageReceived.route) {

        // monster_data: update the monster's data
        case serverMessages.MONSTER_DATA: {
          let messageContent: receiveContent = JSON.parse(messageReceived.content);
          avatar_update_from_serveur(messageContent, night_monster_list);
          break;
        }

        //kill_monster: kill the monster with passed username
        case serverMessages.KILL_MONSTER: {
          console.log("killing monster " + messageReceived.content);
          let monster_to_kill = night_monster_list.get(messageReceived.content);
          if (monster_to_kill !== undefined) monster_to_kill.dispose();
          night_monster_list.delete(messageReceived.content);
          break;
        }

        //handle hour event
        case serverMessages.HOUR: {
          let hour = messageReceived.content;
          //tue les monstres de nuit si il fait jour
          if (hour > 7 && hour < 22) {
            for (const value of night_monster_list.values()) {
              value.dispose();
            }
            night_monster_list.clear();
          }
        }

        //default
        default: { }
      }
    })


    setInterval(() => {
      for (const value of night_monster_list.values()) {
        console.log(value);
        value.position.x += 0.5;
        ws.send(
          JSON.stringify({
            route: serverMessages.MOVE_MONSTER,
            content: JSON.stringify({ username: value.name, pos_x: value.position.x, pos_y: value.position.y, pos_z: value.position.z })
          }))
      }
    },
      1000)
  }
}
