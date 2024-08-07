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


const CalendarComponent = ({ onChange, firstDate, lastDate, datedate, handleDateChange, selectedDate }) => {


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
