import { useState, useCallback, useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

import { useActions } from "../hooks";

export const useWebSocket = (path) => {
  const [socket, setSocket] = useState(null);

  const { setMemberChatOnline } = useActions();

  const connectMemberLevelWs = useCallback(() => {
    const options = {
      debug: false,
    };
    const ws = new ReconnectingWebSocket(path, [], options);
    setSocket(ws);
  }, [path]);

  const disconnectSocket = useCallback(() => {
    socket?.close();
  }, [socket]);

  const sendMessage = (value, currentUser) => {
    socket.send(
      JSON.stringify({
        Message_Type: 1,
        Message: value.toString(),
        token: currentUser,
      })
    );
  };

  const sendImage = (image, currentUser) => {
    socket.send(
      JSON.stringify({
        Message_Type: 2,
        Message: image,
        token: currentUser,
      })
    );
  };

  // Open Listen
  useEffect(() => {
    const openListen = () => {
      setMemberChatOnline(true);
    };

    socket?.addEventListener("open", openListen);

    return () => {
      socket?.removeEventListener("open", openListen);
    };
    // eslint-disable-next-line
  }, [socket]);

  // Close Listen
  useEffect(() => {
    const closeListen = (close) => {
      setMemberChatOnline(false);
    };
    socket?.addEventListener("close", closeListen);

    return () => {
      socket?.removeEventListener("close", closeListen);
    };
    // eslint-disable-next-line
  }, [socket]);

  return {
    socket,
    connectMemberLevelWs,
    sendMessage,
    sendImage,
    disconnectSocket,
  };
};
