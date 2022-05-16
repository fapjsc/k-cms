import React, { useRef, useState } from "react";
import { ProFormDigit } from "@ant-design/pro-form";
import { Divider, Modal, Space, Statistic, message } from "antd";
import { StepsForm } from "@ant-design/pro-form";
import { connectWithMemberSocket } from "../../lib/memberSocket";

// import useHttp from '../../hooks/useHttp'

import { setUpCredit } from "../../lib/api";

const AdjustCreditForm = ({ visible, setVisible }) => {
  const [current, setCurrent] = useState(0);
  const [inputValue, setInputValue] = useState(null);
  const formMapRef = useRef();

  return (
    <Modal
      title={`調整信用額度`}
      visible={visible.show}
      onCancel={() =>
        setVisible((prev) => ({
          ...prev,
          show: false,
        }))
      }
      footer={null}
    >
      <StepsForm
        formMapRef={formMapRef}
        onCurrentChange={setCurrent}
        onFinish={async (values) => {
          const result = await setUpCredit({
            ...values,
            Token: visible.token,
            Remark: "test",
          });

          if (result.code === 200) {
            message.success("提交成功");
            connectWithMemberSocket();
          } else {
            message.error(result);
          }

          setVisible((prev) => ({
            ...prev,
            show: false,
          }));

          return Promise.resolve(true);
        }}
      >
        <StepsForm.StepForm
          name="step1"
          title="調整信用額度"
          onFinish={(values) => {
            setInputValue(values.CreditAmt);
            return Promise.resolve(true);
          }}
        >
          {current === 0 && (
            <Space
              direction="vertical"
              style={{ marginTop: "3rem", height: "15rem" }}
            >
              <Statistic title="現有信用額度" value={visible.credit} />
              <Divider />
              <ProFormDigit
                suffix="RMB"
                label="新的信用額度"
                name="CreditAmt"
                rules={[{ required: true, message: "請輸入新的信用額度" }]}
                fieldProps={{
                  formatter: (value) =>
                    // `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                }}
              />
            </Space>
          )}
        </StepsForm.StepForm>

        <StepsForm.StepForm name="step2" title="確認">
          {current === 1 && (
            <Space style={{ height: "15rem" }}>
              <Statistic
                title={`${visible.tel} 的信用額度及將調整為`}
                value={inputValue}
              />
            </Space>
          )}
        </StepsForm.StepForm>
      </StepsForm>
    </Modal>
  );
};

export default AdjustCreditForm;
