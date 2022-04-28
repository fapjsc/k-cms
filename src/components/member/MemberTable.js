import React, { useEffect, useRef, useState } from "react";

import { useHistory } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Antd
import ProTable from "@ant-design/pro-table";
import { Statistic, Button } from "antd";

const MemberTable = () => {
  // InitState
  const [titleEnum, setTitleEnum] = useState({});

  // Router
  const history = useHistory();

  // Redux
  const { memberList } = useSelector((state) => state.member);

  // Ref
  const actionRef = useRef();

  const columns = [
    {
      title: "Title",
      dataIndex: "Title",
      search: false,
      onFilter: true,
      filters: true,
      valueEnum: titleEnum,
      // valueEnum: {
      //   DEMO: { text: "DEMO" },
      //   K100U: { text: "K100U" },
      //   "88U": { text: "88U" },
      //   JP88: { text: "JP88" },
      // },
    },
    {
      title: "區碼",
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
      title: "手機",
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

    // {
    //   title: "Channel",
    //   dataIndex: "Channel",
    //   search: false,
    //   onFilter: true,
    //   filters: true,
    //   valueEnum: {
    //     1: "DEMO",
    //     2: "88U",
    //     3: "U88",
    //     4: "JP88",
    //     5: "K100U",
    //   },
    // },

    {
      title: "isAgent",
      dataIndex: "isAgent",
      search: false,
      onFilter: true,
      filters: true,
      valueEnum: {
        0: { text: "NO", status: "Default" },
        1: { text: "YES", status: "Success" },
      },
    },
    {
      title: "操作",
      align: "center",
      search: false,
      render: (text, record, _, action) => {
        return [
          <Button
            type="link"
            key="view"
            onClick={() => {
              history.push({
                pathname: `${history.location.pathname}/${record.token}`,
                state: { tel: record.User_Tel },
              });
            }}
          >
            歷史訂單
          </Button>,
        ];
      },
    },
  ];

  const requestPromise = async (params) => {
    if (!memberList) return;

    let data = memberList;

    let titleEnumObj = {};

    data.forEach((el) => {
      const { Title } = el || {};
      if (Title) {
        titleEnumObj[Title] = { text: Title };
      }
    });

    setTitleEnum(titleEnumObj);

    let { Title: title, User_Tel: tel } = params || {};

    tel = tel * 1;

    if (title && !tel) {
      data = memberList.filter((el) => el.Title === title);
    }

    if (!title && tel) {
      data = memberList.filter((el) => el.User_Tel === tel);
    }

    if (title && tel) {
      data = memberList.filter(
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
  }, [memberList]);

  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      request={requestPromise}
      debounceTime={300}
      rowKey={(record) => record.token}
      headerTitle={`*Member List`}
      pagination={{
        showQuickJumper: true,
        defaultPageSize: 10,
      }}
    />
  );
};

export default MemberTable;
