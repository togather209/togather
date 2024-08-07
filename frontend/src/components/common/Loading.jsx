import React from "react";
import "./Loading.css";

const Loading = ({ children, progress }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        {children && <div className="loading-text">{children}</div>}
        <div className="loading-subtext">잠시만 기다려주세요!</div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
