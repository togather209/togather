import React from "react";

import { Outlet } from "react-router-dom";

function MeetingDetailContainer() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default MeetingDetailContainer;
