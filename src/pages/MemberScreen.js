import React, { useEffect } from "react";

// Components
import MemberTable from "../components/member/MemberTable";

import {
  connectWithMemberSocket,
  closeMemberSocket,
} from "../lib/memberSocket";

const MemberScreen = () => {
  useEffect(() => {
    connectWithMemberSocket();

    return () => {
      closeMemberSocket();
    };
  }, []);

  return (
    <div>
      <MemberTable />
    </div>
  );
};

export default MemberScreen;
