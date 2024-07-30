import React from "react";
import { Outlet } from "react-router-dom";

function MeetingContainer() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default MeetingContainer;
