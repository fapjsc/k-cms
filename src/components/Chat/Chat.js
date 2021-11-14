import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer } from '@chatscope/chat-ui-kit-react';

import ChatList from './ChatList';
import ChatContent from './ChatContent';
import ChatInfo from './ChatInfo';

const Chat = () => {
  return (
    <div
      style={{
        height: '680px',
        position: 'relative',
        overflow: 'hidden',
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
