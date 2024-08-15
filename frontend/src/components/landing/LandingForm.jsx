import React, { useState, useEffect } from "react";
import "./LandingForm.css"; // CSS 파일 임포트
import landing1 from "../../assets/landing/LANDING1.png";
import landing1Detail from "../../assets/landing/LANDING1DETAIL.png";
import landing2 from "../../assets/landing/LANDING2.png";
import landing2Detail from "../../assets/landing/LANDING2DETAIL.png";
import landing3 from "../../assets/landing/LANDING3.png";
import landing3Detail from "../../assets/landing/LANDING3DETAIL.png";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

function LandingForm() {
  const [step, setStep] = useState(0);
  const [fadeClass, setFadeClass] = useState("fade-in");
  const navigate = useNavigate();

  const steps = [
    {
      text: "우리만의 모임 생성 ",
      subtext: "친구들과 함께 모임과 일정을 만들어 볼 수 있어요.",
      image: landing1,
      detail: landing1Detail,
    },
    {
      text: "실시간 공동 작업",
      subtext: "음성 채팅과 공동 작업을 통해, 친구들과 더욱 편하게 일정을 조율 할 수 있어요.",
      image: landing2,
      detail: landing2Detail,
    },
    {
      text: "귀찮은 영수증 관리를 한번에",
      subtext: "OCR을 통해 영수증을 인식하거나, 직접 갤러리에서 찾아 등록해 보세요.",
      image: landing3,
      detail: landing3Detail,
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setFadeClass("fade-out");
      setTimeout(() => {
        setStep(step + 1);
        setFadeClass("fade-in");
      }, 300); // 애니메이션이 끝난 후 단계 변경
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setFadeClass("fade-out");
      setTimeout(() => {
        setStep(step - 1);
        setFadeClass("fade-in");
      }, 300); // 애니메이션이 끝난 후 단계 변경
    }
  };

  const handleSkip = () => {
    setFadeClass("fade-out");
    setTimeout(() => {
      setStep(steps.length - 1);
      setFadeClass("fade-in");
    }, 300);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="landing-container" {...handlers}>
      <div className="progress-dots">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === step ? "active" : ""}`}
          ></div>
        ))}
      </div>

      <div className={`content ${fadeClass}`}>
        <h1 className="text-content">{steps[step]?.text}</h1>
        <p className="subtext-content">{steps[step]?.subtext}</p>
        <div className="image-container">
          <img
            src={steps[step]?.image}
            alt="Landing background"
            className="image-content"
          />
          <img
            src={steps[step]?.detail}
            alt="Landing detail"
            className="detail-content"
          />
        </div>
      </div>

      {step < steps.length - 1 && (
        <button className="skip-button" onClick={handleSkip}>
          건너뛰기
        </button>
      )}

      {step === steps.length - 1 && (
        <div className="start-container">
          <button className="start-button" onClick={() => navigate("/login")}>
            시작하기
          </button>
        </div>
      )}
    </div>
  );
}

export default LandingForm;
