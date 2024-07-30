import React from "react";
import { useParams } from "react-router-dom";

function MeetingDetail() {
  const params = useParams();
  return <div>미팅 상세{params.id}</div>;
}

export default MeetingDetail;
