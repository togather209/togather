import "./User.css";
import "../common/CommonInput.css";
import logo from "../../assets/icons/common/logo.png";

function SignUpForm() {
  return (
    <div className="signup-container">
      <div className="logo-container">
        <img src={logo} alt="로고" className="logo" />
        <p>일정관리부터 정산까지</p>
      </div>
    </div>
  );
}
