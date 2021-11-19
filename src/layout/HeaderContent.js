import React from 'react';

// Redux
import { useSelector } from 'react-redux';

// Antd
import { Space, Descriptions } from 'antd';
// import { ReloadOutlined } from '@ant-design/icons';

// Socket
// import { connectWithChatSocket } from '../lib/chatSocket';
// import { connectWithLiveOrderSocket } from '../lib/liveOrderSocket';

// Style
import classes from '../components/avatar/AvatarDropdown.module.scss';

const HeaderContent = () => {
  // const reloadSocket = type => {
  //   if (type === 'chat') connectWithChatSocket();

  //   if (type === 'liveOrder') connectWithLiveOrderSocket();
  // };

  // Redux
  const { chat, liveOrder } = useSelector(state => state.socket);
  return (
    <Space className={classes.headerContextBox}>
      {/* <AutoLogout />
      <Avatar /> */}
      <Descriptions title="">
        <Descriptions.Item style={{ padding: 0 }} label={`chat socket`}>
          <Space>
            {chat}
            {/* <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => reloadSocket('chat')} /> */}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item style={{ padding: 0 }} label="Live order socket">
          <Space>
            {liveOrder}
            {/* <ReloadOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => reloadSocket('liveOrder')}
            /> */}
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </Space>
  );
};

export default HeaderContent;
