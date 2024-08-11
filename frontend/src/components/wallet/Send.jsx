import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BackButton from "../common/BackButton";
import CommonInput from "../common/CommonInput";
import "./Send.css";
import Search from "../../assets/icons/common/search.png";

import DefaultProfileImage from "../../assets/icons/common/defaultProfile.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Loading from "../common/Loading";

function Send() {
  const [content, setContent] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [memberList, setMemberList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.member);

  useEffect(() => {
    fetchTeamsAndMembers();
  }, []);

  const fetchTeamsAndMembers = async () => {
    try {
      const response = await axiosInstance.get("/teams/members/me");
      const teams = response.data.data;

      const teamMemberPromises = teams.map(async (team) => {
        const teamMembersResponse = await axiosInstance.get(
          `/teams/${team.teamId}/members`
        );
        const teamMembers = teamMembersResponse.data.data;

        const formattedMembers = teamMembers
          .filter((member) => member.nickname !== user.nickname)
          .map((member) => ({
            group: team.title,
            img: member.profileImg || DefaultProfileImage,
            name: member.nickname,
            memberId: member.memberId,
          }));

        return formattedMembers;
      });

      const allFormattedMembersArrays = await Promise.all(teamMemberPromises);
      const allMembers = allFormattedMembersArrays.flat();

      setMemberList(allMembers);
      setIsLoading(false);
    } catch (error) {
      console.error("팀과 멤버를 가져오는 중 오류 발생:", error);
      setIsLoading(false);
    }
  };

  const searchContent = (e) => {
    e.preventDefault();
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };
  const filteredMemberList = memberList.filter(
    (member) => member.name.includes(content) || member.group.includes(content)
  );

  const groupedMembers = filteredMemberList.reduce((acc, member) => {
    if (!acc[member.group]) {
      acc[member.group] = [];
    }
    acc[member.group].push(member);
    return acc;
  }, {});
  const goToSendForm = (name, memberId) => {
    navigate("/wallet/sendform", { state: { name, memberId } });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="send-container">
      <div className="send-header">
        <BackButton />
        <p>송금하기</p>
      </div>
      <form className="searchbar" onSubmit={searchContent}>
        <CommonInput
          id="content"
          type="text"
          placeholder="멤버를 검색 해보세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={20}
        />
      </form>{" "}
      <button
        className="my-account-withdraw"
        onClick={() => goToSendForm(user.nickname, user.memberId)}
      >
        내 연동 계좌로 출금
      </button>
      <p className="meeting-list-title">모임원 목록</p>
      <div className="meeting-list">
        
        {Object.keys(groupedMembers).length === 0 ? (
          <p className="meeting-list-not-exist">모임이 존재하지 않습니다.</p>
        ) : (
          Object.keys(groupedMembers).map((group) => (
            <div key={group} className="grout-list">
              <div className="group-title" onClick={() => toggleGroup(group)}>
                <p>{group}</p>
                <span>{expandedGroups[group] ? "▲" : "▼"}</span>
              </div>
              {expandedGroups[group] && (
                <div className="member-list">
                  {groupedMembers[group].map((member) => (
                    <button
                      className="member-item"
                      key={member.memberId}
                      onClick={() => goToSendForm(member.name, member.memberId)}
                    >
                      <img src={member.img} alt={member.name} />
                      <p className="member-name">{member.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Send;
