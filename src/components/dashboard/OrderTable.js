import { useEffect, useRef } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Router
import { useHistory } from "react-router-dom";

// Actions
import {
  setLiveSelectOrder,
  setLiveSelectThread,
  setLiveSelectToken,
  removeSelectData,
} from "../../store/actions/liveOrderAction";

import { openAlert, closeAlert } from "../../store/actions/alertActions";

import ProTable from "@ant-design/pro-table";

// Hooks
import useHttp from "../../hooks/useHttp";

// Apis
import { getOrderInfo } from "../../lib/api";

// WebSocket
import { connectWithLiveOrderSocket } from "../../lib/liveOrderSocket";

// Helper
import { _animateTitle } from "../../lib/helper";

// Antd
import { Badge, message, Switch, Button } from "antd";

const OrderTable = () => {
  // Http
  const {
    status: getOrderInfoStatus,
    data: getOrderInfoData,
    error: getOrderInfoError,
    sendRequest: getOrderInfoReq,
  } = useHttp(getOrderInfo);

  const actionRef = useRef();

  // Router
  const history = useHistory();

  // Redux
  const { soundSwitch } = useSelector((state) => state.alert);
  const { orderList } = useSelector((state) => state.liveOrder);
  const { unReadMessage } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Title",
      dataIndex: "Title",
      align: "center",
      copyable: true,
    },
    {
      title: "Type",
      width: 80,
      dataIndex: "OrderType",
      align: "center",
      sorter: (a, b) => a.OrderType - b.OrderType,
      search: false,
      render: (dom) => {
        if (dom === 0) return <span style={{ color: "#69c0ff" }}>買</span>;
        if (dom === 1) return <span style={{ color: "#ff7875" }}>賣</span>;
      },
    },
    {
      title: "Currency",
      dataIndex: "Currency",
      align: "center",
      search: false,
    },

    {
      title: "UsdtAmt",
      dataIndex: "UsdtAmt",
      align: "center",
      search: false,
      sorter: (a, b) => a.UsdtAmt - b.UsdtAmt,
    },

    {
      title: "Agent",
      align: "center",
      dataIndex: "Agent",
      search: false,
    },
    {
      title: "User",
      align: "center",
      dataIndex: "User",
      search: false,
    },
    {
      title: "CreateDate",
      dataIndex: "CreateDate",
      search: false,
      sorter: (a, b) =>
        new Date(a.CreateDate).getTime() - new Date(b.CreateDate).getTime(),
    },

    {
      title: "Status",
      dataIndex: "Order_StatusID",
      initialValue: "all",
      align: "center",
      search: false,
      filters: true,
      onFilter: true,
      filterMultiple: false,
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
      title: "Msg",
      dataIndex: "Message",
      align: "center",
      search: false,
      render: (_, row, index, action) => {
        let item = unReadMessage.find((el) => el.token === row.token);

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
              style={{ backgroundColor: item && item.count && "#f5222d" }}
            />
          );
        } else {
          return <span>-</span>;
        }
      },
    },
    {
      title: "操作",
      search: false,
      render: (text, record, _, action) => [
        <Button
          type="primary"
          key="view"
          onClick={() => {
            getOrderInfoReq(record.token);
            dispatch(setLiveSelectToken(record.token));
            localStorage.setItem("order", record.token);
          }}
        >
          查看
        </Button>,
      ],
    },
  ];

  useEffect(() => {
    const reloadIcon = document.getElementsByClassName("anticon-reload")[0];

    const handlerClick = () => {
      connectWithLiveOrderSocket();
      _animateTitle("K-CMS", false);
    };

    if (reloadIcon) {
      reloadIcon.addEventListener("click", handlerClick);
    }

    return () => {
      reloadIcon.removeEventListener("click", handlerClick);
    };
  }, []);

  useEffect(() => {
    const messageStyle = {
      position: "absolute",
      right: "5%",
    };

    const key = "updatable";

    message.destroy(key);

    if (getOrderInfoStatus === "pending") {
      console.log("loading...");
      message.loading({ content: "Loading...", key, style: messageStyle });
      return;
    }

    if (getOrderInfoError) {
      console.log(getOrderInfoError);
      message.error({
        content: "發生錯誤",
        key,
        duration: 2,
        style: messageStyle,
      });

      return;
    }

    if (getOrderInfoStatus === "completed" && getOrderInfoData) {
      console.log("get order info success.");
      message.success({
        content: "get order info success",
        key,
        duration: 2,
        style: messageStyle,
      });

      dispatch(setLiveSelectOrder(getOrderInfoData));
      dispatch(setLiveSelectThread(getOrderInfoData.Tx_HASH));
      history.push(`${history.location.pathname}/${getOrderInfoData.Tx_HASH}`);
    }
  }, [
    getOrderInfoStatus,
    getOrderInfoData,
    getOrderInfoError,
    dispatch,
    history,
  ]);

  useEffect(() => {
    dispatch(removeSelectData());
  }, [dispatch]);

  useEffect(() => {
    localStorage.removeItem("order");
  }, []);

  const toggleSound = (checked) => {
    if (checked) {
      dispatch(openAlert());
      connectWithLiveOrderSocket();
    }

    if (!checked) {
      dispatch(closeAlert());
    }
  };

  const requestPromise = async (params) => {
    let data = orderList;
    const { Title: title } = params || {};

    if (title) {
      data = orderList.filter((el) => el.Title === title);
    }

    return Promise.resolve({
      success: true,
      data: data,
    });
  };

  useEffect(() => {
    actionRef.current.reload();
  }, [orderList]);

  return (
    <>
      <ProTable
        actionRef={actionRef}
        // className="cursorPinter"
        columns={columns}
        // dataSource={orderList}
        request={requestPromise}
        // search={false}
        toolbar={false}
        rowKey={(record) => record.token}
        pagination={{
          showQuickJumper: true,
        }}
        toolBarRender={() => [
          <Switch
            checkedChildren="聲音已開啟"
            unCheckedChildren="聲音已關閉"
            defaultChecked={soundSwitch}
            onChange={toggleSound}
          />,
        ]}
      />
    </>
  );
};

export default OrderTable;
