import React, { useEffect, useState } from "react";
import "./ConnectReceiptScheduleModal.css";
import Close from "../../../assets/icons/common/close.png";
import { useSelector } from "react-redux";
import axiosInstance from "../../../utils/axiosInstance";

function ConnectReceiptScheduleModal({ onClose, onConfirm }) {
  const [expandedDays, setExpandedDays] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState({ id: null, name: "" });
  const [bookmarks, setBookmarks] = useState([]);

  // planId 가져오기
  const { teamId, planId } = useSelector((state) => state.receipt);

  useEffect(() => {
    if (!teamId || !planId) {
      console.error("teamId 또는 planId가 전달되지 않았습니다.");
      return;
    }

    // 북마크 조회
    const fetchBookmark = async () => {
      try {
        const response = await axiosInstance.get(
          `teams/${teamId}/plans/${planId}/bookmarks`
        );

        const sortedBookmarks = response.data.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        setBookmarks(sortedBookmarks);
        console.log(sortedBookmarks);
      } catch (error) {
        console.error("북마크를 가져오는 중 문제가 발생했습니다", error);
      }
    };

    fetchBookmark();
  }, [teamId, planId]);

  const toggleDaySection = (index) => {
    setExpandedDays((prev) =>
      prev.includes(index)
        ? prev.filter((day) => day !== index)
        : [...prev, index]
    );
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  const handleConfirm = () => {
    onConfirm(selectedPlace);
    onClose();
  };

  return (
    <div className="connect-schedule-modal-overlay">
      <div className="connect-schedule-modal-content">
        <img
          src={Close}
          className="connect-schedule-modal-close"
          onClick={onClose}
          alt="Close"
        />
        <div className="connect-schedule-modal-detail">
          <div className="connect-schedule-select">
            연결할 장소를 선택해주세요
          </div>
          {bookmarks.map((dayData, index) => (
            <div className="day-section" key={index}>
              <h3 onClick={() => toggleDaySection(index)}>
                {index + 1}일차 ({dayData.date.substr(5)})
              </h3>
              {expandedDays.includes(index) && (
                <div>
                  {dayData.places.map((place) => (
                    <div key={place.id} className="place-item">
                      <input
                        type="radio"
                        id={`place${place.id}`}
                        name="place"
                        value={place.id}
                        onChange={() => {
                          handlePlaceSelect(place);
                        }}
                      />
                      <label htmlFor={`place${place.id}`}>{place.name}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className={`connect-confirm-button ${
            selectedPlace.id ? "active" : "inactive"
          }`}
          onClick={handleConfirm}
        >
          선택완료
        </button>
      </div>
    </div>
  );
}

export default ConnectReceiptScheduleModal;
