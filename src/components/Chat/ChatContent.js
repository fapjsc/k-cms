import { useState, useEffect, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Avatar as AvatarAntd } from 'antd';
import FlipMove from 'react-flip-move';
import {
  MessageList,
  Message,
  Avatar,
  MessageGroup,
  MessageInput,
  ChatContainer,
  ConversationHeader,
  InfoButton,
} from '@chatscope/chat-ui-kit-react';

// Redux
import { useSelector } from 'react-redux';

// WebSocket
import { sendMessage } from '../../lib/socketConnection';

const ChatContent = () => {
  // InitState
  const [currentMessage, setCurrentMessage] = useState();

  // Redux
  const [messageInputValue, setMessageInputValue] = useState('');
  const { messageList, selectThread, selectToken } = useSelector(state => state.message);

  const sendMessageHandler = () => {
    sendMessage(messageInputValue, selectToken);
    setMessageInputValue('');
  };

  useEffect(() => {
    if (selectThread) {
      const currentMessage = messageList.find(el => Object.keys(el)[0] === selectThread && el);
      setCurrentMessage(Object.values(currentMessage)[0]);
    }
  }, [selectThread, messageList]);

  //** Message Handle */
  const messageEl =
    currentMessage &&
    currentMessage.map(el => {
      let timer = new Date(el.Sysdate);

      const avatar = (
        <Avatar
          name=""
          children={
            <AvatarAntd
              style={{
                backgroundColor:
                  el.Message_Role === 1 ? 'blue' : el.Message_Role === 3 ? 'red' : 'grey',
                verticalAlign: 'middle',
              }}
              size="large"
              // gap={gap}
            >
              {el.Message_Role === 1 ? '買方' : el.Message_Role === 3 ? '賣方' : '客服'}
            </AvatarAntd>
          }
        />
      );

      let messageModel;

      if (el.Message_Type === 1) {
        messageModel = { message: el.Message };
      } else {
        messageModel = {
          payload: {
            src: el.Message,
            width: '150px',
          },
        };
      }

      return (
        <Fragment key={uuidv4()}>
          <MessageGroup sentTime="" sender="" direction="incoming" position="single">
            <MessageGroup.Messages>
              <Message
                type={el.Message_Type === 2 ? 'image' : 'text'}
                model={messageModel}
                avatarPosition="bl"
              >
                {avatar}
              </Message>
              <MessageGroup.Footer>
                <span
                  style={{ marginLeft: 'auto' }}
                >{`${timer.getHours()}:${timer.getMinutes()}`}</span>
              </MessageGroup.Footer>
            </MessageGroup.Messages>
          </MessageGroup>
          <br />
        </Fragment>
      );
    });

  return (
    <ChatContainer style={{ border: 'none', backgroundColor: 'red' }}>
      <ConversationHeader>
        <ConversationHeader.Back />
        <ConversationHeader.Content
          userName={selectThread ? selectThread : '尚未選擇對話'}
          info=""
        />
      </ConversationHeader>

      {messageEl ? (
        <MessageList>{messageEl}</MessageList>
      ) : (
        <MessageList>
          <MessageList.Content
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              fontSize: '1.2em',
            }}
          >
            Empty
          </MessageList.Content>
        </MessageList>
      )}

      {selectThread && (
        <MessageInput
          placeholder="Type message here"
          value={messageInputValue}
          onChange={val => setMessageInputValue(val)}
          onSend={sendMessageHandler}
        />
      )}
    </ChatContainer>
  );
};

export default ChatContent;
