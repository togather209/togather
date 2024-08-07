import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

// DatePicker를 감싸는 Styled Component
const CustomDatePickerWrapper = styled.div`
  .react-datepicker {
    border: 2px solid #ffffff;
    border-radius: 10px;
  }

  .react-datepicker__header {
    background-color: #ffffff;
    color: white;
    border-bottom: none;
  }

  .react-datepicker__current-month {
    color: #712fff;
    font-size: 1.2em;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #712fff !important;
    color: white !important;
  }

  .react-datepicker__day:hover {
    background-color: #d1c4e9;
  }

  .react-datepicker__navigation--previous,
  .react-datepicker__navigation--next {
    top: 0px; /* 네비게이션 버튼 위치 조정 */
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ffffff;
    &:hover {
      background-color: #ffffff;
    }
  }

  .react-datepicker__navigation-icon::before {
    border-color: #000000;
  }

  .react-datepicker__day-names {
    margin-top: 7px;
  }

  .react-datepicker__day--disabled {
    color: #d3d3d3;
  }
`;

// 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const CalendarComponent = ({ onChange, firstDate, lastDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    const formattedDate = formatDateToYYYYMMDD(date);

    // console.log(formattedDate)

    // 이미 선택된 날짜와 같으면 선택 해제, 다르면 선택
    if (selectedDate === formattedDate) {
      setSelectedDate(null);
      console.log(selectedDate)
      // onChange(null);
    } else {
      setSelectedDate(formattedDate);
      console.log(selectedDate)
      // onChange(date);
    }
  };

  return (
    <CustomDatePickerWrapper>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={firstDate}
        maxDate={lastDate}
        inline
      />
    </CustomDatePickerWrapper>
  );
};

export default CalendarComponent;
