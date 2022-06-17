import React, { useRef, useState, useEffect } from "react";

import { useSelector } from "react-redux";

// Antd
import { ChatItem, MessageBox, Input } from "react-chat-elements";
import { Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Package
import { resizeFile } from "../../lib/imageResize";
import ReactSearchBox from "react-search-box";
import moment from "moment";
// import { PhotoProvider, PhotoView } from 'react-photo-view';
import { PhotoProvider, PhotoView } from "react-photo-view";

// Store
import {
  selectorMessagesMap,
  selectorMemberChatSelectorUser,
  selectorLastMessage,
} from "../../store";

// Hooks
import { useWebSocket, useActions } from "../../hooks";

import { scrollToBottomAnimated } from "../../lib/scrollToBottom";

// Styles
import styles from "./MemberChat.module.scss";
import "react-chat-elements/dist/main.css";
import "react-photo-view/dist/react-photo-view.css";

// Images
import memberImage from "../../asset/會員.jpg";
import csImage from "../../asset/cs.png";
import uploadImageIcon from "../../asset/attach_icon.png";
import sendImageIcon from "../../asset/send_icon.png";

const MemberChat = () => {
  const inputRef = useRef();
  const imageInputRef = useRef();

  const [inputValue, setInputValue] = useState("");

  const {
    setMemberChatMessageList,
    setMemberChatMessage,
    setMemberChatCurrentUser,
  } = useActions();

  const messagesMap = useSelector(selectorMessagesMap);
  const currentUser = useSelector(selectorMemberChatSelectorUser);
  const lastMessageMap = useSelector(selectorLastMessage);

  const { connectMemberLevelWs, socket, sendImage, sendMessage } = useWebSocket(
    "ws://10.168.192.1:6881/ws_BackUserChat.ashx"
  );

  const onImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const image = await resizeFile(file);
      sendImage(image, currentUser);
    } catch (error) {
      alert(error);
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputValue) return;
    sendMessage(inputValue, currentUser);
    setInputValue("");
    inputRef.current.value = "";
  };

  useEffect(() => {
    connectMemberLevelWs();
  }, [connectMemberLevelWs]);

  useEffect(() => {
    const messageListen = (message) => {
      const dataFromServer = JSON.parse(message.data);

      if (Array.isArray(dataFromServer)) {
        setMemberChatMessageList(dataFromServer);
        scrollToBottomAnimated("memberChat-main");
        return;
      }

      setMemberChatMessage(dataFromServer);
      scrollToBottomAnimated("memberChat-main");
    };

    socket?.addEventListener("message", messageListen);

    return () => {
      socket?.removeEventListener("message", messageListen);
    };
  }, [socket]);

  return (
    <section className={styles.container}>
      <div className={styles["side-bar"]}>
        <div className={styles.search}>
          <ReactSearchBox
            placeholder="Search"
            data={searchData}
            callback={(record) => console.log(record)}
            leftIcon={<SearchOutlined />}
            inputBackgroundColor="#181818"
            inputFontColor="#f2f2f2"
            dropDownHoverColor="#181818"
          />
        </div>
        <div className={styles["user-list"]}>
          {Object.keys(messagesMap).map((el) => {
            return (
              <div
                key={el}
                style={{
                  borderBottom: "1px solid grey",
                  backgroundColor: el === currentUser && "white",
                }}
              >
                <ChatItem
                  avatar={memberImage}
                  title={
                    <span className={styles["chat-item-title"]}>{el}</span>
                  }
                  subtitle={lastMessageMap[el].Message}
                  dateString={moment(lastMessageMap[el].SysDate).format(
                    "HH:mm"
                  )}
                  // date={new Date()}
                  // unread={1}
                  onClick={() => {
                    setMemberChatCurrentUser(el);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {!currentUser && (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
          }}
        >
          尚未選擇對話
        </div>
      )}

      {currentUser && (
        <div className={styles.main}>
          <header className={styles.header}>{`會員 - ${currentUser}`}</header>

          <Space
            id="memberChat-main"
            direction="vertical"
            size="middle"
            className={styles.content}
          >
            {messagesMap[currentUser].messages.map(
              ({ Message, Message_Role, SysDate, Message_Type, SysID }) => (
                <div key={SysID}>
                  {Message_Type === 1 && (
                    <MessageBox
                      position={Message_Role === 1 ? "left" : "right"}
                      avatar={Message_Role === 1 ? memberImage : csImage}
                      type={Message_Type === 1 ? "text" : "photo"}
                      text={Message_Type === 1 && Message}
                      dateString={moment(SysDate).format("HH:mm")}
                      data={{
                        uri: Message_Type === 2 && Message,
                      }}
                    />
                  )}

                  {Message_Type === 2 && (
                    <PhotoProvider>
                      <div
                        style={{ backgroundColor: "#8774E1" }}
                        className={`rce-mbox ${
                          Message_Role === 1
                            ? "rce-mbox-right"
                            : "rce-mbox-left"
                        }`}
                      >
                        <span
                          style={{
                            position: "absolute",
                            bottom: 20,
                            right: 20,
                            color: "#f2f2f2",
                            fontSize: "1rem",
                          }}
                        >
                          {moment(SysDate).format("HH:mm")}
                        </span>
                        <PhotoView key={SysID} src={Message}>
                          <img
                            style={{
                              cursor: "zoom-in",
                              display: "block",
                              margin: 0,
                              width: "100%",
                            }}
                            src={Message}
                            alt="send img"
                          />
                        </PhotoView>
                      </div>
                    </PhotoProvider>
                  )}
                </div>
              )
            )}
          </Space>

          <form onSubmit={onSubmit} className={styles.action}>
            <Input
              referance={inputRef}
              onChange={({ target }) => setInputValue(target.value)}
              inputStyle={{ backgroundColor: "#f2f2f2" }}
              className={styles.input}
              placeholder="輸入訊息"
              leftButtons={
                <>
                  <img
                    onClick={() => imageInputRef.current.click()}
                    className={styles.upload}
                    src={uploadImageIcon}
                    alt="upload"
                  />
                  <input
                    id="member-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onImageChange}
                    ref={imageInputRef}
                    style={{ display: "none" }}
                  />
                </>
              }
              rightButtons={
                <button type="submit">
                  <img className={styles.send} src={sendImageIcon} alt="send" />
                </button>
              }
            />
          </form>
        </div>
      )}
    </section>
  );
};

export default MemberChat;

const searchData = [
  {
    key: "john",
    value: "John Doe",
  },
  {
    key: "jane",
    value: "Jane Doe",
  },
  {
    key: "mary1",
    value: "Mary Phillips1",
  },
  {
    key: "mary2",
    value: "Mary Phillips2",
  },
  {
    key: "mary3",
    value: "Mary Phillips3",
  },
  {
    key: "robert",
    value: "Robert",
  },
  {
    key: "karius",
    value: "Karius",
  },
];
