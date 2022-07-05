import React, { useState, useRef } from "react";
// import useHttp from "../hooks/useHttp";
import ProTable from "@ant-design/pro-table";
import { Statistic } from "antd";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { Tag } from "antd";
// Excel
import writeData from "../lib/order-history-xls-service";

import { ExportOutlined } from "@ant-design/icons";

// Components
import ThrottleButton from "../components/ui/ThrottleButton";

import { getOrderHistory } from "../lib/api";

let data;

const OrderHistoryScreen = ({ history }) => {
  const [titleEnum, setTitleEnum] = useState({});
  const [phoneEnum, setPhoneEnum] = useState({});
  const [masterTypeEnum, setMasterTypeEnum] = useState({});

  const [isDownload, setIsDownload] = useState(false);

  // Ref
  const actionRef = useRef();

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
    },

    {
      title: "交易類別",
      key: "Order_MasterTypeID",
      dataIndex: "Order_MasterTypeID",
      search: false,
      onFilter: true,
      filters: true,
      width: 100,
      valueEnum: masterTypeEnum,

      // {
      //   0: { text: <Tag color="blue">買入</Tag> },
      //   1: { text: <Tag color="red">賣出</Tag> },
      //   2: { text: <Tag color="purple">轉出</Tag> },
      //   3: { text: <Tag color="purple">轉入</Tag> },
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
      search: false,
      onFilter: true,
      filters: true,
      valueEnum: phoneEnum,
    },

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
    const { Title: filerTitle, Order_MasterTypeID: filterType } = filter;

    /**
     * 這裡的 token 來自 column 裡面的 Time Range，他的 dateIndex 是 token
     * 因為 column 一定要有值，搜尋的時候才會出現在 params 裡面
     * 所以將 Time Range 這個 column 賦值，這邊不一定要給 token，任何 server 有返回的數據都行
     * 然後使用 hideInTable: true, 將 Time Range 隱藏起來
     * 這是一個取巧的做法
     */
    const { token: timeRange } = params;

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
      beginDate,
      endDate,
    });

    let titleObj = {};
    let phoneObj = {};
    let masterTypeObj = {};

    data.forEach((el) => {
      const { Title, User_Tel, Order_MasterTypeID: typeID } = el || {};

      if (Title) {
        titleObj[Title] = { text: Title };
      }

      if (typeID >= 0) {
        let text;
        let color;
        switch (typeID) {
          case 0:
            text = "買入";
            color = "blue";
            break;

          case 1:
            text = "賣出";
            color = "red";
            break;

          case 2:
            text = "轉出";
            color = "purple";
            break;

          case 3:
            text = "轉入";
            color = "purple";
            break;

          default:
            text = "";
            color = "";
        }

        masterTypeObj[typeID] = { text: <Tag color={color}>{text}</Tag> };
      }

      if (User_Tel) {
        phoneObj[el.User_Tel] = {
          text: User_Tel,
          title: Title,
          masterType: phoneObj[el.User_Tel]?.masterType
            ? [...phoneObj[el.User_Tel]?.masterType, typeID.toString()]
            : [typeID.toString()],
        };

        phoneObj[el.User_Tel].masterType = [
          ...new Set(phoneObj[el.User_Tel].masterType),
        ];
      }
    });

    let phoneArr = [];

    if (filerTitle && !filterType) {
      phoneArr = Object.values(phoneObj).filter((el) =>
        filerTitle.includes(el.title)
      );
    }

    if (!filerTitle && filterType) {
      phoneArr = Object.values(phoneObj).filter((el) => {
        return el.masterType.some((r) => filterType.includes(r));
      });
    }

    if (filerTitle && filterType) {
      phoneArr = Object.values(phoneObj).filter((el) => {
        return (
          filerTitle.includes(el.title) &&
          el.masterType.some((r) => filterType.includes(r))
        );
      });
    }

    if (phoneArr.length) {
      phoneObj = phoneArr.reduce((acc, cur) => {
        const { text, title, masterType } = cur;
        acc[text] = { text, title, masterType };
        return acc;
      }, {});
    }

    setTitleEnum(titleObj);
    setPhoneEnum(phoneObj);
    setMasterTypeEnum(masterTypeObj);

    return Promise.resolve({
      success: true,
      data: data,
    });
  };

  const downloadExcel = (data) => {
    if (!data?.length) {
      actionRef.current?.reload();
      return;
    }

    // 按照時間排序，由小到大
    const formatData = data.sort(
      (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
    );

    setIsDownload(true);

    // 匯出檔案名稱包含現在時間
    // const currentDateTime = moment().format("YYYY/MM/DD");
    const currentDateTime = moment().format("MMM Do YY");

    writeData(
      `訂單紀報表-${currentDateTime}.xlsx`,
      formatData,
      currentDateTime
    );

    setTimeout(() => {
      setIsDownload(false);
    }, 1000);
  };

  return (
    <ProTable
      actionRef={actionRef}
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
      onRow={(record) => ({
        style: { cursor: "pointer" },
        onClick: ({ target }) => {
          if (target.tagName === "SPAN") {
            history.push(`/order/${record.token}`);
          }
        },
      })}
      toolBarRender={() => [
        <ThrottleButton
          key="excel-button"
          icon={<ExportOutlined />}
          type="primary"
          content="匯出Excel"
          loading={isDownload}
          onClick={() => {
            downloadExcel(data);
          }}
        />,
      ]}
    />
  );
};

export default OrderHistoryScreen;
