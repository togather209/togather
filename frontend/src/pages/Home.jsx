import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

function Home() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Home;
