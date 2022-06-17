import { useState, useCallback, useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

export const useWebSocket = (path) => {
  const [socket, setSocket] = useState(null);

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
    console.log(image, currentUser)

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
      console.log("member level socket open");
    };

    socket?.addEventListener("open", openListen);

    return () => {
      socket?.removeEventListener("open", openListen);
    };
  }, [socket]);

  // Close Listen
  useEffect(() => {
    const closeListen = (close) => {
      console.log(close);
    };
    socket?.addEventListener("close", closeListen);

    return () => {
      socket?.removeEventListener("close", closeListen);
    };
  }, [socket]);

  return {
    socket,
    connectMemberLevelWs,
    sendMessage,
    sendImage,
    disconnectSocket,
  };
};
