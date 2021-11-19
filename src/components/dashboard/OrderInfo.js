import { useEffect } from 'react';
import ProDescriptions from '@ant-design/pro-descriptions';

// Redux
import { useSelector, useDispatch } from 'react-redux';

// Actions
import {
  setLiveSelectOwnMessage,
  setLiveSelectToken,
  setLiveSelectOrder,
  setLiveSelectThread,
} from '../../store/actions/liveOrderAction';

// Hooks
import useHttp from '../../hooks/useHttp';

// Apis
import { getOrderInfo } from '../../lib/api';

// Components
import ChatWidget from './ChatWidget-tmp';

// Antd
import { Spin, Space, Button } from 'antd';

// Icons
// import { RedoOutlined } from '@ant-design/icons';

const OrderInfo = ({ history }) => {
  // Redux
  const { selectOrder, selectThread } = useSelector(state => state.liveOrder);
  const { messageList } = useSelector(state => state.message);
  const dispatch = useDispatch();

  // Http
  const {
    status: getOrderInfoStatus,
    data: getOrderInfoData,
    error: getOrderInfoError,
    sendRequest: getOrderInfoReq,
  } = useHttp(getOrderInfo);

  const columns = [
    {
      title: '收款姓名',
      key: 'P2',
      dataIndex: 'P2',
      order: 5,
      ellipsis: true,
      copyable: true,
    },
    {
      title: '訂單發起時間',
      key: 'CreateDate',
      dataIndex: 'CreateDate',
      valueType: 'dateTime',
    },
    {
      title: '付款時間',
      key: 'PayDate',
      dataIndex: 'Date',
      valueType: 'dateTime',
    },
    {
      title: '收款帳號',
      key: 'P1',
      dataIndex: 'P1',
      ellipsis: true,
      copyable: true,
    },

    {
      title: 'UsdtAmt',
      key: 'UsdtAmt',
      dataIndex: 'UsdtAmt',
    },

    {
      title: '總價',
      key: 'D2',
      dataIndex: 'D2',
    },
    {
      title: '開戶銀行',
      key: 'P3',
      dataIndex: 'P3',
      ellipsis: true,
      copyable: true,
    },

    {
      title: '手續費',
      key: 'D3',
      dataIndex: 'D3',
    },

    {
      title: '交易類別',
      key: 'MasterType',
      dataIndex: 'MasterType',
      valueEnum: {
        0: { text: '買入' },
        1: { text: '賣出' },
        2: { text: '轉入' },
        3: { text: '轉出' },
        // 98: { text: '交易取消', status: 'Error' },
        // 99: { text: '交易超時', status: 'Processing' },
      },
    },
    {
      title: '所在省市',
      key: 'P4',
      dataIndex: 'P4',
      ellipsis: true,
      copyable: true,
    },

    {
      title: '匯率',
      key: 'D1',
      dataIndex: 'D1',
    },

    {
      title: 'Order_TypeID',
      key: 'Order_TypeID',
      dataIndex: 'Order_TypeID',
    },

    {
      title: '狀態',
      key: 'Status',
      dataIndex: 'Order_StatusID',
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
      title: 'Tx_HASH',
      key: 'Tx_HASH',
      dataIndex: 'Tx_HASH',
      ellipsis: true,
      copyable: true,
    },

    // {
    //   title: '时间',
    //   key: 'date',
    //   dataIndex: 'date',
    //   valueType: 'date',
    //   fieldProps: {
    //     format: 'DD.MM.YYYY',
    //   },
    // },
    // {
    //   title: '开关',
    //   key: 'switch',
    //   dataIndex: 'switch',
    //   valueType: 'switch',
    // },
    // {
    //   title: 'money',
    //   key: 'money',
    //   dataIndex: 'money',
    //   valueType: 'money',
    //   fieldProps: {
    //     moneySymbol: '$',
    //   },
    // },
    // {
    //   title: 'D2',
    //   key: 'D2',
    //   dataIndex: 'D2',
    //   valueType: 'select',
    //   valueEnum: {
    //     all: { text: '全部', status: 'Default' },
    //     open: {
    //       text: '未解决',
    //       status: 'Error',
    //     },
    //     closed: {
    //       text: '已解决',
    //       status: 'Success',
    //     },
    //   },
    // },
    // {
    //   title: '操作',
    //   valueType: 'option',
    //   render: () => [
    //     <a target="_blank" rel="noopener noreferrer" key="link">
    //       链路
    //     </a>,
    //     <a target="_blank" rel="noopener noreferrer" key="warning">
    //       报警
    //     </a>,
    //     <a target="_blank" rel="noopener noreferrer" key="view">
    //       查看
    //     </a>,
    //   ],
    // },
  ];

  let ownMessageObj = messageList.filter(m => Object.keys(m)[0] === selectThread)[0];

  let ownMessage = ownMessageObj && Object.values(ownMessageObj)[0];

  // console.log(ownMessage, 'own Message');

  useEffect(() => {
    if (ownMessage && ownMessage.length) {
      console.log(ownMessage);
      dispatch(setLiveSelectOwnMessage(ownMessage));
    }
  }, [dispatch, ownMessage]);

  useEffect(() => {
    if (!selectOrder) {
      let token = localStorage.getItem('order');
      getOrderInfoReq(token);
      dispatch(setLiveSelectToken(token));
    }
  }, [selectOrder, getOrderInfoReq, dispatch]);

  useEffect(() => {
    if (getOrderInfoStatus === 'pending') {
      console.log('loading...');
      return;
    }

    if (getOrderInfoError) {
      console.log(getOrderInfoError);
      return;
    }

    if (getOrderInfoStatus === 'completed' && getOrderInfoData) {
      console.log('get order info success.');
      console.log(getOrderInfoData);
      dispatch(setLiveSelectOrder(getOrderInfoData));
      dispatch(setLiveSelectThread(getOrderInfoData.Tx_HASH));
    }
  }, [getOrderInfoStatus, getOrderInfoData, getOrderInfoError, dispatch, history]);

  return (
    <section style={{ height: '90vh', position: 'relative' }}>
      {getOrderInfoStatus === 'pending' && (
        <Space size="middle" style={{ margin: '15rem ', textAlign: 'center', display: 'block' }}>
          <Spin size="large" />
        </Space>
      )}

      {selectOrder && getOrderInfoStatus !== 'pending' && (
        <>
          <ProDescriptions
            bordered={true}
            title={`* 訂單資訊`}
            dataSource={selectOrder}
            columns={columns}
          >
            <ProDescriptions.Item valueType="option">
              <Button
                type="link"
                onClick={() => {
                  getOrderInfoReq(localStorage.getItem('order'));
                }}
                key="reload"
              >
                刷新
              </Button>
              <Button type="link" onClick={() => history.push('/dashboard')}>
                返回
              </Button>
            </ProDescriptions.Item>
          </ProDescriptions>
          <ChatWidget ownMessage={ownMessage && ownMessage} />
        </>
      )}
    </section>
  );
};

export default OrderInfo;
