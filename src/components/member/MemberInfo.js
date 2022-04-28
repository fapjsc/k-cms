import React, { useRef, useState } from "react";

// Moment
import moment from "moment";

// Excel
import writeData from "../../lib/xls-service";

// Antd
import ProTable from "@ant-design/pro-table";
import { Statistic, Tag, Button } from "antd";
import { RollbackOutlined, ExportOutlined } from "@ant-design/icons";

// Actions
import { getMemberInfo } from "../../store/actions/memberActions";

// Components
// eslint-disable-next-line
import ThrottleButton from "../ui/ThrottleButton";

let data;

const MemberInfo = ({ match, history, location }) => {
  const {
    params: { token },
  } = match || {};

  const { state } = location || {};
  const { tel } = state || {};

  if (tel) {
    localStorage.setItem("tel", tel);
  }

  // initState
  const [isDownload, setIsDownload] = useState(false);

  // Ref
  const actionRef = useRef();

  const downloadExcel = (data) => {
    if (!data?.length) {
      actionRef.current?.reload();
      return;
    }

    const formatData = data.sort(
      (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
    );

    setIsDownload(true);

    const currentDateTime = moment().format("YYYY/MM/DD HH:mm");

    writeData(
      `k100U-${currentDateTime}.xlsx`,
      formatData,
      localStorage.getItem("tel")
    );

    setTimeout(() => {
      setIsDownload(false);
    }, 1000);
  };

  const columns = [
    {
      title: "交易時間",
      dataIndex: "Date",
      valueType: "dateTimeRange",
      colSize: 2,
      render: (e) => moment(e.props.text).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
      fieldProps: {
        format: "YYYY/MM/DD HH:mm",
        defaultValue: [
          moment().startOf("days"),
          moment().add(1, "days").startOf("days"),
        ],
      },
    },
    {
      title: "交易類別",
      dataIndex: "MasterType",
      search: false,
      onFilter: true,
      filters: true,
      valueEnum: {
        0: { text: <Tag color="blue">買入</Tag> },
        1: { text: <Tag color="red">賣出</Tag> },
        2: { text: <Tag color="purple">轉出</Tag> },
        3: { text: <Tag color="purple">轉入</Tag> },
      },
    },
    {
      title: "匯率",
      dataIndex: "D1",
      sorter: (a, b) => a.D1 - b.D1,
      search: false,
    },
    {
      title: "RMB",
      dataIndex: "D2",
      sorter: (a, b) => a.D2 - b.D2,
      search: false,
      render: (text) => (
        <Statistic
          valueStyle={{ fontSize: 14 }}
          value={text}
          prefix={text !== "-" && "¥"}
        />
      ),
    },
    {
      title: "UsdtAmt",
      dataIndex: "UsdtAmt",
      sorter: (a, b) => a.UsdtAmt - b.UsdtAmt,
      search: false,
      render: (text) => (
        <Statistic valueStyle={{ fontSize: 14 }} value={text} />
      ),
    },
    {
      title: "Balance",
      dataIndex: "Balance",
      sorter: (a, b) => a.Balance - b.Balance,
      search: false,
      render: (text) => (
        <Statistic valueStyle={{ fontSize: 14 }} value={text} />
      ),
    },
    {
      title: "Tx_HASH",
      dataIndex: "Tx_HASH",
      copyable: true,
      ellipsis: true,
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
              history.push(`/order/${record.token}`);
            }}
          >
            查看
          </Button>,
        ];
      },
    },
  ];

  const requestPromise = async (params, sort, filter) => {
    const { Date: date, Tx_HASH: hash } = params || {};

    data = await getMemberInfo(token);
    console.log(date);

    const startTime = moment().startOf("day").format("X");
    const endTime = moment().add(1, "days").startOf("days").format("X");

    if (date && !hash) {
      data = data.filter((el) => {
        const startTime = new Date(date[0]).getTime();
        const endTime = new Date(date[1]).getTime();
        const targetTime = new Date(el.Date).getTime();
        return targetTime >= startTime && targetTime <= endTime;
      });
    }
    if (date && hash) {
      data = data.filter((el) => {
        const targetTime = new Date(el.Date).getTime();
        const startTime = new Date(date[0]).getTime();
        const endTime = new Date(date[1]).getTime();
        return (
          targetTime >= startTime &&
          targetTime <= endTime &&
          el.Tx_HASH.includes(hash)
        );
      });
    }

    if (!date && hash) {
      data = data.filter((el) => {
        const targetTime = moment(el.Date).format("X");
        return (
          el.Tx_HASH.includes(hash) &&
          targetTime >= startTime &&
          targetTime <= endTime
        );
      });
    }

    if (!date && !hash) {
      data = data.filter((el) => {
        const targetTime = moment(el.Date).format("X");
        return targetTime >= startTime && targetTime <= endTime;
      });
    }

    return Promise.resolve({
      success: true,
      data: data,
    });
  };

  const defaultColConfig = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 8,
    xxl: 6,
  };

  return (
    <ProTable
      actionRef={actionRef}
      columns={columns}
      request={requestPromise}
      rowKey={(record) => record.token}
      // debounceTime={300}
      headerTitle={` - ${localStorage.getItem("tel")} 歷史訂單`}
      search={{
        span: defaultColConfig,
      }}
      pagination={{
        showQuickJumper: true,
        defaultPageSize: 10,
      }}
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
        <Button
          style={{ marginRight: "auto" }}
          key="return-button"
          icon={<RollbackOutlined />}
          type="text"
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </Button>,
      ]}
    />
  );
};

export default MemberInfo;
