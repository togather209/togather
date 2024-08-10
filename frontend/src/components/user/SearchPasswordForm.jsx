import BackButton from "../common/BackButton";
import "./SearchPasswordForm.css";

function SearchPasswordForm() {
  return (
    <>
      <div className="search-password-form-top">
        <BackButton />
        <div className="search-password-form-header">
          <p>비밀번호 찾기</p>
        </div>
      </div>
      <div className="search-password-form-container"></div>
    </>
  );
}

export default SearchPasswordForm;
