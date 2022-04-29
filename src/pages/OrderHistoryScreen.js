import React, { useState } from "react";
// import useHttp from "../hooks/useHttp";
import ProTable from "@ant-design/pro-table";
import { Statistic } from "antd";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { Tag } from "antd";

import { getOrderHistory } from "../lib/api";

const OrderHistoryScreen = () => {
  const [titleEnum, setTitleEnum] = useState({});

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
      valueEnum: titleEnum,
      // valueEnum: {
      //   DEMO: { text: "DEMO" },
      //   K100U: { text: "K100U" },
      //   "88U": { text: "88U" },
      //   JP88: { text: "JP88" },
      // },
    },

    {
      title: "交易類別",
      key: "Order_MasterTypeID",
      dataIndex: "Order_MasterTypeID",
      search: false,
      onFilter: true,
      filters: true,
      width: 100,
      valueEnum: {
        0: { text: <Tag color="blue">買入</Tag> },
        1: { text: <Tag color="red">賣出</Tag> },
        2: { text: <Tag color="purple">轉出</Tag> },
        3: { text: <Tag color="purple">轉入</Tag> },
      },
      // valueEnum: {
      //   0: { text: "買入" },
      //   1: { text: "賣出" },
      //   2: { text: "轉出" },
      //   3: { text: "轉入" },
      //   // 98: { text: "交易取消", status: "Error" },
      //   // 99: { text: "交易超時", status: "Processing" },
      // },
    },
    {
      title: "類型描述",
      dataIndex: "Order_TypeDesc",
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

    // 這個 column 是為了在搜索欄內使用時間範圍搜索
    // hideInTable: true, 是將這個 column 隱藏起來的意思
    {
      title: "時間範圍",
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
    /**
     * 這裡的 token 來自 column 裡面的 Time Range，他的 dateIndex 是 token
     * 因為 column 一定要有值，搜尋的時候才會出現在 params 裡面
     * 所以將 Time Range 這個 column 賦值，這邊不一定要給 token，任何 server 有返回的數據都行
     * 然後使用 hideInTable: true, 將 Time Range 隱藏起來
     * 這是一個取巧的做法
     */
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

    let titleObj = {};

    data.forEach((el) => {
      const { Title } = el || {};
      if (Title) {
        titleObj[el.Title] = { text: Title };
      }
    });

    setTitleEnum(titleObj);

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
      headerTitle={`*所有訂單紀錄`}
      rowKey={(record) => {
        return uuid();
      }}
      search={{
        labelWidth: "auto",
      }}
      pagination={{
        pageSize: 10,
        showQuickJumper: true,
        // onChange: (page) => console.log(page),
      }}
    />
  );
};

export default OrderHistoryScreen;
