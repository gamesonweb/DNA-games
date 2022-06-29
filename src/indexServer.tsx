import { ArcRotateCamera, Axis, Camera, Engine, NullEngine, PointLight, Vector3 } from "babylonjs";
import { AvatarFictive } from "./clients/babylon/avatars/avatarFictif";
import { AvatarSoft } from "./clients/babylon/avatars/avatarSoft";
import { distance } from "./clients/babylon/others/tools";
import { sceneFictive } from "./clients/babylon/scene/sceneFictive";
import { connect_to_ws_fictive, setCounter, ws, zombie_counter } from "./clients/connection/connectionFictive";
import { serverMessages } from "./clients/connection/connectionSoft";
import { windowExists } from "./clients/reactComponents/tools";

var night_monster_list: Map<string, AvatarSoft> = new Map();
var player_list: Map<string, AvatarSoft> = new Map();
var scene: sceneFictive;
var doOne = true

export var canvas: HTMLCanvasElement;

export function main() {
  console.log(123);

  if (doOne) doOne = false
  else return

  // var BABYLON = require("../../dist/preview release/babylon.max");
  // var LOADERS = require("../../dist/preview release/loaders/babylonjs.loaders");
  // var XMLHttpRequest = require('xhr2');
  // var xhr = new XMLHttpRequest();

  var engine: Engine
  var camera: Camera

  if (windowExists()) {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    engine = new Engine(canvas);
    scene = new sceneFictive(engine)
    scene.activeCamera?.attachControl(true)
    scene.createGround()
    var light = new PointLight("Omni", new Vector3(20, 20, 100), scene);
  } else {
    engine = new NullEngine();
    scene = new sceneFictive(engine)
    scene.createGround()
    camera = new ArcRotateCamera("Camera", 0, 0.8, 15, Vector3.Zero(), scene);
  }


  engine.runRenderLoop(() => scene.render());

  connect_to_ws_fictive(scene, player_list, night_monster_list)

  // engine.runRenderLoop(function () {
  //   if (scene && scene.activeCamera) {
  //     for (const monster of night_monster_list.values()) {
  //       //scene.applyGravity(monster);
  //       monster.moveWithCollisions(monster.getDirection(Axis.Z).scale(monster.speed_coeff));
  //       console.log("monster " + monster.name + " pos: " + monster.position);
  //     }
  //   }
  // });

  setInterval(() => {
    for (const monster of night_monster_list.values()) {
      // monster.moveWithCollisions(monster.getDirection(Axis.Z).scale(monster.speed_coeff));
      monster.applyGravity();
      monster.setRayPosition()
    }
  }, 1000 / 60)

  setInterval(() => {
    for (const monster of night_monster_list.values()) {
      zombie_apply_AI(monster);
    }
  },
    100)
}


function zombie_apply_AI(monster: AvatarSoft) {
  let player_to_target: AvatarSoft | null = nearest_player(monster);
  if (player_to_target) {
    monster.lookAt(new Vector3(player_to_target.position.x, monster.position.y, player_to_target.position.z));
    if (distance(monster.position, player_to_target.position) < 2) {
      ws.send(
        JSON.stringify({
          route: serverMessages.MONSTER_HIT,
          content: JSON.stringify({
            username: monster.name,
            hitmode: 0
          })
        })
      )
    }
  }
  monster.computeWorldMatrix(true);
  // monster.position.x += monster.getDirection(Axis.Z)._x
  // monster.position.z += monster.getDirection(Axis.Z)._z
  monster.moveWithCollisions(monster.getDirection(Axis.Z).scale(monster.speed_coeff * 6))
  ws.send(
    JSON.stringify({
      route: serverMessages.MOVE_MONSTER,
      content: JSON.stringify({
        username: monster.name,
        pos_x: monster.position.x,
        pos_y: monster.position.y,
        pos_z: monster.position.z,
        direction: JSON.stringify(monster.getDirection(Axis.Z))
      })
    }))
  if (monster.name === "zombie0")
    console.log("" + monster.name + " : " + monster.position);

}

export function generate_zombie_wave() {
  var counter_after_wave = Math.round(Math.random() * 3) + 3 + zombie_counter

  while (zombie_counter < counter_after_wave) {
    spawn_zombie(zombie_counter + Math.random() * 5, 1, zombie_counter + Math.random() * 5);
  }
}

function spawn_zombie(pos_x: number, pos_y: number, pos_z: number) {
  let generated_zombie = new AvatarFictive(scene, "zombie" + zombie_counter);
  generated_zombie.position = new Vector3(pos_x, pos_y, pos_z);
  night_monster_list.set(generated_zombie.name, generated_zombie);
  generated_zombie.computeWorldMatrix(true);
  ws.send(JSON.stringify({
    route: serverMessages.SPAWN_MONSTER,
    content: JSON.stringify({
      pos_x: generated_zombie.position.x,
      pos_y: generated_zombie.position.y,
      pos_z: generated_zombie.position.z,
      username: generated_zombie.name,
      direction: JSON.stringify(generated_zombie.getDirection(Axis.Z)),
      health: generated_zombie.currentHealth,
    })
  }))
  setCounter(zombie_counter + 1)
}

function nearest_player(monster: AvatarSoft) {
  var nearest_player: AvatarSoft | null = null;
  var dist = Infinity
  for (var player of player_list.values()) {
    let dist_to_player = distance(monster.position, player.position);
    if (dist_to_player < dist) {
      dist = dist_to_player
      nearest_player = player
    }
  }
  return nearest_player
}
