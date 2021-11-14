import React from 'react';
import { ExpansionPanel, Sidebar } from '@chatscope/chat-ui-kit-react';

const ChatInfo = () => {
  return (
    <Sidebar position="right">
      <ExpansionPanel open title="INFO">
        <p>Lorem ipsum</p>
        <p>Lorem ipsum</p>
        <p>Lorem ipsum</p>
        <p>Lorem ipsum</p>
      </ExpansionPanel>
    </Sidebar>
  );
};

export default ChatInfo;
