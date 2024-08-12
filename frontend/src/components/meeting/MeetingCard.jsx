import React, { useState } from "react";
import "./MeetingCard.css";
import { useNavigate, useParams } from "react-router-dom";
import Delete from "../../assets/meeting/delete.png";
import Change from "../../assets/meeting/change.png";
import Out from "../../assets/meeting/out.png";
import axiosInstance from "../../utils/axiosInstance";

// import ErrorModal from "./ErrorModal";
import CheckModal from "../common/CheckModal";
import ExitModal from "./ExitModal";

function MeetingCard({ id, image_url, name, desc, admin, setForR, forR }) {
  const navigation = useNavigate();

  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const handelCheckModalOpen = () => {
    setIsCheckModalOpen(true);
  };

  const handleExitModalOpen = () => {
    setIsExitModalOpen(true);
  };

  // const [errorMessage, setErrorMessage] = useState(null);
  console.log(id);
  // 모임장인지 아닌지 나타내는 상태 (임시)
  // const a = true

  // 모임 삭제 요청 axios
  // const deleteMeeting = async () => {
  //     try {
  //       const response = await axiosInstance.delete(`/teams/${id}`);
  //       // 리덕스 상태에 데이터 저장
  //     //   dispatch(setMeetings(response.data.data));
  //         console.log(response)
  //     } catch (error) {
  //       console.error('데이터 불러오기 실패', error);
  //       alert("모임에 일정이 남아있습니다.")
  //       console.log("모임에 일정이 남아있습니다.")
  //       setErrorMessage("일정이 남아있으면 모임을 삭제할 수 없습니다.");
  //     }
  //   };

  // 모임 삭제 요청 axios
  // const deleteMeeting = async (teamId) => {

  //     console.log(teamId)

  //     try {
  //         const response = await axiosInstance.delete(`/teams/${id}`);
  //         console.log(response);
  //         if (!response) {
  //             setErrorMessage("일정이 남아있어 모임을 삭제할 수 없습니다.");
  //         } else {
  //             // handelCheckModalOpen()
  //             // navigation("/home/meeting")
  //             setIsCheckModalOpen(false)
  //         }
  //     } catch (error) {
  //         console.error('데이터 불러오기 실패', error);
  //     }
  // };

  //   // 모임 나가기 요청
  //   const exitMeeting = async () => {
  //     try {
  //       const response = await axiosInstance.delete(`/teams/${id}/members/me`);
  //       // 리덕스 상태에 데이터 저장
  //       //   dispatch(setMeetings(response.data.data));
  //       console.log(response);
  //       setIsExitModalOpen(false);
  //     } catch (error) {
  //       console.error("데이터 불러오기 실패", error);
  //     }
  //   };

  //   삭제 불가 알림 모달
  //   const handleCloseModal = () => {
  //     setErrorMessage(null);
  //   };

  return (
    <div className="meeting-card">
      {/* {errorMessage && <ErrorModal message={errorMessage} onClose={handleCloseModal} />} */}

      <CheckModal
        isOpen={isCheckModalOpen}
        isClose={() => setIsCheckModalOpen(false)}
        // onConfirm={deleteMeeting}
        firstbutton={"취소"}
        secondbutton={"삭제"}
        teamId={id}
        setForR={setForR}
        forR={forR}
      />

      <ExitModal
        isOpen={isExitModalOpen}
        isClose={() => setIsExitModalOpen(false)}
        // onConfirm={exitMeeting}
        firstbutton={"취소"}
        secondbutton={"나가기"}
        teamId={id}
        setForR={setForR}
        forR={forR}
      />

      <div onClick={() => navigation(`${id}`)}>
        <img className="meeting-img" src={image_url} alt="" />
        <div className="text-section">
          <h3 className="title">{name}</h3>
          <p className="desc">{desc}</p>
        </div>
      </div>

      <div className="button-section">
        {admin ? (
          <div>
            <button
              onClick={() =>
                navigation(`/home/meeting/${id}/meeting-update`, {
                  state: { title: name, description: desc, id: id },
                })
              }
              className="meeting-card-button-form"
            >
              <img className="update-button" src={Change} alt="수정버튼" />
            </button>
            {/* 모임 삭제 버튼입니다. */}
            <button
              onClick={handelCheckModalOpen}
              className="meeting-card-button-form"
            >
              <img className="delete-button" src={Delete} alt="삭제버튼" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleExitModalOpen}
            className="meeting-card-button-form"
          >
            <img className="update-button" src={Out} alt="나가기버튼" />
          </button>
        )}
      </div>
    </div>
  );
}

export default MeetingCard;
