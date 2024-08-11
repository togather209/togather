import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setReceiptData,
  setActiveTab,
  resetReceipt,
} from "../../../redux/slices/receiptSlice";
import "../receiptForm/ReceiptForm.css";
import BackButton from "../../common/BackButton";
import Design from "../receiptForm/DesignComponent";
import Recognize from "../receiptForm/RecognizeComponent";
import Calculate from "../receiptForm/CalculateComponent";
import { useLocation } from "react-router-dom";

function ReceiptUpdateContainer() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.receipt.activeTab);
  const receiptData = useSelector((state) => state.receipt);
  const location = useLocation();

  useEffect(() => {
    const { teamId, planId, receiptId, receiptData } = location.state || {};

    // 컴포넌트가 마운트될 때 초기화
    dispatch(resetReceipt());
    if (receiptData) {
      dispatch(
        setReceiptData({
          teamId,
          planId,
          receiptId,
          ...receiptData,
        })
      );
    }
  }, [dispatch, location.state]);

  return (
    <div className="form-container">
      <header className="form-header">
        <BackButton />
        <div className="form-title">영수증 수정</div>
      </header>
      <div className="tab-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "design" ? "active" : ""}`}
            onClick={() => {
              dispatch(setActiveTab("design"));
            }}
          >
            디자인
          </button>
          <button
            className={`tab-button ${
              activeTab === "recognize" ? "active" : ""
            }`}
            onClick={() => {
              activeTab === "calculate"
                ? dispatch(setActiveTab("recognize"))
                : "";
            }}
          >
            인식
          </button>
          <button
            className={`tab-button ${
              activeTab === "calculate" ? "active" : ""
            }`}
          >
            정산
          </button>
        </div>
      </div>
      <div className="tab-content">
        {activeTab === "design" && <Design defaultColor={receiptData.color} />}
        {activeTab === "recognize" && (
          <Recognize defaultReceipt={receiptData} />
        )}
        {activeTab === "calculate" && <Calculate />}
      </div>
    </div>
  );
}

export default ReceiptUpdateContainer;
