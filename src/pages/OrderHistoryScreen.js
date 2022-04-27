import React from "react";
// import useHttp from "../hooks/useHttp";
import ProTable from "@ant-design/pro-table";
import { Statistic } from "antd";
import moment from "moment";
import { v4 as uuid } from "uuid";
// import { LightFilter, ProFormDateRangePicker } from "@ant-sdesign/pro-form";

import { getOrderHistory } from "../lib/api";

const OrderHistoryScreen = () => {
  //   const { sendRequest } = useHttp(getOrderHistory);
  //   useEffect(() => {
  //     sendRequest({ endDate: "2022/5/1 00:00", beginDate: "2022/04/01 00:00" });
  //   }, [sendRequest]);

  const columns = [
    {
      title: "交易確認時間",
      dataIndex: "ConfirmedDate",
      search: false,
      sorter: (a, b) =>
        new Date(a.ConfirmedDate).getTime() -
        new Date(b.ConfirmedDate).getTime(),
    },
    {
      title: "Title",
      dataIndex: "Title",
      search: false,
      onFilter: true,
      filters: true,
      width: 80,
      valueEnum: {
        DEMO: { text: "DEMO" },
        K100U: { text: "K100U" },
        "88U": { text: "88U" },
        JP88: { text: "JP88" },
      },
    },
    // {
    //   title: "Channel",
    //   dataIndex: "Channel",
    //   search: false,
    //   onFilter: true,
    //   filters: true,
    //   width: 100,
    //   valueEnum: {
    //     1: "DEMO",
    //     2: "88U",
    //     3: "U88",
    //     4: "JP88",
    //     5: "K100U",
    //   },
    // },

    {
      title: "交易類別",
      key: "Order_MasterTypeID",
      dataIndex: "Order_MasterTypeID",
      search: false,
      onFilter: true,
      filters: true,
      width: 100,
      valueEnum: {
        0: { text: "買入" },
        1: { text: "賣出" },
        2: { text: "轉出" },
        3: { text: "轉入" },
        // 98: { text: "交易取消", status: "Error" },
        // 99: { text: "交易超時", status: "Processing" },
      },
    },
    {
      title: "類型描述",
      dataIndex: "Order_TypeDesc",
      //   ellipsis: true,
      search: false,
    },
    {
      title: "收款帳號",
      key: "P1",
      dataIndex: "P1",
      ellipsis: true,
      copyable: true,
      search: false,
    },

    {
      title: "UsdtAmt",
      key: "UsdtAmt",
      dataIndex: "UsdtAmt",
      search: false,
      render: (text) => (
        <Statistic valueStyle={{ fontSize: 14 }} value={text} />
      ),
    },
    {
      title: "手機",
      dataIndex: "User_Tel",
      copyable: true,
      //   search: false,
    },
    // {
    //   title: "Token",
    //   dataIndex: "token",
    //   copyable: true,
    //   ellipsis: true,
    //   search: false,
    // },

    {
      title: "Tx_HASH",
      key: "Tx_HASH",
      dataIndex: "Tx_HASH",
      ellipsis: true,
      copyable: true,
      search: false,
    },

    {
      title: "Time Range",
      valueType: "dateTimeRange",
      dataIndex: "token",
      hideInTable: true,
      tip: "Default : 當日 00:00 - 隔日 00:00",
      fieldProps: {
        format: "YYYY/MM/DD HH:mm",
        defaultValue: [
          moment().startOf("days"),
          moment().add(1, "days").startOf("days"),
        ],
      },
      colSize: 2,
    },
  ];

  const requestPromise = async (params, sort, filter) => {
    // 這裡的 token 來自 column 裡面的 Time Range，他的 dateIndex 是 token
    // 因為一定要有column一定要有值，搜尋的時候才會出現線 params 裡面
    // 所以將 Time Range 這個 column 賦值，這邊不一定要給 token，給其他 server 有返回的都行
    // 然後使用 hideInTable: true, 將 Time Range 隱藏起來
    // 這是一個取巧的做法
    const { token: timeRange, User_Tel: tel } = params;

    let data;
    let beginDate;
    let endDate;

    if (!timeRange?.length) {
      beginDate = moment().startOf("day").format("YYYY/MM/DD HH:mm");
      endDate = moment()
        .add(1, "days")
        .startOf("days")
        .format("YYYY/MM/DD HH:mm");
    }

    if (timeRange?.length) {
      beginDate = timeRange[0];
      endDate = timeRange[1];
    }

    data = await getOrderHistory({
      // endDate: "2022/4/10 00:00",
      // beginDate: "2022/04/01 00:00",
      beginDate,
      endDate,
    });

    if (tel) {
      data = data.filter((el) => el.User_Tel === Number(tel));
    }

    return Promise.resolve({
      success: true,
      data: data,
    });
  };

  return (
    <ProTable
      columns={columns}
      request={requestPromise}
      headerTitle={`*訂單紀錄`}
      rowKey={(record) => {
        return uuid();
      }}
      search={{
        labelWidth: "auto",
      }}
      pagination={{
        pageSize: 10,
        // onChange: (page) => console.log(page),
      }}
    />
  );
};

export default OrderHistoryScreen;
