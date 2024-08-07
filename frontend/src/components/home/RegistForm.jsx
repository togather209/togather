import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistForm.css";
import Button from "../common/Button";
import BackButton from "../common/BackButton";
import axiosInstance from "../../utils/axiosInstance";

// 모임 생성 폼
function RegistForm() {
  const navigation = useNavigate()

  // 제목, 이미지주소, 설명
  const [title, setTitle] = useState("")
  const [teamimg, setTeamImg] = useState(null)
  const [description, setDescription] = useState("")

  // 제목 값 갱신
  const handleMeetingTitleChange = (e) => {
    setTitle(e.target.value)
  }

  // 설명 값 갱신
  const handleMeetingDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  // 이미지 값 갱신
  const handleMeetingImageChange = (e) => {
    setTeamImg(e.target.files[0])
  }

  // axios 요청 함수
  const addMeeting = async (e) => {

    e.preventDefault()

    // 요청 파라미터 값 생성
    const formData = {}

    // 제목값 갱신
    formData["title"] = title
    // 설명값 갱신
    formData["description"] = description
    // 이미지값 갱신
    if (teamimg) {
      formData["teamImg"] = teamimg.name
    } else {
      formData["teamImg"] = "아니 없어요"
    }

    // axios요청
    try {
      const response = await axiosInstance.post("/teams", formData);
      console.log(response)
      navigation("/")
    } catch (error) {
      console.error("데이터 불러오기실패", error);
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

          <form action="" className="regist-input">
            <div className="img-container">
              <div className="content-container">
                <p className="img-input-desc">모임 대표 사진</p>
                <input className="" type="file" onChange={handleMeetingImageChange}/>
              </div>
            </div>
            <div className="meeting-name">
              <input className="name-input" type="text" placeholder="모임명" value={title} onChange={handleMeetingTitleChange}/>
            </div>
            <div className="meeting-desc">
              <input className="desc-input" type="text" placeholder="설명" value={description} onChange={handleMeetingDescriptionChange}/>
            </div>
            <Button type={"purple"} onClick={addMeeting}>생성</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistForm;
