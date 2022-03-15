import React, { useEffect } from "react";

import { Form, Input, Button, List, Typography, Space } from "antd";
import useHttp from "../hooks/useHttp";

import { getValidCode } from "../lib/api";

const ValidData = () => {
  const { sendRequest, data, error, status } = useHttp(getValidCode);

  const onFinish = (values) => {
    console.log("Success:", values);
    sendRequest(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    console.log(data, error, status);
  }, [data, error, status]);
  return (
    <Space direction="vertical" size="large">
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="inline"
      >
        <Form.Item
          label="區碼"
          name="countryCode"
          rules={[{ required: true, message: "Please input  countryCode!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="手機號碼"
          name="phoneNumber"
          rules={[{ required: true, message: "Please input  phoneNumber!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <List
        bordered
        dataSource={data || []}
        renderItem={(item) => (
          <List.Item>
            <Space size="large">
              <Typography.Text type="warning">[驗證碼]</Typography.Text>
              {item?.Code}
            </Space>
          </List.Item>
        )}
      />
    </Space>
  );
};

export default ValidData;
