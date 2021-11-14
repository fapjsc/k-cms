import React from 'react';
import { Sidebar, ConversationList, Search, Conversation } from '@chatscope/chat-ui-kit-react';

const ChatList = () => {
  return (
    <Sidebar position="left" scrollable={true}>
      <Search placeholder="Search..." />
      <ConversationList>
        <Conversation name="Lilly" lastSenderName="Lilly" info="Yes i can do it for you" />

        <Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you" />

        <Conversation
          name="Emily"
          lastSenderName="Emily"
          info="Yes i can do it for you"
          unreadCnt={3}
        />

        <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you" unreadDot />

        <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you" />

        <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you" />

        <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you" active />

        <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you" />

        <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you" />

        <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you" />

        <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you" />
      </ConversationList>
    </Sidebar>
  );
};

export default ChatList;
