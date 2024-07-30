import React from "react";
import "./MeetingCard.css"

import { useNavigate } from "react-router-dom";

function MeetingCard({id, image_url, name, desc}) {
    const navigation = useNavigate()
    return (

        <div className="meeting-card">
            <div onClick={() => navigation(`${id}`)}>
                <img className="meeting-img" src={image_url} alt="" />
                <div className="text-section">
                    <h3 className="title">{name}</h3>
                    <p className="desc">{desc}</p>
                </div>
            </div>
            
            <div className="button-section">
                <button>수정</button>
                <button>삭제</button>
            </div>
        </div>

    )
    
}

export default MeetingCard