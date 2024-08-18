import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
function ScheduleDetailContainer() {
  const token = useSelector((state) => state.auth.accessToken);
  const sub = getSubFromToken(token);
  const params = useParams();

  const planId = params.schedule_id;
  const eventSourceRef = useRef(null);
  const [deletedBookmarkId, setDeletedBookmarkId] = useState(null);
  const [newBookmark, setNewBookmark] = useState(null);
  const [newDay, setNewDay] = useState(null);
  const [newOrder, setNewOrder] = useState(null);

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

  useEffect(() => {
    eventSourceRef.current = new EventSource(
      `https://i11b209.p.ssafy.io/api/sse/subscribe/${planId}/${sub}`,
      { withCredentials: true }
    );

    eventSourceRef.current.addEventListener("bookmark-deleted", (event) => {
      console.log("삭제 요청 받음");
      const eventData = JSON.parse(event.data);
      handleBookmarkDeleted(eventData);
    });

    eventSourceRef.current.addEventListener("bookmark-added", (event) => {
      const eventData = JSON.parse(event.data);
      console.log("추가 요청 받음");
      setNewBookmark(eventData);
    });

    eventSourceRef.current.addEventListener(
      "bookmark-date-updated",
      (event) => {
        const eventData = JSON.parse(event.data);
        console.log("날짜 변경 요청 받음");
        setNewDay(eventData);
      }
    );

    eventSourceRef.current.addEventListener(
      "bookmark-index-updated",
      (event) => {
        const eventData = JSON.parse(event.data);
        console.log("인덱스 변경 요청 받음");
        setNewOrder(eventData);
      }
    );

    eventSourceRef.current.addEventListener("error", (error) => {
      console.error("SSE error:", error);
    });

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  function handleBookmarkDeleted(eventData) {
    setDeletedBookmarkId(eventData);
  }
  return (
    <>
      <Outlet context={{ deletedBookmarkId, newBookmark, newDay, newOrder }} />
    </>
  );
}
export default ScheduleDetailContainer;
