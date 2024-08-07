import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/slices/userSlice";
import { setAccount } from "../redux/slices/accountSlice";
import { setLinkedAccount } from "../redux/slices/linkedAccount";

const PrivateRoute = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const payAccountId = useSelector((state) => state.account.account);

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        try {
          const memberResponse = await axiosInstance.get("/members/me");
          dispatch(setUser({ member: memberResponse.data.data }));

          try {
            const accountResponse = await axiosInstance.get("/pay-accounts/members/me");
            await dispatch(setAccount({ account: accountResponse.data.data }));
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.log("계좌가 생성되지 않았습니다.");
            } else {
              console.error("계좌 정보를 불러오는 도중 에러가 발생했습니다.", error);
            }
          }
        } catch (error) {
          console.log("데이터 불러오기 에러", error);
        }
      }
    };

    fetchData();
  }, [accessToken, dispatch]);

  useEffect(() => {
    const fetchLinkedAccount = async () => {
      if (payAccountId) {
        try {
          const linkedAccountResponse = await axiosInstance.get(`/pay-accounts/${payAccountId.payAccountId}/find-account`);
          dispatch(setLinkedAccount({ linkedAccountInfo: linkedAccountResponse.data.data }));
        } catch (error) {
          console.log("연동 계좌가 없는뎁숑");
        }
      }
    };

    fetchLinkedAccount();
  }, [payAccountId, dispatch]);

  return accessToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
