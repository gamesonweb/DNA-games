import { Scene, Vector3 } from "babylonjs";
import { generate_zombie_wave } from "../../indexServer";
import { AvatarFictive } from "../babylon/avatars/avatarFictif";
import { AvatarSoft } from "../babylon/avatars/avatarSoft";
import { receiveContent, serverMessages } from "./connectionSoft";

export let ws: WebSocket;
export let zombie_counter = 0;

export function connect_to_ws_fictive(scene: Scene, player_list: Map<string, AvatarSoft>, night_monster_list: Map<string, AvatarSoft>) {

  var port = "8080"
  var adr = "ws://127.0.0.1:" + port
  ws = new WebSocket(adr);

  ws.onerror = () => {
    console.log("error trying to connect to socket on " + adr);
  };


  //we start our request process when the connection is established
  ws.onopen = () => {

    //ecoute les infos zombie du serveur
    ws.addEventListener('message', function (event) {
      let messageReceived = JSON.parse(event.data);
      switch (messageReceived.route) {

        //logout route: dispose player's avatar, remove player's entry in the player_list map
        case serverMessages.LOGOUT: {
          let avatar_to_disconnect = player_list.get(messageReceived.content);
          if (avatar_to_disconnect !== undefined) avatar_to_disconnect.dispose();
          player_list.delete(messageReceived.content);
          console.log("LOGIN OUT: " + messageReceived.content);
          break;
        }

        //position: add the player if they aren't in our list yet, move the avatar to the input position
        case serverMessages.POSITION: {
          let messageContent: receiveContent = JSON.parse(messageReceived.content);
          let avatar_to_update = player_list.get(messageContent.username);
          if (avatar_to_update === undefined) {
            player_list.set(messageContent.username, new AvatarFictive(scene, messageContent.username, { currentHealth: messageContent.health }));
            avatar_to_update = player_list.get(messageContent.username);
          }
          if (avatar_to_update) {
            avatar_to_update.position = new Vector3(messageContent.pos_x, messageContent.pos_y, messageContent.pos_z)
          }
          break;
        }

        //kill_monster: kill the monster with passed username
        case serverMessages.KILL_MONSTER: {
          let monster_to_kill = night_monster_list.get(messageReceived.content);
          if (monster_to_kill !== undefined) monster_to_kill.dispose();
          night_monster_list.delete(messageReceived.content);
          break;
        }

        //handle hour event
        case serverMessages.HOUR: {
          let hour = messageReceived.content;
          //tue les monstres de nuit si il fait jour
          if (hour == 7) {
            for (const value of night_monster_list.values()) {
              value.dispose();
            }
            night_monster_list.clear();
            zombie_counter = 0;
          }
          if (hour == 22) {
            generate_zombie_wave()
          }
        }

        //default
        default: { }
      }
    })
  }
}

export function setCounter(value: number) {
  zombie_counter = value
}