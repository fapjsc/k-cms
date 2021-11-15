import { useEffect } from 'react';
import { Sidebar, ConversationList, Search, Conversation } from '@chatscope/chat-ui-kit-react';

// Redux
import { useSelector, useDispatch } from 'react-redux';

// Actions
import { setSelectThread } from '../../store/actions/messageActions';

// Helper
import { _getUnReadCount, _getCurrentThread } from '../../lib/helper';

const ChatList = () => {
  let count;

  const { messageList, selectThread } = useSelector(state => state.message);

  const dispatch = useDispatch();

  const onClickHandler = thread => {
    dispatch(setSelectThread(thread));
  };

  const threadEl = messageList.map(el =>
    Object.keys(el).map(thread => {
      const currentMessage = messageList.filter(el => Object.keys(el)[0] === thread)[0];
      const lastMessage = Object.values(currentMessage)[0];

      count = _getUnReadCount(messageList, thread);

      if (thread === selectThread) count = 0;

      return (
        <Conversation
          key={thread}
          onClick={() => onClickHandler(thread)}
          name={thread.slice(-6)}
          lastSenderName=""
          info={lastMessage[lastMessage.length - 1].Message}
          active={selectThread === thread}
          unreadCnt={count}
        />
      );
    })
  );

  useEffect(() => {
    const currentThread = _getCurrentThread(messageList, selectThread);
    if (currentThread) localStorage.setItem(selectThread, Object.values(currentThread)[0].length);
  }, [selectThread, messageList]);

  return (
    <Sidebar position="left" scrollable={true}>
      <Search placeholder="Search..." />
      <ConversationList style={{ color: '#fff' }}>{threadEl}</ConversationList>
    </Sidebar>
  );
};

export default ChatList;
