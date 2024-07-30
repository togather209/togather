import React from "react";
import "./RegistForm.css";

import Button from "../common/Button";
import BackButton from "../common/BackButton";

function RegistForm() {
  return (
    <div>
      <BackButton />
      <div className="regist-form">
        <div className="regist-form-container">
          <div className="regist-header"></div>

          <div className="regist-desc">
            <p className="create-ques">어떤 모임인가요 ?</p>
            <p className="ques-desc">모임에 대한 정보를 입력해주세요</p>
          </div>

          <form action="" className="regist-input">
            <div className="img-container">
              <div className="content-container">
                <p className="img-input-desc">모임 대표 사진</p>
                <input className="" type="file" />
              </div>
            </div>
            <div className="meeting-name">
              <input className="name-input" type="text" placeholder="모임명" />
            </div>
            <div className="meeting-desc">
              <input className="desc-input" type="text" placeholder="설명" />
            </div>
            <Button text={"생성"} type={"purple"} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistForm;
