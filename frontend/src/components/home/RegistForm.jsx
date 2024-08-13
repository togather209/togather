import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistForm.css";
import Button from "../common/Button";
import BackButton from "../common/BackButton";
import axiosInstance from "../../utils/axiosInstance";

// 모임 생성 폼
function RegistForm() {
  const navigation = useNavigate();

  // 제목, 이미지주소, 설명
  const [title, setTitle] = useState("");
  const [teamImg, setTeamImg] = useState(null); // 이미지 파일 상태
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태

  // 제목 값 갱신
  const handleMeetingTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // 설명 값 갱신
  const handleMeetingDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // 이미지 값 갱신 및 미리보기 설정
  const handleMeetingImageChange = (e) => {
    const file = e.target.files[0]; // 선택된 파일
    if (file) {
      setTeamImg(file); // 파일 객체를 상태에 저장

      // 미리보기 URL 생성 및 상태에 저장
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // 이미지 파일 입력 필드를 클릭할 수 있도록 설정
  const handleImageContainerClick = () => {
    document.getElementById("image-input").click();
  };

  // axios 요청 함수
  const addMeeting = async (e) => {
    e.preventDefault();

    // FormData 객체 생성
    const formData = new FormData();

    // JSON 형태로 데이터를 추가
    const memberData = JSON.stringify({
      title: title,
      description: description,
    });

    // 요청 파라미터 값 생성
    formData.append(
      "member",
      new Blob([memberData], { type: "application/json" })
    ); // JSON 데이터 추가
    if (teamImg) {
      const fileBlob = new Blob([teamImg], { type: "image/png" });
      const fileData = new File([fileBlob], "image.png");
      formData.append("image", fileData); // 파일 객체를 추가
    }

    // axios요청
    try {
      const response = await axiosInstance.post("/teams", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // 파일 업로드 시 필요한 헤더
        },
      });
      console.log(response);
      navigation("/");
    } catch (error) {
      console.error("데이터 불러오기 실패", error);
    }
  };

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

          <form onSubmit={addMeeting} className="regist-input">
            <div className="img-container">
              <div className="content-container">
                <div>
                  <p className="img-input-desc">모임 대표 사진</p>
                </div>
                <div
                  className="meeting-regist-input-image-container"
                  onClick={handleImageContainerClick}
                >
                  {/* 이미지 미리보기를 표시할 부분 */}
                  {imagePreview && (
                    <div className="image-preview">
                      <img
                        src={imagePreview}
                        alt="미리보기"
                        className="preview-img"
                      />
                    </div>
                  )}
                  {/* 실제 파일 입력 필드는 숨김 */}
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleMeetingImageChange}
                    style={{ display: "none" }} // input 태그를 숨김
                  />
                </div>
              </div>
            </div>
            <div className="meeting-name">
              <input
                className="name-input"
                type="text"
                placeholder="모임명"
                value={title}
                onChange={handleMeetingTitleChange}
              />
            </div>
            <div className="meeting-desc">
              <input
                className="desc-input"
                type="text"
                placeholder="설명"
                value={description}
                onChange={handleMeetingDescriptionChange}
              />
            </div>
            <Button type={"purple"}>생성</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistForm;
