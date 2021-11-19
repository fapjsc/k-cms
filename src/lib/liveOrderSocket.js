// import { w3cwebsocket as W3CWebsocket } from 'websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';

// Redux
import store from '../store/store';

// Actions
// import { setMessageList } from '../store/actions/messageActions';
import { setLiveOrderList } from '../store/actions/liveOrderAction';
import { setLiveOrderSocketStatus } from '../store/actions/socketActions';

const SERVER = 'ws://10.168.192.1:6881/ws_liveorder.ashx';

let client;

//** Connect Handle */
export const connectWithLiveOrderSocket = () => {
  client = new ReconnectingWebSocket(SERVER);
  console.log('try connection');
  console.log(client);
  store.dispatch(setLiveOrderSocketStatus('嘗試連線'));

  // Chat WebSocket
  // 1.建立連接
  client.onopen = message => {
    console.log('Chat room client connected');
    store.dispatch(setLiveOrderSocketStatus('連線成功'));
  };

  // 2.收到server回復
  client.onmessage = message => {
    const dataFromServer = JSON.parse(message.data);
    console.log('got Chat reply!');
    // console.log(dataFromServer);

    store.dispatch(setLiveOrderList(dataFromServer));

    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) !== 'order') {
        const item = dataFromServer.find(el => el.token === localStorage.key(i));
        // console.log(item);

        if (!item) localStorage.removeItem(localStorage.key(i));
      }
    }
  };

  // 3.錯誤處理
  client.onclose = () => {
    console.log('關閉連線');
    store.dispatch(setLiveOrderSocketStatus('關閉連線'));
  };

  client.onerror = () => {
    console.log('Connection Error');
    store.dispatch(setLiveOrderSocketStatus('發生錯誤'));
  };
};

//** Send Message */
export const sendMessage = (value, token) => {
  if (value === '' || !token) {
    alert('沒有token');
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
