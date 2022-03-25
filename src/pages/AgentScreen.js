import React, { useEffect } from "react";

// Components
import AgentTable from "../components/agent/AgentTable";

import { connectWithAgentSocket } from "../lib/agentSocket";

const AgentScreen = () => {
  useEffect(() => {
    connectWithAgentSocket();
  }, []);

  return (
    <div>
      <AgentTable />
    </div>
  );
};

export default AgentScreen;
