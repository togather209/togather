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
            if(accountResponse.status === 204){
              return;
            }
            else{
              await dispatch(setAccount({ account: accountResponse.data.data }));
            }
          } catch (error) {
            console.error("불러오기 에러", error);
          }
        } catch (error) {
          console.error("데이터 불러오기 에러", error);
        }
      }
    };

    fetchData();
  }, [accessToken, dispatch]);

  useEffect(() => {
    const fetchLinkedAccount = async () => {
      if (payAccountId) {
        try {
          const linkedAccountResponse = await axiosInstance.get(
            `/pay-accounts/${payAccountId.payAccountId}/find-account`
          );
          dispatch(
            setLinkedAccount({
              linkedAccountInfo: linkedAccountResponse.data.data,
            })
          );
        } catch (error) {
          console.error("연동 계좌가 없는뎁숑");
        }
      }
    };

    fetchLinkedAccount();
  }, [payAccountId, dispatch]);

  return accessToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
