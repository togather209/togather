import "./MyPageMain.css";
import chunsik from "../../assets/icons/common/chunsik.png";
import profile from "../../assets/mypage/profile.png";
import terms from "../../assets/mypage/terms.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "../../redux/slices/userSlice";
import { clearToken } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import { clearAccount, setAccount } from "../../redux/slices/accountSlice";

function MyPageMain() {
  const [secessionModalOpen, setSecessionModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const member = useSelector((state) => state.user.member);
  const account = useSelector((state) => state.account.account);

  //로딩될 때 멤버들 데이터 불러와서 redux에 저장한다.
  useEffect(() => {
    loadingMemberData();
    loadingAccountData();
  }, []);

  const loadingMemberData = async () => {
    try {
      const response = await axiosInstance.get("/members/me");
      dispatch(setUser({ member : response.data.data }));
      console.log(member);
    } catch (error) {
      console.error("데이터 불러오기실패", error);
    }
  };

  const loadingAccountData = async () => {
    try {
      const response = await axiosInstance.get('/pay-accounts/members/me');
      dispatch(setAccount({ account : response.data.data }));
      console.log(account);
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  }

  const openSecessionModal = (e) => {
    e.preventDefault();
    setSecessionModalOpen(true);
  };

  const closeSecessionModal = (e) => {
    e.preventDefault();
    setSecessionModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/members/logout");
      dispatch(clearUser());
      dispatch(clearToken());
      alert("로그아웃 되었습니다.");
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그아웃 실패! 다시 해주세요.");
    }
  };

  const secessionMember = async () => {
    if(account.balance > 0){
      alert("Pay계좌에 잔액이 남아있습니다. 잔액을 비운 후 탈퇴를 진행해 주세요.");
      return;
    }
    else{
      //회원 탈퇴 진행
      axiosInstance.delete('/members/me');
      dispatch(clearUser());
      dispatch(clearToken());
      dispatch(clearAccount());
      alert("서비스를 이용해주셔서 감사드립니다. 회원 탈퇴완료 되었습니다.");
    }
  }

  return (
    <div className="mypage-container">
      <div className="mypage-profile">
        <img src={chunsik} alt="춘식" className="mypage-profile-image" />
        <p className="mypage-profile-name">{member?.nickname}</p>
        <p className="mypage-profile-email">{member?.email}</p>
        <button className="mypage-logout-button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
      <div className="mypage-content">
        {account !== null ? 
        <button
          className="mypage-my-wallet"
          onClick={() => navigate("/wallet")}
        >
          <p className="mypage-my-wallet-summary">{account?.memberName} 지갑</p>
          <p className="mypage-my-wallet-balance">{account?.balance}원</p>
        </button> :
        <button
        className="mypage-my-wallet"
        onClick={() => navigate("/wallet")}
      >
        <p className="mypage-my-wallet-summary">계좌가 없으신데용 ㅋㅋ</p>
        <p className="mypage-my-wallet-balance">만드세요~</p>
      </button>
}
        <button
          className="mypage-my-profile-update"
          onClick={() => navigate("profile_update")}
        >
          <img
            src={profile}
            alt="내정보"
            className="mypage-my-profile-update-image"
          />
          <p>내 정보 수정</p>
        </button>
        <button
          className="mypage-my-profile-terms"
          onClick={() => navigate("terms")}
        >
          <img
            src={terms}
            alt="약관"
            className="mypage-my-profile-terms-image"
          />
          <p>약관 보기</p>
        </button>
        <div className="mypage-secession-container">
          <button className="mypage-secession" onClick={openSecessionModal}>
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
                onClick={closeSecessionModal}
                className="mypage-secession-modal-isSecession-button-cancel"
              >
                취소
              </button>
              <button className="mypage-secession-modal-isSecession-button-ok" 
              onClick={secessionMember}>
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
