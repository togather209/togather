import { useState } from "react";
import BackButton from "../common/BackButton";
import CommonInput from "../common/CommonInput";
import "./Send.css";
import Search from "../../assets/icons/common/search.png";
import chunsik from "../../assets/icons/common/chunsik.png";
import { useNavigate } from "react-router-dom";

function Send() {
  const [content, setContent] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const navigate = useNavigate();

  const memberList = [
    { group: "비모", img: chunsik, name: "이지혜" },
    { group: "비모", img: chunsik, name: "장정현" },
    { group: "비모", img: chunsik, name: "서두나" },
    { group: "야구보러 만나는 모임", img: chunsik, name: "김범규" },
    { group: "야구보러 만나는 모임", img: chunsik, name: "김선하" },
    { group: "야구보러 만나는 모임", img: chunsik, name: "하정수" },
  ];

  const searchContent = (e) => {
    e.preventDefault();
    console.log(content + "를 검색하셨네요!");
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const groupedMembers = memberList.reduce((acc, member) => {
    if (!acc[member.group]) {
      acc[member.group] = [];
    }
    acc[member.group].push(member);
    return acc;
  }, {});

  const goToSendForm = () => {
    navigate('/wallet/sendform');
  }

  return (
    <div className="send-container">
      <div className="send-header">
        <BackButton />
        <p>송금하기</p>
      </div>
      <form className="searchbar">
        <CommonInput
          id="content"
          type="text"
          placeholder="검색어를 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={20}
        />
        <button className="search-image" onClick={searchContent}>
          <img src={Search} alt="돋보기" />
        </button>
      </form>
      <button className="my-account-withdraw" onClick={goToSendForm}>내 연동 계좌로 출금</button>

      <div className="meeting-list">
        <p className="meeting-list-title">모임원 목록</p>
        {Object.keys(groupedMembers).map((group) => (
          <div key={group}>
            <div className="group-title" onClick={() => toggleGroup(group)}>
              <p>{group}</p>
              <span>{expandedGroups[group] ? "▲" : "▼"}</span>
            </div>
            {expandedGroups[group] && (
              <div className="member-list">
                {groupedMembers[group].map((member) => (
                  <div className="member-item" key={member.name}>
                    <img src={member.img} alt={member.name} />
                    <p>{member.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Send;
