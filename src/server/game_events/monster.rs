use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use rand::Rng;

use crate::{MonsterData, MonsterList};

pub fn monster_nightstart_factory(
    monster_list: Arc<Mutex<HashMap<String, MonsterData>>>,
    zombie_counter: &mut i32,
) {
    let health = 100;

    let mut rand_generator = rand::thread_rng();
    let number_zombies = rand_generator.gen_range(3..5);

    while *zombie_counter < number_zombies {
        monster_spawner(
            ((*zombie_counter) as f32 - rand_generator.gen_range(0.0..3.0)) * 2.0,
            1.0,
            ((*zombie_counter) as f32 - rand_generator.gen_range(0.0..3.0)) * 2.0,
            String::from("zombie"),
            String::from(
                r#" {\"_isDirty\":true,\"_x\":0.23749832808971405,\"_y\":0,\"_z\":0.9713879227638245} "#,
            ),
            health,
            monster_list.clone(),
            zombie_counter,
        );
    }
}

pub fn monster_spawner(
    pos_x: f32,
    pos_y: f32,
    pos_z: f32,
    username: String,
    direction: String,
    health: i16,
    monster_list: MonsterList,
    counter: &mut i32,
) {
    //create monster's data
    let monster_data = MonsterData {
        pos_x,
        pos_y,
        pos_z,
        username: format!("{}{}", username, counter), //String::from("zombie"),
        direction, // String::from(r#" {\"_isDirty\":true,\"_x\":0.23749832808971405,\"_y\":0,\"_z\":0.9713879227638245} "#,),
        health,
        max_health: health.clone(),
    };

    //push it into the monster list
    let mut monster_list = monster_list.lock().unwrap();
    monster_list.insert(monster_data.username.clone(), monster_data);
    *counter += 1;
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
