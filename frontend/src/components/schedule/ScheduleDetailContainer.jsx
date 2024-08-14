import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
function ScheduleDetailContainer() {
  const token = useSelector((state) => state.auth.accessToken);
  const sub = getSubFromToken(token);
  const planId = localStorage.getItem("planId");
  const eventSourceRef = useRef(null);
  const [deletedBookmarkId, setDeletedBookmarkId] = useState(null);

  function getSubFromToken(token) {
    // JWT는 '.'으로 구분된 3개의 파트로 구성됨: header.payload.signature
    const base64Url = token.split(".")[1]; // 두 번째 부분이 페이로드임
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Base64URL을 Base64로 변환

    // Base64 디코딩 (브라우저 환경에서)
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    // JSON 파싱하여 sub 값 추출
    const payloadObject = JSON.parse(jsonPayload);
    return payloadObject.sub;
  }

  eventSourceRef.current = new EventSource(
    `http://localhost:8080/api/sse/subscribe/${planId}/${sub}`
  );
  eventSourceRef.current.addEventListener("bookmark-deleted", function (event) {
    const eventData = JSON.parse(event.data);
    handleBookmarkDeleted(eventData);
  });

  eventSourceRef.onerror = function (error) {
    console.error("SSE error:", error);
  };

  function handleBookmarkDeleted(eventData) {
    console.log(eventData + " 가 삭제됨");
    setDeletedBookmarkId(eventData);
  }
  return (
    <>
      <Outlet context={{ deletedBookmarkId }} />
    </>
  );
}
export default ScheduleDetailContainer;
