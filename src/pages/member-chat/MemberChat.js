import React, { useRef, useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { isEqual } from "lodash";

// Antd
import { ChatItem, MessageBox, Input } from "react-chat-elements";
import { Space } from "antd";

import { resizeFile } from "../../lib/imageResize";
import moment from "moment";
import { PhotoProvider, PhotoView } from "react-photo-view";

// Store
import {
  selectMessagesMap,
  selectMemberChatCurrentUser,
  selectLastMessage,
  selectCheckTime,
  selectMemberChatUserDetail,
} from "../../store";

// Hooks
import { useWebSocket, useActions } from "../../hooks";
import { scrollToBottomAnimated } from "../../lib/scrollToBottom";

// Styles
import styles from "./MemberChat.module.scss";
import "react-chat-elements/dist/main.css";
import "react-photo-view/dist/react-photo-view.css";

import { getUserLevel } from "../../lib/getUserLevel";

// Images
import memberImage from "../../asset/會員.jpg";
import csImage from "../../asset/cs.png";
import uploadImageIcon from "../../asset/attach_icon.png";
import sendImageIcon from "../../asset/send_icon.png";

const systemMessage = `親愛的會員您好，我是 88u.asia 客服，請問有什麼需要為您服務的嗎？
關於會員升等請輸入"1"
關於操作說明請輸入"2"
關於其他問題請輸"3"`;

const MemberChat = () => {
  const inputRef = useRef();
  const imageInputRef = useRef();

  const [inputValue, setInputValue] = useState("");
  const [userList, setUserList] = useState([]);

  const {
    setMemberChatMessageList,
    setMemberChatMessage,
    setMemberChatCurrentUser,
    setMemberCheckTime,
    memberChatGetUserDetails,
  } = useActions();

  const messagesMap = useSelector(selectMessagesMap);
  const currentUser = useSelector(selectMemberChatCurrentUser);
  const lastMessageMap = useSelector(selectLastMessage);
  const memberCheckTimeMap = useSelector(selectCheckTime);
  const userDetail = useSelector(selectMemberChatUserDetail);


  const { connectMemberLevelWs, socket, sendImage, sendMessage } = useWebSocket(
    "ws://10.168.192.1:6881/ws_BackUserChat.ashx"
  );

  const getUnReadMessage = (token) => {
    if (!token || token === currentUser) return;

    const checkTime = memberCheckTimeMap[token] || 0;
    const unReadArr = messagesMap[token].messages.filter((el) => {
      return moment(el.SysDate).valueOf() > moment(checkTime).valueOf();
    });

    return unReadArr.length || 0;
  };

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
      if (!message) return;
      const dataFromServer = JSON.parse(message.data);

      if (Array.isArray(dataFromServer)) {
        setMemberChatMessageList(dataFromServer);
        setTimeout(() => {
          scrollToBottomAnimated("memberChat-main");
        }, 0);
        return;
      }

      if (dataFromServer.Message.includes("|*is-open*|")) {
        sendMessage(systemMessage, dataFromServer.token);
        return;
      }

      setMemberChatMessage(dataFromServer);

      setTimeout(() => {
        scrollToBottomAnimated("memberChat-main");
      }, 0);
    };

    socket?.addEventListener("message", messageListen);

    return () => {
      socket?.removeEventListener("message", messageListen);
    };
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    if (!currentUser) return;
    setMemberCheckTime({
      token: currentUser,
      checkTime: moment().local().format("YYYY/MM/DD HH:mm:ss"),
    });
    // eslint-disable-next-line
  }, [currentUser]);

  useEffect(() => {
    const arr = Object.keys(messagesMap) || [];
    if (!arr.length) return;

    const userArr = Object.keys(userList) || [];
    if (isEqual(userArr, arr)) return;
    if (JSON.stringify(userArr) === JSON.stringify(arr)) return;

    setUserList(messagesMap);
    // eslint-disable-next-line
  }, [messagesMap]);

  useEffect(() => {
    memberChatGetUserDetails(Object.keys(userList));
    // eslint-disable-next-line
  }, [userList]);

  return (
    <section className={styles.container}>
      <div className={styles["side-bar"]}>
        <div className={styles.search}>
          {/* <span>{online ? '連線成功' : '連線中...'}</span> */}
          <br />
          {/* <ReactSearchBox
            placeholder="Search"
            data={searchData}
            callback={(record) => console.log(record)}
            leftIcon={<SearchOutlined />}
            inputBackgroundColor="#181818"
            inputFontColor="#f2f2f2"
            dropDownHoverColor="#181818"
          /> */}
        </div>
        <div className={styles["user-list"]}>
          {Object.keys(messagesMap)
            .sort(
              (a, b) =>
                moment(messagesMap[b].lastTime).valueOf() -
                moment(messagesMap[a].lastTime).valueOf()
            )
            .map((el) => {
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
                      <span className={styles["chat-item-title"]}>
                        {(userDetail && userDetail[el]?.User_Tel) || "null"}
                      </span>
                    }
                    subtitle={
                      lastMessageMap[el].Message_Type === 2
                        ? "[圖片]"
                        : lastMessageMap[el].Message
                    }
                    dateString={moment(lastMessageMap[el].SysDate).format(
                      "MM-DD HH:mm"
                    )}
                    // date={new Date()}
                    unread={getUnReadMessage(el)}
                    onClick={() => {
                      if (currentUser) {
                        setMemberCheckTime({
                          token: currentUser,
                          checkTime: moment()
                            .local()
                            .format("YYYY/MM/DD HH:mm:ss"),
                        });
                      }

                      setMemberChatCurrentUser(el);
                      setTimeout(() => {
                        scrollToBottomAnimated("memberChat-main");
                      }, 0);
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
          <header className={styles.header}>
            {`${
              userDetail && getUserLevel(userDetail[currentUser]?.Lvl).text
            } - ${userDetail && userDetail[currentUser]?.User_Tel}`}
          </header>

          <Space
            id="memberChat-main"
            direction="vertical"
            size="middle"
            className={styles.content}
          >
            {messagesMap[currentUser].messages
              .filter((el) => !el.Message.includes("|*is-open*|"))
              .reverse()
              .map(
                ({ Message, Message_Role, SysDate, Message_Type, SysID }) => (
                  <div key={SysID}>
                    {Message_Type === 1 && (
                      <MessageBox
                        position={Message_Role === 2 ? "right" : "left"}
                        avatar={Message_Role === 1 ? memberImage : csImage}
                        type={Message_Type === 1 ? "text" : "photo"}
                        text={Message_Type === 1 && Message}
                        dateString={moment(SysDate).format("MM-DD HH:mm")}
                        data={{
                          uri: Message_Type === 2 && Message,
                        }}
                      />
                    )}

                    {Message_Type === 2 && (
                      <PhotoProvider>
                        <div
                          style={{
                            backgroundColor: "#8774E1",
                            maxWidth: "25rem",
                          }}
                          className={`rce-mbox ${
                            Message_Role === 2
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
                            {moment(SysDate).format("MM-DD HH:mm")}
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

// const searchData = [
//   {
//     key: "john",
//     value: "John Doe",
//   },
//   {
//     key: "jane",
//     value: "Jane Doe",
//   },
//   {
//     key: "mary1",
//     value: "Mary Phillips1",
//   },
//   {
//     key: "mary2",
//     value: "Mary Phillips2",
//   },
//   {
//     key: "mary3",
//     value: "Mary Phillips3",
//   },
//   {
//     key: "robert",
//     value: "Robert",
//   },
//   {
//     key: "karius",
//     value: "Karius",
//   },
// ];
