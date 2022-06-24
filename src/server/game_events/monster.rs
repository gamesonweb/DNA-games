use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use crate::{Direction, MonsterData, MonsterList};

pub fn monster_spawner(
    pos_x: f32,
    pos_y: f32,
    pos_z: f32,
    username: String,
    direction: String,
    health: i16,
    monster_list: MonsterList,
) {
    let direction: Direction = serde_json::from_str(&direction).unwrap();
    //create monster's data
    let monster_data = MonsterData {
        pos_x,
        pos_y,
        pos_z,
        username,
        direction: format!(
            r#" {{\"_isDirty\":{},\"_x\":{},\"_y\":{},\"_z\":{}}} "#,
            direction._isDirty, direction._x, direction._y, direction._z
        ),
        health,
        max_health: health.clone(),
    };

    //push it into the monster list
    let mut monster_list = monster_list.lock().unwrap();
    monster_list.insert(monster_data.username.clone(), monster_data);
}

pub fn clear_all_monsters(
    monster_list: Arc<Mutex<HashMap<String, MonsterData>>>,
    zombie_counter: &mut i32,
) {
    let mut monster_list = monster_list.lock().unwrap();
    monster_list.clear();
    *zombie_counter = 0;
}

pub fn monster_message_data(monster_data: &MonsterData) -> String {
    return format!(
        r#" {{"route": "monster_data", "content": "{{\"pos_x\": {}, \"pos_y\": {}, \"pos_z\": {}, \"username\": \"{}\", \"health\": \"{}\", \"maxHealth\": \"{}\", \"direction\": {}}}"}} "#,
        monster_data.pos_x,
        monster_data.pos_y,
        monster_data.pos_z,
        monster_data.username,
        monster_data.health,
        monster_data.max_health,
        monster_data.direction
    );
}
