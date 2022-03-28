import React, { useEffect, useRef } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Moment
import moment from "moment";

// Antd
import ProTable from "@ant-design/pro-table";
import { Statistic, Tag, Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";

// Actions
import {
  getMemberInfo,
  cleanMemberInfo,
} from "../../store/actions/memberActions";

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

  // REf
  const actionRef = useRef();

  // Redux
  const dispatch = useDispatch();
  const { data: memberInfoList } = useSelector((state) => state.memberInfo);

  const columns = [
    {
      title: "交易類別",
      dataIndex: "MasterType",
      onFiler: true,
      filters: true,
      search: false,
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
      title: "交易時間",
      dataIndex: "Date",
      valueType: "dateTimeRange",
      colSize: 2,
      render: (e) => moment(e.props.text).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
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

  useEffect(() => {
    if (!token) return;
    dispatch(getMemberInfo(token));

    return () => {
      dispatch(cleanMemberInfo());
    };
  }, [token, dispatch]);

  const requestPromise = async (params) => {
    if (!memberInfoList) return;

    data = memberInfoList;

    const { Date: date, Tx_HASH: hash } = params || {};

    if (date && !hash) {
      data = memberInfoList.filter((el) => {
        const startTime = new Date(date[0]).getTime();
        const endTime = new Date(date[1]).getTime();
        const targetTime = new Date(el.Date).getTime();
        return targetTime >= startTime && targetTime <= endTime;
      });
    }

    if (!date && hash) {
      data = memberInfoList.filter((el) => el.Tx_HASH.includes(hash));
    }

    if (date && hash) {
      data = memberInfoList.filter((el) => {
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

    return Promise.resolve({
      success: true,
      data: data,
    });
  };

  useEffect(() => {
    actionRef.current?.reload();
  }, [memberInfoList]);

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
      debounceTime={300}
      headerTitle={` - ${localStorage.getItem("tel")} 歷史訂單`}
      search={{
        span: defaultColConfig,
      }}
      options={{
        reload: () => dispatch(getMemberInfo(token)),
      }}
      pagination={{
        showQuickJumper: true,
        defaultPageSize: 10,
      }}
      toolBarRender={() => [
        <Button
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
