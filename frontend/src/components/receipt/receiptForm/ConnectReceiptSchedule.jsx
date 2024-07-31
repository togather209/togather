import React from "react";
import './ConnectReceiptSchedule.css';

function ConnectReceiptSchedule({ onClose }) {
    // 임시 데이터
    const tempData = [
        {
            day: "1일차",
            date: "2023년 7월 30일",
            places: [
                { id: 1, name: "일미 닭갈비" },
                { id: 2, name: "네네 치킨 유성점" },
            ]
        },
        {
            day: "2일차",
            date: "2023년 7월 31일",
            places: [
                { id: 3, name: "시림 미술관" },
                { id: 4, name: "How Cafe" },
                { id: 5, name: "한화 이글스 파크" },
            ]
        }
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>연결할 장소를 선택해주세요</h2>
                {tempData.map((dayData, index) => (
                    <div className="day-section" key={index}>
                        <h3>{dayData.day} - {dayData.date}</h3>
                        {dayData.places.map(place => (
                            <div key={place.id}>
                                <input type="radio" id={`place${place.id}`} name="place" value={place.name} />
                                <label htmlFor={`place${place.id}`}>{place.name}</label>
                            </div>
                        ))}
                    </div>
                ))}
                <button className="confirm-button" onClick={onClose}>선택완료</button>
            </div>
        </div>
    );
}

export default ConnectReceiptSchedule;
