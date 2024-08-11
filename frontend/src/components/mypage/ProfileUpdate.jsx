import CommonInput from "../common/CommonInput";
import { useEffect, useState } from "react";
import SubmitButton from "../user/SubmitButton";
import logo from "../../assets/icons/common/logo.png";
import "../user/User.css";
import BackButton from "../common/BackButton";
import { useDispatch, useSelector } from "react-redux";
import defaultImage from "../../assets/icons/common/defaultProfile.png";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 아이콘 추가
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/slices/userSlice";

function ProfileUpdate() {
  const API_LINK = import.meta.env.VITE_API_URL;
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [validPassword, setValidPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("미 입력시 기존 비밀번호가 유지 됩니다.");
  const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 가시성 상태
  const [nicknameMessage, setNicknameMessage] = useState(""); // 닉네임 메시지
  const member = useSelector((state) => state.user.member);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (member) {
      setNickname(member.nickname || "");
      setProfileImage(member.profileImg || defaultImage);
      setProfileImagePreview(member.profileImg || defaultImage); // 기존 프로필 이미지 미리보기
    }
  }, [member]);

  //제출 함수
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password !== "" && !validatePassword(password) || password !== validPassword) {
      setPasswordMessage("비밀번호를 확인해주세요.");
      return;
    }

    if (nicknameMessage === "사용할 수 없는 닉네임 입니다.") {
      setNicknameMessage("닉네임을 확인해주세요.");
      return;
    }

    const memData = {
      nickname: nickname,
    };

    //비밀번호가 비어있지 않다면.
    if(password !== "") {
      memData.password = password;
    }

    const formData = new FormData();
    const memJsonData = JSON.stringify(memData);
    const memBlob = new Blob([memJsonData], { type: "application/json" });
    console.log(memBlob);

    formData.append("member", memBlob);

    if (profileImage) {
      const fileBlob = new Blob([profileImage], { type: "image/png" });
      const fileData = new File([fileBlob], "image.png");
      formData.append("image", fileData);
    }

    try{
      const response = await axiosInstance.patch('/members/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        dispatch(setUser({ member: response.data.data }));
      }

      console.log("수정 됐다요요요요");
      navigate('/mypage');
    }
    catch(error){
      console.log("수정 에러", error);
    }
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLetter && hasNumber && hasSpecialChar;
  };

  // 닉네임 유효성 검사
  const validateNickname = (nickname) => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,15}$/;
    return nicknameRegex.test(nickname);
  };

  // 값 변경하는 메서드
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // focus 해제 됐을 때, 유효성 검사 실시
  const handlePasswordBlur = () => {
    if (password.length === 0) {
      setPasswordMessage("미 입력시 기존 비밀번호가 유지 됩니다.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordMessage(
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다."
      );
    } else if (password !== validPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMessage("비밀번호가 일치합니다.");
    }
  };

  // 닉네임 유효성 검사하기
  const handleNicknameBlur = async () => {
    if (nickname.length === 0) {
      setNicknameMessage("");
      return;
    }

    if (!validateNickname(nickname)) {
      setNicknameMessage(
        "닉네임은 2~15자의 영문 대/소문자, 한글(초성 제외), 숫자만 가능합니다."
      );
    } else if (nickname === member.nickname) {
      setNicknameMessage("");
    } else {
      const nicknameData = {
        nickname: nickname,
      };

      try {
        const response = await axios.post(
          `${API_LINK}/auth/nickname/duplicate-check`,
          nicknameData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.data) {
          setNicknameMessage("사용할 수 없는 닉네임 입니다.");
        } else {
          setNicknameMessage("사용 가능한 닉네임입니다.");
        }
      } catch (error) {
        console.log("에러 발생");
      }
    }
  };

  // 비밀번호 확인 입력할 때 ...
  const handleValidPasswordChange = (e) => {
    setValidPassword(e.target.value);
  };

  // 비밀번호 확인 focus 떼면 수행
  const handleValidPasswordBlur = () => {
    if (!validatePassword(validPassword)) {
      setPasswordMessage(
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다."
      );
    } else if (validPassword !== password) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMessage("비밀번호가 일치합니다.");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file); // 선택된 파일을 프로필 이미지로 설정
      setProfileImagePreview(URL.createObjectURL(file)); // 미리보기를 위해 파일 URL 생성
    }
  };

  return (
    <>
      <div className="signup-back-button">
        <BackButton />
      </div>
      <div className="signup-container">
        <div className="logo-container">
          <img src={logo} alt="로고" className="signup-logo" />
          <p>일정관리부터 정산까지</p>
        </div>
        <form>
          <div className="profile-image-upload">
            <label htmlFor="profileImageUpload" className="image-upload-label">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="placeholder-image">+</div>
              )}
            </label>
            <input
              type="file"
              id="profileImageUpload"
              className="image-upload-input"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="nickname-form">
            <CommonInput
              id="nickname"
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={handleNicknameBlur}
            />
          </div>
          {nicknameMessage && (
            <p
              className={
                nicknameMessage ===
                "닉네임은 2~15자의 영문 대/소문자, 한글(초성 제외), 숫자만 가능합니다."
                  ? "invalid-nickname"
                  : nicknameMessage === "사용 가능한 닉네임입니다."
                  ? "valid-nickname"
                  : "duplicated-nickname"
              }
            >
              {nicknameMessage}
            </p>
          )}
          <div className="password-container">
            <CommonInput
              id="password"
              type={passwordVisible ? "text" : "password"} // 비밀번호 가시성에 따라 타입 변경
              placeholder="새 비밀번호"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur} // 포커스가 해제될 때 유효성 검사
              className="password-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="password-container">
            <CommonInput
              id="validPassword"
              type="password" // 비밀번호 확인 가시성에 따라 타입 변경
              placeholder="새 비밀번호 확인"
              value={validPassword}
              onChange={handleValidPasswordChange}
              onBlur={handleValidPasswordBlur} // 포커스가 해제될 때 유효성 검사
            />
          </div>
          {passwordMessage && (
            <p
              className={
                passwordMessage === "비밀번호가 일치합니다."
                  ? "valid-password"
                  : "invalid-password"
              }
            >
              {passwordMessage}
            </p>
          )}
          <SubmitButton
            type="button"
            onClick={handleUpdate}
            className="submit-button"
          >
            수정 완료
          </SubmitButton>
        </form>
      </div>
    </>
  );
}

export default ProfileUpdate;
