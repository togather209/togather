import "./MyPageMain.css";
import chunsik from "../../assets/icons/common/chunsik.png";
import profile from "../../assets/mypage/profile.png";
import terms from "../../assets/mypage/terms.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/slices/userSlice";
import { clearToken } from "../../redux/slices/authSlice";
import axios from "axios";

function MyPageMain() {
  const [secessionModalOpen, setSecessionModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const OpenSecessionModal = (e) => {
    e.preventDefault();
    setSecessionModalOpen(true);
  };

  const CloseSecessionModal = (e) => {
    e.preventDefault();
    setSecessionModalOpen(false);
  };

  const handleLogout = async () => {
    await axios.get(`/members/logout`);
    await dispatch(clearUser());
    await dispatch(clearToken());
    console.log("응 사라졌어!");
    navigate('/login');
  }

  return (
    <div className="mypage-container">
      <div className="mypage-profile">
        <img src={chunsik} alt="춘식" className="mypage-profile-image" />
        <p className="mypage-profile-name">KBG</p>
        <p className="mypage-profile-email">KBG28@naver.com</p>
        <button className="mypage-logout-button" onClick={handleLogout}>로그아웃</button>
      </div>
      <div className="mypage-content">
        <button className="mypage-my-wallet" onClick={() => navigate('/wallet')}>
          <p className="mypage-my-wallet-summary">만수르지갑</p>
          <p className="mypage-my-wallet-balance">27,000원</p>
        </button>
        <button className="mypage-my-profile-update" onClick={() => navigate('profile_update')}>
          <img
            src={profile}
            alt="내정보"
            className="mypage-my-profile-update-image"
          />
          <p>내 정보 수정</p>
        </button>
        <button className="mypage-my-profile-terms" onClick={() => navigate('terms')}>
          <img
            src={terms}
            alt="약관"
            className="mypage-my-profile-terms-image"
          />
          <p>약관 보기</p>
        </button>
        <div className="mypage-secession-container">
          <button className="mypage-secession" onClick={OpenSecessionModal}>
            회원 탈퇴
          </button>
        </div>
      </div>

      {secessionModalOpen && (
        <div className="mypage-secession-modal-container">
          <div className="mypage-secession-modal-content">
            <div className="mypage-secession-modal-isSecession">
              <p className="mypage-secession-modal-isSecession-title">
                정말 탈퇴하시겠습니까?
              </p>
              <p className="mypage-secession-modal-isSecession-content">
                회원님의 정보가 사라지게 됩니다.
              </p>
            </div>
            <div className="mypage-secession-modal-isSecession-button">
              <button
                onClick={CloseSecessionModal}
                className="mypage-secession-modal-isSecession-button-cancel"
              >
                취소
              </button>
              <button className="mypage-secession-modal-isSecession-button-ok">
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPageMain;
