import { useEffect } from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';

// Router
import { useHistory } from 'react-router-dom';

// Actions
import {
  setLiveSelectOrder,
  setLiveSelectThread,
  setLiveSelectToken,
  removeSelectData,
} from '../../store/actions/liveOrderAction';

import ProTable from '@ant-design/pro-table';

// Hooks
import useHttp from '../../hooks/useHttp';

// Apis
import { getOrderInfo } from '../../lib/api';

// WebSocket
import { connectWithLiveOrderSocket } from '../../lib/liveOrderSocket';

// Helper
import { _animateTitle } from '../../lib/helper';

// Antd
import { Badge, message } from 'antd';

const OrderTable = () => {
  // Http
  const {
    status: getOrderInfoStatus,
    data: getOrderInfoData,
    error: getOrderInfoError,
    sendRequest: getOrderInfoReq,
  } = useHttp(getOrderInfo);

  // Router
  const history = useHistory();

  // Redux
  const { orderList } = useSelector(state => state.liveOrder);
  const { unReadMessage } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'Title',
      dataIndex: 'Title',
      align: 'center',
      // render: _ => <a>{_}</a>,
    },
    {
      title: 'Type',
      width: 80,
      dataIndex: 'OrderType',
      align: 'center',
      sorter: (a, b) => a.OrderType - b.OrderType,

      render: dom => {
        if (dom === 0) return <span style={{ color: '#69c0ff' }}>買</span>;
        if (dom === 1) return <span style={{ color: '#ff7875' }}>賣</span>;
      },
    },
    {
      title: 'Currency',
      dataIndex: 'Currency',
      align: 'center',
    },

    {
      title: 'UsdtAmt',
      dataIndex: 'UsdtAmt',
      align: 'center',
      // render: dom => <span>$ {dom}</span>,
      sorter: (a, b) => a.UsdtAmt - b.UsdtAmt,
    },

    {
      title: 'Agent',
      align: 'center',
      dataIndex: 'Agent',
    },
    {
      title: 'User',
      align: 'center',
      dataIndex: 'User',
    },
    {
      title: (
        <>
          CreateDate
          {/* <Tooltip placement="top" title="这是一段描述">
            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
          </Tooltip> */}
        </>
      ),
      dataIndex: 'CreateDate',

      sorter: (a, b) => new Date(a.CreateDate).getTime() - new Date(b.CreateDate).getTime(),
      // valueType: 'dateTime',
      // sorter: (a, b) => a.createdAt - b.createdAt,
    },
    // {
    //   title: 'Token',
    //   dataIndex: 'token',
    //   ellipsis: true,
    //   copyable: true,
    // },

    {
      title: 'Status',
      dataIndex: 'Order_StatusID',
      initialValue: 'all',
      align: 'center',
      // sorter: (a, b) => a.createdAt - b.createdAt,
      filters: true,
      onFilter: true,
      filterMultiple: false,
      valueEnum: {
        1: { text: '交易成功', status: 'Default' },
        31: { text: '配對中', status: 'Success' },
        33: { text: '等待付款', status: 'Processing' },
        34: { text: '等待收款', status: 'Error' },
        35: { text: '申訴', status: 'Default' },
        98: { text: '交易超時', status: 'Default' },
        99: { text: '交易取消', status: 'Default' },
      },
    },
    {
      title: 'Msg',
      dataIndex: 'Message',
      align: 'center',
      render: (_, row, index, action) => {
        let item = unReadMessage.find(el => el.token === row.token);

        if (item?.count) {
          const { count } = item;
          const readCount = localStorage.getItem(item.token) || 0;

          if (count - readCount <= 0) {
            return <span>-</span>;
          }

          return (
            <Badge
              className="site-badge-count-109"
              count={count - readCount}
              style={{ backgroundColor: item && item.count && '#f5222d' }}
            />
          );
        } else {
          return <span>-</span>;
        }
      },
    },
    // {
    //   title: '操作',
    //   width: 180,
    //   key: 'option',
    //   valueType: 'option',
    //   render: () => [
    //     <a key="link">链路</a>,
    //     <a key="link2">报警</a>,
    //     <a key="link3">监控</a>,
    //     <TableDropdown
    //       key="actionGroup"
    //       menus={[
    //         { key: 'copy', name: '复制' },
    //         { key: 'delete', name: '删除' },
    //       ]}
    //     />,
    //   ],
    // },
  ];

  useEffect(() => {
    const reloadIcon = document.getElementsByClassName('anticon-reload')[0];

    const handlerClick = () => {
      connectWithLiveOrderSocket();
      _animateTitle('K-CMS', false);
    };
    if (reloadIcon) {
      reloadIcon.addEventListener('click', handlerClick);
    }

    return () => {
      reloadIcon.removeEventListener('click', handlerClick);
    };
  }, []);

  useEffect(() => {
    const messageStyle = {
      position: 'absolute',
      right: '5%',
    };
    const key = 'updatable';
    message.destroy(key);

    if (getOrderInfoStatus === 'pending') {
      console.log('loading...');
      message.loading({ content: 'Loading...', key, style: messageStyle });
      return;
    }

    if (getOrderInfoError) {
      console.log(getOrderInfoError);
      message.error({ content: '發生錯誤', key, duration: 2, style: messageStyle });

      return;
    }

    if (getOrderInfoStatus === 'completed' && getOrderInfoData) {
      console.log('get order info success.');
      message.success({ content: 'get order info success', key, duration: 2, style: messageStyle });

      dispatch(setLiveSelectOrder(getOrderInfoData));
      dispatch(setLiveSelectThread(getOrderInfoData.Tx_HASH));
      history.push(`${history.location.pathname}/${getOrderInfoData.Tx_HASH}`);
    }
  }, [getOrderInfoStatus, getOrderInfoData, getOrderInfoError, dispatch, history]);

  useEffect(() => {
    dispatch(removeSelectData());
  }, [dispatch]);

  useEffect(() => {
    localStorage.removeItem('order');
  }, []);

  return (
    <ProTable
      className="cursorPinter"
      columns={columns}
      dataSource={orderList}
      search={false}
      // toolbar={{
      //   search: {
      //     onSearch: value => {
      //       console.log(value);
      //     },
      //   },
      // }}
      toolbar={false}
      rowKey={record => record.token}
      pagination={{
        showQuickJumper: true,
      }}
      onRow={r => ({
        onClick: () => {
          getOrderInfoReq(r.token);
          dispatch(setLiveSelectToken(r.token));
          localStorage.setItem('order', r.token);
        },
      })}
      // dateFormatter="string"
      // headerTitle="Title"
      // toolBarRender={() => [
      //   <Button key="show">查看日志</Button>,
      //   <Button key="out">
      //     导出数据
      //     <DownOutlined />
      //   </Button>,
      //   <Button type="primary" key="primary">
      //     创建应用
      //   </Button>,
      // ]}
    />
  );
};

export default OrderTable;
