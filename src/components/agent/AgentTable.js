import React, { useEffect, useRef, useState } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Router
import { useHistory } from "react-router-dom";

import ProTable from "@ant-design/pro-table";

// Antd
import { Badge, message, Switch, Button, Input, Statistic } from "antd";

const AgentTable = () => {
  // Ref
  const actionRef = useRef();

  // Router
  const history = useHistory();

  // Redux
  const dispatch = useDispatch();

  const { agentList } = useSelector((state) => state.agent);

  const columns = [
    {
      title: "Title",
      dataIndex: "Title",
      copyable: true,
    },
    {
      title: "User_Country",
      dataIndex: "User_Country",
      search: false,
      onFilter: true,
      filters: true,
      valueEnum: {
        886: { text: "台灣 -886" },
        86: { text: "中國 -86" },
        852: { text: "香港 -852" },
        81: { text: "日本 -81" },
      },
    },
    {
      title: "User_Tel",
      dataIndex: "User_Tel",
      copyable: true,
    },
    {
      title: "信用額度",
      dataIndex: "Credit",
      search: false,
      sorter: (a, b) => a.Credit - b.Credit,
      render: (text) => (
        <Statistic valueStyle={{ fontSize: 14 }} value={text} />
      ),
    },
    {
      title: "實際金額",
      dataIndex: "ActualBalance",
      search: false,
      sorter: (a, b) => a.ActualBalance - b.ActualBalance,
      render: (text) => (
        <Statistic valueStyle={{ fontSize: 14 }} value={text} />
      ),
    },
    {
      title: "可提金額",
      dataIndex: "AvbBalance",
      search: false,
      sorter: (a, b) => a.AvbBalance - b.AvbBalance,
      render: (text) => (
        <Statistic valueStyle={{ fontSize: 14 }} value={text} />
      ),
    },
    {
      title: "最大接單金額",
      dataIndex: "AgtBalance",
      search: false,
      sorter: (a, b) => a.AgtBalance - b.AgtBalance,
      render: (text) => (
        <Statistic valueStyle={{ fontSize: 14 }} value={text} />
      ),
    },

    {
      title: "Channel",
      dataIndex: "Channel",
      search: false,
      sorter: (a, b) => a.Channel - b.Channel,
    },

    {
      title: "isAgent",
      dataIndex: "isAgent",
      onFilter: true,
      filters: true,
      valueEnum: {
        0: { text: "NO", status: "Default" },
        1: { text: "YES", status: "Success" },
      },
    },
  ];

  const requestPromise = async (params) => {
    if (!agentList) return;
    console.log(params);

    let data = agentList;

    let { Title: title, User_Tel: tel } = params || {};

    tel = tel * 1;

    if (title && !tel) {
      data = agentList.filter((el) => el.Title === title);
    }

    if (!title && tel) {
      data = agentList.filter((el) => el.User_Tel === tel);
    }

    if (title && tel) {
      data = agentList.filter(
        (el) => el.User_Tel === tel && el.Title === title
      );
    }

    return Promise.resolve({
      success: true,
      data: data,
    });
  };

  useEffect(() => {
    actionRef.current?.reload();
  }, [agentList]);

  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      request={requestPromise}
      rowKey={(record) => record.token}
      pagination={{
        showQuickJumper: true,
        defaultPageSize: 10,
      }}
    />
  );
};

export default AgentTable;
