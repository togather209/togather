import React from "react";
import { Outlet } from "react-router-dom";

function HomeMainContainer() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default HomeMainContainer;
