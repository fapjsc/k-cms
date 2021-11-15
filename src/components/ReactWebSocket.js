// import { useState, useEffect } from 'react';
// import useWebSocket, { ReadyState } from 'react-use-websocket';

// // Redux
// import { useDispatch } from 'react-redux';

// // Actions
// // import { setMessageList } from '../store/actions/messageAction';
// import { setMessageList } from '../store/actions/messageActions';

// const ReactWebSocket = props => {
//   // Redux
//   const dispatch = useDispatch();

//   const [socketUrl] = useState('ws://10.168.192.1:6881/ws_backchat.ashx');

//   const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

//   useEffect(() => {
//     if (lastMessage !== null) {
//       let message = JSON.parse(lastMessage.data);

//       dispatch(setMessageList(message));
//     }
//   }, [lastMessage, dispatch]);

//   const connectionStatus = {
//     [ReadyState.CONNECTING]: 'Connecting',
//     [ReadyState.OPEN]: 'Open',
//     [ReadyState.CLOSING]: 'Closing',
//     [ReadyState.CLOSED]: 'Closed',
//     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
//   }[readyState];

//   console.log(connectionStatus);

//   return props.children;
// };

// export default ReactWebSocket;
