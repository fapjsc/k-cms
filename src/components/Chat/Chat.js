import { useState, useEffect } from 'react';

// Redux
import { useDispatch } from 'react-redux';

// Actions
import { setMessageList } from '../../store/actions/messageActions';

// WebSocket
import { connectWithSocket } from '../../lib/socketConnection';

// Components
import ChatList from './ChatList';
import ChatContent from './ChatContent';
import ChatInfo from './ChatInfo';

// Style
import { MainContainer } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const Chat = () => {
  // Redux
  const dispatch = useDispatch();

  useEffect(() => {
    connectWithSocket();
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '90vh',
      }}
    >
      <MainContainer responsive>
        <ChatList />

        <ChatContent />

        <ChatInfo />
      </MainContainer>
    </div>
  );
};

export default Chat;
