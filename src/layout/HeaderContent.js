import React from "react";

// Redux
import { useSelector } from "react-redux";

import { selectMemberChatOnline } from "../store";

// Antd
import { Space, Descriptions } from "antd";

// Style
import classes from "../components/avatar/AvatarDropdown.module.scss";

const HeaderContent = () => {
  // Redux
  const { chat, liveOrder } = useSelector((state) => state.socket);
  const online = useSelector(selectMemberChatOnline);

  return (
    <Space className={classes.headerContextBox}>
      {/* <AutoLogout />
      <Avatar /> */}
      <Descriptions title="">
        <Descriptions.Item style={{ padding: 0 }} label={`即時訂單連天窗口`}>
          <Space>
            {chat}
            {/* <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => reloadSocket('chat')} /> */}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item style={{ padding: 0 }} label="即時訂單訊息">
          <Space>
            {liveOrder}
            {/* <ReloadOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => reloadSocket('liveOrder')}
            /> */}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item style={{ padding: 0 }} label="會員對話窗口">
          <Space>{online ? "連線成功" : "連線中..."}</Space>
        </Descriptions.Item>
      </Descriptions>
    </Space>
  );
};

export default HeaderContent;
