import CommonInput from "../common/CommonInput";
import { useEffect, useState } from "react";
import SubmitButton from "../user/SubmitButton";
import logo from "../../assets/icons/common/logo.png";
import "../user/User.css";
import BackButton from "../common/BackButton";
import { useSelector } from "react-redux";

function ProfileUpdate() {
  const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setnickName] = useState("");
  const [validPassword, setValidPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const member = useSelector((state) => state.user.member);

  console.log(member);

  const handleUpdate = () => {
    console.log("회원수정 받아조!!!!!!!!");
  };

  const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLetter && hasNumber && hasSpecialChar;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (!newPassword) {
      setPasswordMessage("");
    } else if (!validatePassword(newPassword)) {
      setPasswordMessage("비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.");
    } else if (newPassword !== validPassword) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMessage("비밀번호가 일치합니다.");
    }
  };

  const handleValidPasswordChange = (e) => {
    const newValidPassword = e.target.value;
    setValidPassword(newValidPassword);

    if (!newValidPassword) {
      setPasswordMessage("");
    } else if (!validatePassword(newValidPassword)) {
      setPasswordMessage("비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.");
    } else if (newValidPassword !== password) {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMessage("비밀번호가 일치합니다.");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
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
              {profileImage ? (
                <img
                  src={profileImage}
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
          <CommonInput
            id="password"
            type="password"
            placeholde="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
          <CommonInput
            id="validPassword"
            type="password"
            placeholder="비밀번호확인"
            value={validPassword}
            onChange={handleValidPasswordChange}
          />
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
          <CommonInput
            id="nickName"
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setnickName(e.target.value)}
          />

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
