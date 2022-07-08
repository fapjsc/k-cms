import React, { useState, useRef } from "react";
// import useHttp from "../hooks/useHttp";
import ProTable from "@ant-design/pro-table";
import { Statistic, Space, Avatar, Typography } from "antd";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { Tag } from "antd";
// Excel
import writeData from "../lib/order-history-xls-service";

import { ExportOutlined } from "@ant-design/icons";

// Components
import ThrottleButton from "../components/ui/ThrottleButton";

import { getOrderHistory } from "../lib/api";
import {
  filterTitle,
  filterPhone,
  filterMasterType,
  filterStatistics,
} from "../lib/filterHelper";

let data;

const OrderHistoryScreen = ({ history }) => {
  const [titleEnum, setTitleEnum] = useState({});
  const [phoneEnum, setPhoneEnum] = useState({});
  const [masterTypeEnum, setMasterTypeEnum] = useState({});

  const [statistics, setStatistics] = useState({
    title: ["全部"],
    data: {},
  });

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

  const maserTypeHelper = (typeID) => {
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

    return {
      text,
      color,
    };
  };

  const getFilterTimeRange = (timeRange) => {
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

    return {
      beginDate,
      endDate,
    };
  };

  const originEnumObj = (data) => {
    let titleObj = {};
    let phoneObj = {};
    let masterTypeObj = {};

    console.log(data);

    data.forEach((el) => {
      const { Title, User_Tel, Order_MasterTypeID: typeID } = el || {};

      if (Title) {
        titleObj[Title] = {
          text: Title,
          tel: titleObj[Title]?.tel
            ? [...titleObj[Title]?.tel, el.User_Tel]
            : [el.User_Tel],
          masterType: titleObj[Title]?.masterType
            ? [...titleObj[Title]?.masterType, typeID.toString()]
            : [typeID.toString()],
        };

        titleObj[Title].tel = [...new Set(titleObj[Title].tel)];
        titleObj[Title].masterType = [...new Set(titleObj[Title].masterType)];
      }

      if (typeID >= 0) {
        const { color, text } = maserTypeHelper(typeID);
        masterTypeObj[typeID] = {
          text: <Tag color={color}>{text}</Tag>,
          typeID,
          tel: masterTypeObj[typeID]?.tel
            ? [...masterTypeObj[typeID]?.tel, User_Tel]
            : [User_Tel],
          title: masterTypeObj[typeID]?.title
            ? [...masterTypeObj[typeID]?.title, Title]
            : [Title],
        };

        masterTypeObj[typeID].title = [...new Set(masterTypeObj[typeID].title)];
        masterTypeObj[typeID].tel = [...new Set(masterTypeObj[typeID].tel)];
      }

      if (User_Tel) {
        phoneObj[el.User_Tel] = {
          text: User_Tel,
          title: phoneObj[User_Tel]?.title
            ? [...phoneObj[User_Tel]?.title, Title]
            : [Title],
          masterType: phoneObj[User_Tel]?.masterType
            ? [...phoneObj[User_Tel]?.masterType, typeID.toString()]
            : [typeID.toString()],
        };

        phoneObj[User_Tel].masterType = [
          ...new Set(phoneObj[User_Tel].masterType),
        ];
        phoneObj[User_Tel].title = [...new Set(phoneObj[User_Tel].title)];
      }
    });

    return {
      titleObj,
      phoneObj,
      masterTypeObj,
    };
  };

  const filterPhoneEnum = ({ filterType, filerTitle, phoneObj }) => {
    let newPhoneObj;

    const phoneArr = filterPhone({ filterType, filerTitle, phoneObj });

    if (phoneArr.length) {
      newPhoneObj = phoneArr.reduce((acc, cur) => {
        const { text, title, masterType } = cur;
        acc[text] = { text, title, masterType };
        return acc;
      }, {});

      return newPhoneObj;
    }

    return phoneObj;
  };

  const filterTitleEnum = ({ titleObj, filterType, filterTel }) => {
    let newTitleOjb;

    const titleArr = filterTitle({
      object: titleObj,
      masterType: filterType,
      tel: filterTel,
    });

    if (titleArr.length) {
      newTitleOjb = titleArr.reduce((acc, cur) => {
        const { text } = cur;
        acc[text] = { text };
        return acc;
      }, {});

      return newTitleOjb;
    }

    return titleObj;
  };

  const filterMasterTypeEnum = ({ masterTypeObj, filerTitle, filterTel }) => {
    let typeArr = filterMasterType({ masterTypeObj, filerTitle, filterTel });
    let newTypeObj;

    if (typeArr.length) {
      newTypeObj = typeArr.reduce((acc, cur) => {
        const { text, typeID } = cur;
        acc[typeID] = { text };
        return acc;
      }, {});

      return newTypeObj;
    }
    return masterTypeObj;
  };

  const statisticsHandler = ({ data, filerTitle, filterTel }) => {
    data = filterStatistics({ data, filerTitle, filterTel });

    const obj = data.reduce((prev, curr) => {
      const { Order_MasterTypeID: typeID } = curr;
      prev[typeID] = { total: curr.UsdtAmt + (prev[typeID]?.total || 0) };
      return prev;
    }, {});

    setStatistics((prev) => ({
      title: filerTitle || ["全部"],
      data: obj,
    }));
  };

  const requestPromise = async (params, sort, filter) => {
    const {
      Title: filerTitle,
      Order_MasterTypeID: filterType,
      User_Tel: filterTel,
    } = filter;

    /**
     * 這裡的 token 來自 column 裡面的 Time Range，他的 dateIndex 是 token
     * 因為 column 一定要有值，搜尋的時候才會出現在 params 裡面
     * 所以將 Time Range 這個 column 賦值，這邊不一定要給 token，任何 server 有返回的數據都行
     * 然後使用 hideInTable: true, 將 Time Range 隱藏起來
     * 這是一個取巧的做法
     */
    const { token: timeRange } = params;
    const { beginDate, endDate } = getFilterTimeRange(timeRange);

    data = await getOrderHistory({
      beginDate,
      endDate,
    });

    statisticsHandler({ data, filerTitle, filterTel });

    let { titleObj, phoneObj, masterTypeObj } = originEnumObj(data);

    phoneObj = filterPhoneEnum({ filterType, filerTitle, phoneObj });
    titleObj = filterTitleEnum({ titleObj, filterType, filterTel });
    masterTypeObj = filterMasterTypeEnum({
      masterTypeObj,
      filterTel,
      filerTitle,
    });

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

  const tableTitle = (
    <Space size="large">
      {statistics.title.map((el) => (
        <Avatar key={el} size="large" shape="square">
          {el}
        </Avatar>
      ))}

      {[
        { text: "買入", color: "blue", type: 0 },
        { text: "賣出", color: "red", type: 1 },
        { text: "轉出", color: "purple", type: 2 },
        { text: "轉入", color: "purple", type: 3 },
      ].map((el) => (
        <span key={el.type}>
          <Tag color={el.color}>{el.text}</Tag>
          <Typography.Text
            style={{ width: "5.8rem" }}
            ellipsis={{
              rows: 1,
              expandable: false,
              tooltip: statistics.data[el.type]?.total
            }}
            copyable={statistics.data[el.type]?.total}
          >
            {statistics.data[el.type]?.total || 0}
          </Typography.Text>
        </span>
      ))}
    </Space>
  );

  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      request={requestPromise}
      headerTitle={tableTitle}
      // onDataSourceChange={(dataSource) => console.log(dataSource)}
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
