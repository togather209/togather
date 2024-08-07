import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/slices/userSlice";
import { setAccount } from "../redux/slices/accountSlice";

const PrivateRoute = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        try {
          const memberResponse = await axiosInstance.get("/members/me");
          dispatch(setUser({ member: memberResponse.data.data }));

          // const accountResponse = await axiosInstance.get(
          //   "/pay-accounts/members/me"
          // );
          // dispatch(setAccount({ account: accountResponse.data.data }));
        } catch (error) {
          console.log("데이터 불러오기 에러", error);
        }
      }
    };

    fetchData();
  }, [accessToken, dispatch]);

  return accessToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
