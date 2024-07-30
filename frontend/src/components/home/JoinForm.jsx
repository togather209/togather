import React from "react";

import "./JoinForm.css";
import Button from "../common/Button";
import BackButton from "../common/BackButton";

function JoinForm() {
  return (
    <div>
      <BackButton />
      <div className="joinform">
        <div className="joinform-header">
          <p className="joinform-desc">모임의 참여코드를 입력해주세요</p>
          <form action="">
            <div className="join-code">
              <input
                className="join-input"
                type="text"
                placeholder="참여코드 6자"
              />
            </div>
            <Button text={"참여"} type={"purple"} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinForm;
