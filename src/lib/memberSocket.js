// import { w3cwebsocket as W3CWebsocket } from 'websocket';
import ReconnectingWebSocket from "reconnecting-websocket";

// Redux
import { store } from "../store/store";

// Actions
import { setMemberList } from "../store/actions/memberActions";

const SERVER = "ws://10.168.192.1:6881/ws_UserBalance.ashx";

let client;

//** Connect Handle */
export const connectWithMemberSocket = () => {
  if (client) {
    client.close();
  }
  client = new ReconnectingWebSocket(SERVER);
  // console.log("try connection");

  // 1.建立連接
  client.onopen = (message) => {
    // console.log("Chat room client connected");
  };

  // 2.收到server回復
  client.onmessage = (message) => {
    const dataFromServer = JSON.parse(message.data);
    console.log("got Chat reply!", dataFromServer);
    store.dispatch(setMemberList(dataFromServer));
  };

  client.onclose = (message) => {
    console.log("關閉連線", message);
  };

  client.onerror = (message) => {
    console.log("連線錯誤", message);
  };
};

export const closeMemberSocket = () => {
  if (client) {
    client.close();
  }
};
