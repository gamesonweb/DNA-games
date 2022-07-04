use std::{collections::HashMap, fs};

use rand::{distributions::Alphanumeric, Rng};

pub fn generate_random_string() -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(12)
        .map(char::from)
        .collect()
}

pub fn merge(v: &serde_json::Value, fields: &HashMap<String, String>) -> serde_json::Value {
    match v {
        serde_json::Value::Object(m) => {
            let mut m = m.clone();
            for (k, v) in fields {
                m.insert(k.clone(), serde_json::Value::String(v.clone()));
            }
            serde_json::Value::Object(m)
        }
        v => v.clone(),
    }
}

pub fn find_js_file() -> String {
    let mut path = String::from("./static/js/");

    let mut file_name = fs::read_dir(&path).unwrap();

    let res = file_name
        .find(|a| match a {
            Ok(a) => a.path().extension().unwrap().eq("js"),
            Err(err) => panic!("{}", err),
        })
        .unwrap()
        .unwrap()
        .file_name()
        .into_string()
        .unwrap();

    path.push_str(&String::from(&res));
    path
}
