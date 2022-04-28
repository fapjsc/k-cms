import React from "react";
import { Button } from "antd";
import throttle from "lodash/throttle";

const ThrottleButton = (props) => {
  const { onClick, type, content } = props;

  return (
    <Button
      {...props}
      type={type || "primary"}
      onClick={throttle(onClick, 2000)}
    >
      {content}
    </Button>
  );
};

export default ThrottleButton;
