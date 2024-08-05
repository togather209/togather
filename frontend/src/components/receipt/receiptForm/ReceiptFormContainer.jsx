import React, { useState } from "react";
import "./ReceiptForm.css";
import BackButton from "../../common/BackButton";
import Design from "./DesignComponent";
import Recognize from "./RecognizeComponent";
import Calculate from "./CalculateComponent";

function ReceiptRegistForm() {
  const [activeTab, setActiveTab] = useState("design");
  const [receiptData, setReceiptData] = useState({
    color: 0,
    items: [],
    businessName: null,
    connectedPlace: null,
    paymentDate: null,
    bookmarkId: -1,
    totalPrice: -1,
  });

  const handleSetActiveTab = (tab, items = [], storeName = "", date = "") => {
    setActiveTab(tab);
    if (items.length > 0) {
      setReceiptData((prevData) => ({
        ...prevData,
        items: items,
        businessName: storeName,
        paymentDate: date,
        totalPrice: items.reduce((total, item) => total + item.price, 0),
      }));
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
            onClick={() => {
              setActiveTab("design");
            }}
          >
            디자인
          </button>
          <button
            className={`tab-button ${
              activeTab === "recognize" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("recognize");
            }}
          >
            인식
          </button>
          <button
            className={`tab-button ${
              activeTab === "calculate" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("calculate");
            }}
          >
            정산
          </button>
        </div>
      </div>
      <div className="tab-content">
        {activeTab === "design" && (
          <Design
            setActiveTab={setActiveTab}
            receiptData={receiptData}
            setReceiptData={setReceiptData}
          />
        )}
        {activeTab === "recognize" && (
          <Recognize setActiveTab={handleSetActiveTab} />
        )}
        {activeTab === "calculate" && (
          <Calculate
            setActiveTab={setActiveTab}
            receiptData={receiptData}
            setReceiptData={setReceiptData}
          />
        )}
      </div>
    </div>
  );
}

export default ReceiptRegistForm;
