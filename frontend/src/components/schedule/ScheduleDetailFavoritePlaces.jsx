import React, {useState} from "react";

import "./ScheduleDetailFavoritePlaces.css"
import heart from "../../assets/schedule/scheduleheartimg.png";
import heartpurple from "../../assets/schedule/scheduleheartpurple.png"

import matjip from "../../assets/schedule/mayjip.jpg"

function ScheduleDetailFavoritePlaces ({ name, img_url, address }) {

    const [isHeartPurple, setIsHeartPurple] = useState(false)

    const handleHeartPurple = () => {
        setIsHeartPurple(!isHeartPurple)
    }

    return (
        <div className="schedule-detail-list-box">
            <div className="schedule-detail-section1">
                <div>
                    <img className="schedule-detail-place-img" src={matjip} alt="임시" />
                </div>
                <div>
                    <p className="schedule-detail-place-name">{ name }</p>
                    <p className="schedule-detail-place-address">{ address }</p>
                </div>
            </div>
            <div className="receipt-box-div">
                {isHeartPurple ? (
                    <img className="heart-size" onClick={handleHeartPurple} src={heartpurple} alt="full-heart" />
                ) : (
                    <img className="heart-size" onClick={handleHeartPurple} src={heart} alt="empty-heart" />
                )}
            </div>
        </div>
    )
}

export default ScheduleDetailFavoritePlaces