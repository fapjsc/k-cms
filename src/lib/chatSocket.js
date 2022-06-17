// import { w3cwebsocket as W3CWebsocket } from 'websocket';
import ReconnectingWebSocket from "reconnecting-websocket";

// Redux
import { store } from "../store/store";

// Actions
import {
  setMessageList,
  setUnreadMessageCount,
} from "../store/actions/messageActions";
import { setChatSocketStatus } from "../store/actions/socketActions";

// 圖片壓縮
import Resizer from "react-image-file-resizer";

const SERVER = "ws://10.168.192.1:6881/ws_backchat.ashx";

let client;

//** Connect Handle */
export const connectWithChatSocket = () => {
  if (client) {
    client.close();
  }
  client = new ReconnectingWebSocket(SERVER);

  if (client.readyState === 0) {
    store.dispatch(setChatSocketStatus("嘗試連線"));
  }

  // Chat WebSocket
  // 1.建立連接
  client.onopen = (message) => {

    store.dispatch(setChatSocketStatus("連線成功"));
  };

  // 2.收到server回復
  client.onmessage = (message) => {
    const dataFromServer = JSON.parse(message.data);
    store.dispatch(setMessageList(dataFromServer));

    if (dataFromServer.Message_Role !== 2) {
      store.dispatch(setUnreadMessageCount(dataFromServer));
    }
  };

  // 3.關閉連線
  client.onclose = () => {
    store.dispatch(setChatSocketStatus("關閉連線"));
  };

  // 4.錯誤事件
  client.onerror = () => {
    store.dispatch(setChatSocketStatus("發生錯誤"));
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

//** Send Image */
export const sendImg = async (e, token) => {
  try {
    const file = e.target.files[0]; // get image

    if (!file) {
      return;
    }

    const image = await resizeFile(file);

    client.send(
      JSON.stringify({
        Message_Type: 2,
        Message: image,
        token,
      })
    );
  } catch (error) {
    alert(error);
  }
};

// 壓縮圖檔
const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1024,
      1024,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
