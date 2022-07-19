import { Axis, Engine, NullEngine, PointLight, Vector3 } from "babylonjs";
import { AvatarFictive } from "./clients/babylon/avatars/avatarFictif";
import { AvatarSoft } from "./clients/babylon/avatars/avatarSoft";
import { distance } from "./clients/babylon/others/tools";
import { SceneFictive } from "./clients/babylon/scene/sceneFictive";
import { ConnectionServer, setCounter, ws, zombie_counter } from "./clients/connection/connectionFictive";
import { position, serverMessages } from "./clients/connection/connectionSoft";
import { windowExists } from "./clients/reactComponents/tools";

var scene: SceneFictive;
var doOne = true

export var canvas: HTMLCanvasElement;

export function main() {
  console.log(123);

  if (doOne) doOne = false
  else return

  var engine: Engine

  if (windowExists()) {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    engine = new Engine(canvas);
    scene = new SceneFictive(engine)
    scene.activeCamera?.attachControl(true)
    new PointLight("Omni", new Vector3(20, 20, 100), scene);
  } else {
    engine = new NullEngine();
    scene = new SceneFictive(engine)
  }


  engine.runRenderLoop(() => {
    ws.night_monster_list.forEach(monster => {
      console.log(monster.position.y);
      monster.applyGravity()
      var direction = monster.getDirection(Axis.Z);
      // monster.moveWithCollisions(direction.scale(monster.speed_coeff));
      monster.moveWithCollisions(direction);
      // monster.position.x += direction.x
      // monster.position.z += direction.z
      // monster.applyGravity();
      monster.setRayPosition()
    })
    scene.render()
  });

  ConnectionServer.setGlobalWebSocket(scene)

  setInterval(() => {
    for (const monster of ws.night_monster_list.values()) {
      var direction = monster.getDirection(Axis.Z);
      if (monster.name == "zombie0") {
        console.log("----------");
        console.log("direction: ", direction);
      }
      monster.moveWithCollisions(direction.scale(monster.speed_coeff * 0.5));
      monster.applyGravity();
      monster.setRayPosition()
    }
  }, 1000 / 60)

  setInterval(() => {
    if (ws.night_monster_list.size > 0) {
      for (const monster of ws.night_monster_list.values()) {
        zombie_apply_AI(monster);
      }
      ws.send(make_pos_list_msg());
    }
  },
    100)
}

function make_pos_list_msg() {
  let message = []
  for (const monster of ws.night_monster_list.values()) {
    message.push(
      JSON.stringify({
        username: monster.name,
        pos_x: monster.position.x,
        pos_y: monster.position.y,
        pos_z: monster.position.z,
        direction: JSON.stringify(monster.getDirection(Axis.Z))
      })
    )
  }
  return JSON.stringify({
    route: serverMessages.MONSTER_POSITION_LIST,
    content: JSON.stringify(message)
  })
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
}

export function generate_zombie_wave() {
  var counter_after_wave = Math.round(Math.random() * 3) + 3 + zombie_counter
  console.log("Generating wave");

  while (zombie_counter < counter_after_wave) {
    spawn_zombie({
      pos_x: zombie_counter + Math.random() * 5,
      pos_y: 1,
      pos_z: zombie_counter + Math.random() * 5
    });
  }
}

function spawn_zombie({ pos_x, pos_y, pos_z }: position) {
  let generated_zombie = new AvatarFictive(scene, "zombie" + zombie_counter);
  generated_zombie.position = new Vector3(pos_x, pos_y, pos_z);
  ws.night_monster_list.set(generated_zombie.name, generated_zombie);
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
  for (var player of ws.player_list.values()) {
    let dist_to_player = distance(monster.position, player.position);
    if (dist_to_player < dist) {
      dist = dist_to_player
      nearest_player = player
    }
  }
  return nearest_player
}
