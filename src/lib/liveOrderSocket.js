// import { w3cwebsocket as W3CWebsocket } from 'websocket';
import ReconnectingWebSocket from "reconnecting-websocket";

// Redux
import { store } from "../store/store";

// Actions
import { setLiveOrderList } from "../store/actions/liveOrderAction";
import { setLiveOrderSocketStatus } from "../store/actions/socketActions";
import { setAlertItem } from "../store/actions/alertActions";

const SERVER = "ws://10.168.192.1:6881/ws_liveorder.ashx";

let client;

// let tmp;

//** Connect Handle */
export const connectWithLiveOrderSocket = () => {
  if (client) {
    client.close();
  }
  client = new ReconnectingWebSocket(SERVER);
  // console.log("try connection");
  store.dispatch(setLiveOrderSocketStatus("嘗試連線"));

  // 1.建立連接
  client.onopen = (message) => {
    // console.log("Chat room client connected");
    store.dispatch(setLiveOrderSocketStatus("連線成功"));
  };

  // 2.收到server回復
  client.onmessage = (message) => {
    const dataFromServer = JSON.parse(message.data);
    // console.log("got order reply!", dataFromServer);

    store.dispatch(setLiveOrderList(dataFromServer));
    store.dispatch(setAlertItem(dataFromServer));

    // 未讀訊息, 以token為key
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key === "order") return;

      const arr = Object.values(dataFromServer)?.map((el) => el.token);

      if (key === "note") {
        const noteObj = JSON.parse(localStorage.getItem("note"));

        Object.keys(noteObj)?.forEach((el) => {
          if (!arr.includes(el)) {
            delete noteObj[el];
          }
        });

        localStorage.setItem("note", JSON.stringify(noteObj));

        return;
      }

      if (!arr.includes(key)) {
        localStorage.removeItem(key);
      }
    }
  };

  // 3.錯誤處理
  client.onclose = () => {
    console.log("關閉連線");
    store.dispatch(setLiveOrderSocketStatus("關閉連線"));
  };

  client.onerror = () => {
    // console.log("Connection Error");
    store.dispatch(setLiveOrderSocketStatus("發生錯誤"));
  };
};

//** Send Message */
export const sendMessage = (value, token) => {
  if (value === "" || !token) {
    alert("沒有token");
    return;
  }

  client.send(
    JSON.stringify({
      Message_Type: 1,
      Message: value.toString(),
      token,
    })
  );
};
