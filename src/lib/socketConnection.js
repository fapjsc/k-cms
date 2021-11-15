import { w3cwebsocket as W3CWebsocket } from 'websocket';

// Redux
import store from '../store/store';

// Actions
import { setMessageList } from '../store/actions/messageActions';

// 圖片壓縮
import Resizer from 'react-image-file-resizer';

const SERVER = 'ws://10.168.192.1:6881/ws_backchat.ashx';

let client;

//** Connect Handle */
export const connectWithSocket = () => {
  client = new W3CWebsocket(SERVER);

  // Chat WebSocket
  // 1.建立連接
  client.onopen = message => {
    console.log('Chat room client connected');
  };

  // 2.收到server回復
  client.onmessage = message => {
    const dataFromServer = JSON.parse(message.data);
    console.log('got Chat reply!');
    store.dispatch(setMessageList(dataFromServer));
  };

  // 3.錯誤處理
  client.onclose = () => {
    console.log('關閉連線');
  };

  client.onerror = () => {
    console.log('Connection Error');
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
const resizeFile = file =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      1024,
      1024,
      'JPEG',
      100,
      0,
      uri => {
        resolve(uri);
      },
      'base64'
    );
  });
