use serde_json::json;
use tokio::time::{sleep, Duration};
use tungstenite::protocol::Message;

use crate::{PeerMap, PositionUpdates, SharedMessages};

//Function in charge of broadcasting every second
pub async fn broadcast(
    peer_map: PeerMap,
    shared_messages: SharedMessages,
    position_list: PositionUpdates,
) {
    loop {
        //broadcast every 50 ms
        sleep(Duration::from_millis(50)).await;

        //build the vector of all positions messages in the players' position map
        let mut list_positions_send = vec![];
        {
            let position_map = position_list.lock().unwrap();
            for (_, value) in &*position_map {
                list_positions_send.push(value.clone());
            }
        }
        //create the message of the list of positions to update
        let position_update_list = format!(
            r#" {{"route": "position_player_list", "content": {}}} "#,
            json!(list_positions_send)
        );

        //lock to create the iterator on messages
        let mut messages = shared_messages.lock().unwrap();
        let message_list = messages.iter();
        //lock the needed list of players (real of AI) to broadcast to
        let peers = peer_map.lock().unwrap();
        let broadcast_recipients = peers.iter().map(|(_, ws_sink)| ws_sink);

        //broadcast to every players (real or AI)
        for recp in broadcast_recipients {
            //send every message in the message stack to the player
            for msg in message_list.clone() {
                recp.unbounded_send(msg.clone()).unwrap();
            }

            //send the previously built position list message to the player
            recp.unbounded_send(Message::from(position_update_list.clone()))
                .unwrap();
        }

        //empty the message stack
        messages.clear();
    }
}
