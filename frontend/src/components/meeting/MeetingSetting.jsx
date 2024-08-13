import React, {useState, useEffect} from "react";
import { useParams, useLocation, UNSAFE_DataRouterStateContext } from "react-router-dom";
import "./MeetingSetting.css"
import MeetingParticipants from "./MeetingParticipants";
import MeetingParticipantManage from "./MeetingParticipantManage";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "../common/Modal";

function MeetingSetting () {
    const {id} = useParams()
    const {state} = useLocation()
    const [joinMembersRequest, setJoinMembersRequest] = useState([])
    const [joinMember, setJoinMember] = useState([]);
    const [copySuccess, setCopySuccess] = useState(false);

    const [forR, setForR] = useState(true)

    useEffect(() => {
        wantJoinMembers()
        joinMembers()
      }, [forR])

      // 참여 요청 인원 조회
  const wantJoinMembers = async () => {
    try {
        const response = await axiosInstance.get(`/teams/${id}/join-requests`);
        setJoinMembersRequest(response.data.data)
        console.log(response.data.data)
        // setForR(!forR)
    } catch (error) {
      console.error("데이터 불러오기 실패", error)
    }
  }

    // 참여 인원 조회
  const joinMembers = async () => {
    try {
        const response = await axiosInstance.get(`/teams/${id}/members`);
        setJoinMember(response.data.data)
        // console.log(joinMember)
        // setForR(!forR)
    } catch (error) {
      console.error("데이터 불러오기 실패", error)
    }
  }

  // 코드 복사 함수
  const copyToClipboard = () => {
    if (state && state.code) {
        navigator.clipboard.writeText(state.code)
            .then(() => {
                setCopySuccess(true);
            })
            .catch((err) => {
                setCopySuccess(false);
            });
    }
};


    return (
        <div>
            <div className="meeting-setting-member-manage-box">
                <div className="setting-member-manage">멤버 관리</div>
                <div className="part-code" onClick={copyToClipboard} style={{ cursor: 'pointer' }}>{state?.code}</div>
                {copySuccess && (
                    <Modal mainMessage={"초대코드가 복사됐어요!"} onClose={() => setCopySuccess(false)}/>
                )}
            </div>
            <div className="hr"></div>
            <div>
                {/* 반복문 들어가야 한다. */}
                {joinMember.map((item, index) => 
                    <MeetingParticipants 
                        key={index}
                        name={item.nickname}
                        guestId={item.memberId}
                        forR={forR}
                        setForR={setForR}
                        // meetingDetail={meetingDetail}
                    />
                )}
            </div>

            <div className="meeting-setting-request-manage-box">참여요청 관리</div>

            <div className="hr"></div>

            <div>
                {joinMembersRequest.map((item, index) => 
                    <MeetingParticipantManage 
                        key={index}
                        name={item.nickname}
                        guestId={item.memberId}
                        forR={forR}
                        setForR={setForR}
                        joinrequeststatus={item.status}
                        // meetingDetail={meetingDetail}
                    />
                )}
            </div>

        </div>
    )
}

export default MeetingSetting