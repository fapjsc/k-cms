import { useEffect } from "react";
import ProDescriptions from "@ant-design/pro-descriptions";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Actions
import {
  setLiveSelectOwnMessage,
  setLiveSelectToken,
  setLiveSelectOrder,
  setLiveSelectThread,
  cancelOrder,
  cleanCancelStatus,
  // removeSelectData,
  clearSelectOrder,
} from "../../store/actions/liveOrderAction";

// Hooks
import useHttp from "../../hooks/useHttp";

// Apis
import { getOrderInfo } from "../../lib/api";

// Components
import ChatWidget from "./ChatWidget-tmp";

// Antd
import { Spin, Space, Button, Popconfirm, message, Result } from "antd";

const OrderInfo = ({ history, match }) => {
  const token = match.params.token;

  // Redux
  const dispatch = useDispatch();

  const { selectOrder, selectThread, selectToken } = useSelector(
    (state) => state.liveOrder
  );
  const { Order_StatusID: orderStatusID } = selectOrder || {};

  const { messageList } = useSelector((state) => state.message);

  const {
    loading: cancelLoading,
    error: cancelError,
    data: cancelData,
  } = useSelector((state) => state.cancel);

  // Http
  const {
    status: getOrderInfoStatus,
    data: getOrderInfoData,
    error: getOrderInfoError,
    sendRequest: getOrderInfoReq,
    // clearStatus: getOrderInfoClearStatus,
  } = useHttp(getOrderInfo);

  const columns = [
    {
      title: "訂單發起時間",
      key: "CreateDate",
      dataIndex: "CreateDate",
      valueType: "dateTime",
    },
    {
      title: "付款時間",
      key: "PayDate",
      dataIndex: "Date",
      valueType: "dateTime",
    },
    {
      title: "代理",
      key: "AgentTel",
      dataIndex: "Agent_tel",
      ellipsis: true,
    },

    {
      title: "收款姓名",
      key: "P2",
      dataIndex: "P2",
      ellipsis: true,
    },
    {
      title: "付款人姓名",
      key: "P5",
      dataIndex: "P5",
      render: (text) => <span>{text?.split("|")[0] || '-'}</span>,
    },

    {
      title: '會員',
      key: "clientTel",
      dataIndex: "Client_tel",
      ellipsis: true,
    },
   

    {
      title: "收款銀行",
      key: "P3",
      dataIndex: "P3",
    },
    {
      title: "付款銀行",
      key: "P5",
      dataIndex: "P5",
      ellipsis: true,
      render: (text) => <span>{text?.split("|")[2] || '-'}</span>,

    },
    {
      title: "手續費",
      key: "D3",
      dataIndex: "D3",
    },

    {
      title: "收款帳號",
      key: "P1",
      dataIndex: "P1",
      ellipsis: true,
    },
    {
      title: "付款帳號",
      key: "P5",
      dataIndex: "P5",
      render: (text) => <span>{text?.split("|")[1] || '-'}</span>,
    },
    {
      title: "狀態",
      key: "Status",
      dataIndex: "Order_StatusID",
      valueEnum: {
        1: { text: "交易成功", status: "Default" },
        31: { text: "配對中", status: "Success" },
        33: { text: "等待付款", status: "Processing" },
        34: { text: "等待收款", status: "Error" },
        35: { text: "申訴", status: "Default" },
        98: { text: "交易超時", status: "Default" },
        99: { text: "交易取消", status: "Default" },
      },
    },

    {
      title: "所在省市",
      key: "P4",
      dataIndex: "P4",
      ellipsis: true,
    },
    {
      title: "-",
      key: "empty",
      dataIndex: "",
    },
   
    {
      title: "交易類別",
      key: "MasterType",
      dataIndex: "MasterType",
      valueEnum: {
        0: { text: "買入" },
        1: { text: "賣出" },
        2: { text: "轉出" },
        3: { text: "轉入" },
        // 98: { text: '交易取消', status: 'Error' },
        // 99: { text: '交易超時', status: 'Processing' },
      },
    },






    {
      title: "UsdtAmt",
      key: "UsdtAmt",
      dataIndex: "UsdtAmt",
    },
    {
      title: "總價",
      key: "D2",
      dataIndex: "D2",
    },
    {
      title: "匯率",
      key: "D1",
      dataIndex: "D1",
    },

    {
      title: "BVAC Client",
      key: "BVAC_ClientName",
      dataIndex: "BVAC_ClientName",
      ellipsis: true,
    },
    {
      title: "BVAC Order",
      key: "BVAC_ClientOrder",
      dataIndex: "BVAC_ClientOrder",
      ellipsis: true,
    },
    {
      title: "Tx_HASH",
      key: "Tx_HASH",
      dataIndex: "Tx_HASH",
      ellipsis: true,
      copyable: true
    },
  ];

  let ownMessageObj = messageList.filter(
    (m) => Object.keys(m)[0] === selectThread
  )[0];

  let ownMessage = ownMessageObj && Object.values(ownMessageObj)[0];

  useEffect(() => {
    if (ownMessage && ownMessage.length) {
      // console.log(ownMessage);
      dispatch(setLiveSelectOwnMessage(ownMessage));
    }
  }, [dispatch, ownMessage]);

  useEffect(() => {
    getOrderInfoReq(token);
    dispatch(setLiveSelectToken(token));

    return () => {
      dispatch(clearSelectOrder());
    };
    // eslint-disable-next-line
  }, [getOrderInfoReq, dispatch, selectToken]);

  useEffect(() => {
    if (getOrderInfoStatus === "pending") {
      // console.log("loading...");
      return;
    }

    if (getOrderInfoError) {
      return;
    }

    if (getOrderInfoStatus === "completed" && getOrderInfoData) {
      dispatch(setLiveSelectOrder(getOrderInfoData));
      dispatch(setLiveSelectThread(getOrderInfoData.Tx_HASH));
    }
  }, [
    getOrderInfoStatus,
    getOrderInfoData,
    getOrderInfoError,
    dispatch,
    history,
  ]);

  // 取消訂單
  useEffect(() => {
    const key = "cancel-message";

    const onClose = () => {
      dispatch(cleanCancelStatus());
      getOrderInfoReq(token);
    };

    if (cancelLoading) {
      message.loading({ content: "Loading...", key });
    }

    if (cancelError) {
      message.error({ content: "取消失敗", key, duration: 1, onClose });
    }

    if (cancelData) {
      message.success({ content: "訂單已經取消", key, duration: 1, onClose });
    }
  }, [
    cancelError,
    cancelData,
    cancelLoading,
    dispatch,
    getOrderInfoReq,
    token,
  ]);

  if (getOrderInfoError) {
    return (
      <Result
        status="500"
        title="無法獲取訂單資訊"
        // subTitle=""s
        extra={
          <Button type="primary" onClick={() => history.goBack()}>
            Back Home
          </Button>
        }
      />
    );
  }

  return (
    <section style={{ height: "90vh", position: "relative" }}>
      {getOrderInfoStatus === "pending" && (
        <Space
          size="middle"
          style={{ margin: "15rem ", textAlign: "center", display: "block" }}
        >
          <Spin size="large" />
        </Space>
      )}

      {selectOrder && getOrderInfoStatus !== "pending" && (
        <>
          <ProDescriptions
            bordered={true}
            title={
              <Popconfirm
                key="cancel-pop"
                title={` 確定要取消嗎？`}
                okText="Yes"
                cancelText="No"
                onConfirm={() => dispatch(cancelOrder(selectToken))}
                disabled={orderStatusID !== 35 || cancelLoading}
              >
                <Button
                  type="danger"
                  disabled={orderStatusID !== 35 || cancelLoading}
                >
                  取消訂單
                </Button>
              </Popconfirm>
            }
            dataSource={selectOrder}
            columns={columns}
          >
            <ProDescriptions.Item valueType="option">
              <Button
                type="link"
                onClick={() => {
                  getOrderInfoReq(token);
                }}
                key="reload"
              >
                刷新
              </Button>
              <Button type="link" onClick={() => history.goBack()}>
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
