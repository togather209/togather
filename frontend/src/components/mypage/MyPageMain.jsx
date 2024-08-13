import "./MyPageMain.css";
import defaultImage from "../../assets/icons/common/defaultProfile.png";
import profile from "../../assets/mypage/profile.png";
import terms from "../../assets/mypage/terms.png";
import wallet from "../../assets/wallet/wallet.png";
import Edit from "../../assets/icons/common/edit.png";
import Background from "../../assets/user/background.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "../../redux/slices/userSlice";
import { clearToken } from "../../redux/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import { clearAccount, setAccount } from "../../redux/slices/accountSlice";
import { clearLinkedAccount } from "../../redux/slices/linkedAccount";
import { resetReceipt } from "../../redux/slices/receiptSlice";
import Modal from "../common/Modal";
import Loading from "../common/Loading";

function MyPageMain() {
  const [secessionModalOpen, setSecessionModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member = useSelector((state) => state.user.member);
  const account = useSelector((state) => state.account.account);
  const [isExistsAccount, setIsExistsAccount] = useState(false);
  const [goodbye, setGoodbye] = useState(false);
  const [logout, setLogout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadingMemberData = async () => {
    try {
      const response = await axiosInstance.get("/members/me");
      dispatch(setUser({ member: response.data.data }));
      console.log(member);
    } catch (error) {
      console.error("데이터 불러오기실패", error);
    }
  };

  const loadingAccountData = async () => {
    try {
      const response = await axiosInstance.get("/pay-accounts/members/me");
      if (response.data.data !== null) {
        dispatch(setAccount({ account: response.data.data }));
      }
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

  //로딩될 때 멤버들 데이터 불러와서 redux에 저장한다.
  useEffect(() => {
    const loadData = async () => {
      await loadingMemberData();
      await loadingAccountData();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const openSecessionModal = (e) => {
    e.preventDefault();
    setSecessionModalOpen(true);
  };

  const closeSecessionModal = (e) => {
    e.preventDefault();
    setSecessionModalOpen(false);
  };

  const logoutConfirm = async () => {
    await axiosInstance.post("/members/logout");
    dispatch(clearUser());
    dispatch(clearToken());
    dispatch(clearAccount());
    dispatch(clearLinkedAccount());
    dispatch(resetReceipt());
  };

  const handleLogout = () => {
    try {
      setLogout(true);
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그아웃 실패! 다시 해주세요.");
    }
  };

  const secessionMember = async () => {
    //계좌가 살아있고 잔액이 0원 이상이라면
    if (account?.balance > 0) {
      setIsExistsAccount(true);
      return;
    } else {
      //아니라면
      setGoodbye(true);
    }
  };

  const confirmSecession = async () => {
    //회원 탈퇴 진행
    try {
      const res = await axiosInstance.delete("/members/me");
      dispatch(clearUser());
      dispatch(clearToken());
      dispatch(clearAccount());
      dispatch(clearLinkedAccount());
      dispatch(resetReceipt());
    } catch (error) {
      console.log(error);
    }
  };

  const formatBalance = (balance) => {
    const numericBalance = parseFloat(balance);
    return numericBalance.toLocaleString("ko-KR"); // 'ko-KR' 로케일을 사용하여 한국어 형식으로 변환
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="mypage-container">
            <div className="mypage-profile">
              <div className="profile-image-container">
                <img
                  src={Edit}
                  alt=""
                  className="profile-edit-button"
                  onClick={() => navigate("profile_update")}
                />
                <img
                  src={member?.profileImg ? member.profileImg : defaultImage}
                  alt="기본"
                  className="mypage-profile-image"
                />
              </div>
              <p className="mypage-profile-name">{member?.nickname}</p>
              <p className="mypage-profile-email">{member?.email}</p>
              <button className="mypage-logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>
          <div className="mypage-content">
            {account ? (
              <button
                className="mypage-my-wallet"
                onClick={() => navigate("/wallet")}
              >
                <div>
                  <p className="mypage-my-wallet-summary">
                    {account?.memberName} 지갑
                  </p>
                  <p className="mypage-my-wallet-balance">
                    {formatBalance(account?.balance)}원
                  </p>
                </div>
                <img src={wallet} alt="" className="coin" />
              </button>
            ) : (
              <button
                className="mypage-my-wallet"
                onClick={() => navigate("/wallet")}
              >
                <p className="mypage-my-wallet-summary">
                  Pay 계좌가 존재 하지 않습니다.
                </p>
              </button>
            )}
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
                  <button
                    className="mypage-secession-modal-isSecession-button-ok"
                    onClick={secessionMember}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}

          {isExistsAccount && (
            <Modal
              mainMessage={"계좌가 아직 존재합니다!"}
              subMessage={"잔액을 비워주시고 다시 시도해주세요."}
              onClose={() => window.location.reload()}
            />
          )}

          {goodbye && (
            <Modal
              mainMessage={"서비스를 이용해주셔서 감사드립니다!"}
              subMessage={"회원탈퇴가 완료 되었습니다."}
              onClose={confirmSecession}
            />
          )}

          {logout && (
            <Modal
              mainMessage={"로그아웃 되었습니다."}
              onClose={logoutConfirm}
            />
          )}
        </>
      )}
    </>
  );
}

export default MyPageMain;
