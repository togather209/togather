import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setReceiptData,
  setActiveTab,
} from "../../../redux/slices/receiptSlice";
import "./ReceiptForm.css";
import BackButton from "../../common/BackButton";
import Design from "./DesignComponent";
import Recognize from "./RecognizeComponent";
import Calculate from "./CalculateComponent";

function ReceiptRegistForm() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.receipt.activeTab);
  const receiptData = useSelector((state) => state.receipt);

  const handleSetActiveTab = (tab, items = [], storeName = "", date = "") => {
    dispatch(setActiveTab(tab));

    if (items.length > 0) {
      dispatch(
        setReceiptData({
          ...receiptData,
          items: items,
          businessName: businessName,
          paymentDate: paymentDate,
          totalPrice: items.reduce((total, item) => total + item.price, 0),
        })
      );
    }
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <BackButton />
        <div className="form-title">어떤 영수증인가요?</div>
      </header>
      <div className="tab-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "design" ? "active" : ""}`}
            onClick={() => dispatch(setActiveTab("design"))}
          >
            디자인
          </button>
          <button
            className={`tab-button ${
              activeTab === "recognize" ? "active" : ""
            }`}
            onClick={() => dispatch(setActiveTab("recognize"))}
          >
            인식
          </button>
          <button
            className={`tab-button ${
              activeTab === "calculate" ? "active" : ""
            }`}
            onClick={() => dispatch(setActiveTab("calculate"))}
          >
            정산
          </button>
        </div>
      </div>
      <div className="tab-content">
        {activeTab === "design" && <Design />}
        {activeTab === "recognize" && (
          <Recognize setActiveTab={handleSetActiveTab} />
        )}
        {activeTab === "calculate" && <Calculate />}
      </div>
    </div>
  );
}

export default ReceiptRegistForm;
