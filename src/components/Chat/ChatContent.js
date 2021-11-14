import { useState } from 'react';
import {
  MessageList,
  Message,
  Avatar,
  MessageSeparator,
  TypingIndicator,
  MessageInput,
  ChatContainer,
  ConversationHeader,
  InfoButton,
} from '@chatscope/chat-ui-kit-react';
const ChatContent = () => {
  const [messageInputValue, setMessageInputValue] = useState('');
  return (
    <ChatContainer>
      <ConversationHeader>
        <ConversationHeader.Back />
        <ConversationHeader.Content userName="Zoe" info="" />
        <ConversationHeader.Actions>
          <InfoButton />
        </ConversationHeader.Actions>
      </ConversationHeader>

      <MessageList>
        {/* <Message
          model={{
            message: 'Hello my friend',
            sentTime: '12:30',
            sender: 'Zoe',
           
            
            position: 'single',
          }}
        >
          <Avatar src="https://picsum.photos/200" name="Zoe" />
          <Message.Footer sender="" sentTime="12:40" />
        </Message> */}

        <Message
          model={{
            message:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nSuspendisse tempus sem quis sollicitudin cursus.\nMauris id fermentum eros, fermentum condimentum erat.\nPraesent semper malesuada tempor.\nEtiam congue neque et neque convallis, ac imperdiet nulla commodo.',
            sentTime: 'just now',
            sender: 'Emily',
            direction: 'incoming',
          }}
          avatarPosition="tl"
        >
          <Avatar src="https://picsum.photos/200" name="Emily" />
          <Message.Footer sender="" sentTime="12:40" />
        </Message>

        <Message
          model={{
            message:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nSuspendisse tempus sem quis sollicitudin cursus.\nMauris id fermentum eros, fermentum condimentum erat.\nPraesent semper malesuada tempor.\nEtiam congue neque et neque convallis, ac imperdiet nulla commodo.',
            sentTime: 'just now',
            sender: 'Emily',
            direction: 'outgoing',
          }}
          avatarPosition="tr"
        >
          <Avatar src="https://picsum.photos/200" name="Emily" />
          <Message.Footer sender="" sentTime="12:40" />
        </Message>

        {/* <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Patrik',
            direction: 'outgoing',
            position: 'single',
          }}
          avatarSpacer
        />
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Zoe',
            direction: 'incoming',
            position: 'first',
          }}
          avatarSpacer
        />
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Zoe',
            direction: 'incoming',
            position: 'normal',
          }}
          avatarSpacer
        />
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Zoe',
            direction: 'incoming',
            position: 'normal',
          }}
          avatarSpacer
        />
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Zoe',
            direction: 'incoming',
            position: 'last',
          }}
        >
          <Avatar src="https://picsum.photos/200" name="Zoe" />
        </Message>

        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Patrik',
            direction: 'outgoing',
            position: 'first',
          }}
        />
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Patrik',
            direction: 'outgoing',
            position: 'normal',
          }}
        />
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Patrik',
            direction: 'outgoing',
            position: 'normal',
          }}
        />
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Patrik',
            direction: 'outgoing',
            position: 'last',
          }}
        />

        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Zoe',
            direction: 'incoming',
            position: 'first',
          }}
          avatarSpacer
        />
        <Message
          model={{
            message: 'Hello my friend',
            sentTime: '15 mins ago',
            sender: 'Zoe',
            direction: 'incoming',
            position: 'last',
          }}
        >
          <Avatar src="https://picsum.photos/200" name="Zoe" />
        </Message> */}
      </MessageList>

      <MessageInput
        placeholder="Type message here"
        value={messageInputValue}
        onChange={val => setMessageInputValue(val)}
        onSend={() => setMessageInputValue('')}
      />
    </ChatContainer>
  );
};

export default ChatContent;
