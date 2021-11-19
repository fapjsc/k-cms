import React, { useState, useEffect } from 'react';

// Chat Socket
import { sendMessage, sendImg } from '../../lib/chatSocket';

// Redux
import { useSelector, useDispatch } from 'react-redux';

// Actions
import { removeUnreadMessageCount } from '../../store/actions/messageActions';

import {
  Widget,
  isWidgetOpened,
  deleteMessages,
  renderCustomComponent,
  setBadgeCount,
} from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

import buyerLogo from '../../asset/buyer.png';
import csLogo from '../../asset/cs.png';
import sellLogo from '../../asset/seller.png';

const ChatWidget = ({ ownMessage }) => {
  // Redux
  const { selectToken, selectThreadOwnMessageFromClientLength, selectThread } = useSelector(
    state => state.liveOrder
  );

  const dispatch = useDispatch();

  deleteMessages();

  const [isOpen, setIsOpen] = useState(isWidgetOpened());

  if (ownMessage && ownMessage.length) {
    ownMessage.forEach(el => {
      // 格式化時間
      const timer = el.Sysdate.split(' ').splice(1, 1).join().split(':').splice(0, 2).join(':');

      //==== 買方或賣方的訊息 ====//
      if (el.Message_Role === 1 || el.Message_Role === 3) {
        // 文字
        if (el.Message_Type === 1) {
          renderCustomComponent(() => (
            <div className="rcw-message">
              <img
                className="rcw-avatar"
                src={el.Message_Role === 1 ? buyerLogo : sellLogo}
                alt="profile"
              />
              <div className="rcw-response">
                <div className="rcw-message-text">
                  <p>{el.Message}</p>
                </div>
                <span className="rcw-timestamp">{timer}</span>
              </div>
            </div>
          ));
        }

        // 圖片
        if (el.Message_Type === 2) {
          renderCustomComponent(() => (
            <div className="rcw-message">
              <img
                className="rcw-avatar"
                src={el.Message_Role === 1 ? buyerLogo : sellLogo}
                alt="profile"
              />

              <div className="rcw-response">
                <div className="rcw-message-text">
                  <img src={el.Message} height="150" width="300" alt="send" />
                </div>
                <span className="rcw-timestamp">{timer}</span>
              </div>
            </div>
          ));
        }
      }

      //=== 客服 ====//
      if (el.Message_Role === 2) {
        // 文字
        if (el.Message_Type === 1) {
          renderCustomComponent(() => (
            <div className="rcw-message rcw-message-client">
              <img className="rcw-avatar" src={csLogo} alt="client" />
              <div className="rcw-client">
                <div className="rcw-message-text rcw-message-client-text">
                  <p>{el.Message}</p>
                </div>
                <span className="rcw-timestamp">{timer}</span>
              </div>
            </div>
          ));
        }

        // 圖片
        if (el.Message_Type === 2) {
          renderCustomComponent(() => (
            <div className="rcw-message rcw-message-client">
              <img className="rcw-avatar" src={csLogo} alt="client" />
              <div className="rcw-client">
                <div className="rcw-message-text rcw-message-client-text">
                  <img src={el.Message} height="150" width="300" alt="send" />
                </div>
                <span className="rcw-timestamp">{timer}</span>
              </div>
            </div>
          ));
        }
      }
    });
  }

  useEffect(() => {
    const readMessageCount = localStorage.getItem(selectToken);
    setBadgeCount(selectThreadOwnMessageFromClientLength - readMessageCount);
  }, [selectThreadOwnMessageFromClientLength, selectToken]);

  useEffect(() => {
    let btnEl = document.querySelector('.rcw-launcher');
    if (btnEl) {
      btnEl.addEventListener('click', e => {
        setTimeout(() => {
          const isOpen = isWidgetOpened();

          if (isOpen) {
            setIsOpen(true);
          }
          if (!isOpen) setIsOpen(false);
        }, 0);
      });
    }
  }, []);

  // Chat Widget開啟後要做的事
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(selectToken, selectThreadOwnMessageFromClientLength);

      dispatch(removeUnreadMessageCount(selectThread));

      const target = document.querySelector('.rcw-send');

      setTimeout(() => {
        const sendImgIconEl = document.querySelector('.sendImgIcon');
        if (!sendImgIconEl) {
          target.insertAdjacentHTML('afterend', `<div class="sendImgIcon" />`);
          const sendImgIconEl = document.querySelector('.sendImgIcon');
          if (!sendImgIconEl) return;
          sendImgIconEl.addEventListener('click', () => {
            document.getElementById('file1').click();
          });
        }
      }, 0);
    }
  }, [isOpen, selectThread, selectThreadOwnMessageFromClientLength, dispatch, selectToken]);

  const handleNewUserMessage = newMessage => {
    sendMessage(newMessage, selectToken);
  };
  return (
    <div>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Chat"
        // profileClientAvatar={logo}
        // profileAvatar={buyerLogo}
        // setBadgeCount={10}

        // handleSubmit={handleNewUserMessage}
      />
      <input
        onChange={e => sendImg(e, selectToken)}
        id="file1"
        type="file"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ChatWidget;
