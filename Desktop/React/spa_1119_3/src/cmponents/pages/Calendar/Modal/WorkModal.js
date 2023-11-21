import React, { useState, useEffect } from 'react';

const WorkModal = ({ isOpen, closeModal, selectedDate }) => {
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  const getMonthKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month}`;
  };

  const getYearMonthKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `work ${year}-${month}`;
  };

  const getWeekStartDate = (date) => {
    const day = date.getDay(); // 0은 일요일, 1은 월요일, ..., 6은 토요일
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 일요일일 경우 일주일 전으로 이동
    return new Date(date.setDate(diff));
  };

  const getWeekEndDate = (date) => {
    const startOfWeek = getWeekStartDate(date);
    return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
  };

  const [workSource, setWorkSource] = useState('');
  const [inputAsset, setInputAsset] = useState('');
  const [workStartTime, setWorkStartTime] = useState('');
  const [workEndTime, setWorkEndTime] = useState('');

  const handleWorkSourceChange = (e) => {
    setWorkSource(e.target.value);
  };

  const handleDateChange = (newWorkValue) => {
    setInputAsset(newWorkValue);
  };

  const handleWorkStartTimeChange = (e) => {
    setWorkStartTime(e.target.value);
  };

  const handleWorkEndTimeChange = (e) => {
    setWorkEndTime(e.target.value);
  };
  

  const calculateTotalWageMonth = (values, startDate, endDate) => { //월 합산
    let totalWageMonth = 0;

    values.forEach((entry) => {
      const entryDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        parseInt(entry.workStartTime.split(':')[0]) + 1
      );

      if (entryDate >= startDate && entryDate <= endDate) {
        const startTime = new Date(`2000-01-01T${entry.workStartTime}`);
        const endTime = new Date(`2000-01-01T${entry.workEndTime}`);
        const timeDifference = endTime - startTime;
        const wage = (timeDifference / 3600000) * entry.inputAsset;
        totalWageMonth += parseFloat(wage.toFixed(2));
      }
    });

    return totalWageMonth;
  };

  const calculateWeeklyLeaveAllowance = (values, selectedDate) => {
    let totalLeaveAllowance = 0;
    let totalWorkHours = 0;
  
    // 주의 시작일과 끝일 계산
    const startOfWeek = getWeekStartDate(selectedDate);
    const endOfWeek = getWeekEndDate(selectedDate);
  
    console.log("Selected Week Start Date: ", startOfWeek);
    console.log("Selected Week End Date: ", endOfWeek);
  
    values.forEach((entry) => {
      const entryDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        parseInt(entry.workStartTime.split(':')[0])
      );
  
      if (entryDate >= startOfWeek && entryDate <= endOfWeek) {
        const startTime = new Date(`2000-01-01T${entry.workStartTime}`).getTime();
        const endTime = new Date(`2000-01-01T${entry.workEndTime}`).getTime();
  
        // Ensure endTime is greater than startTime
        if (endTime > startTime) {
          const timeDifference = endTime - startTime;
  
          // Calculate leave allowance based on time difference
          const leaveAllowance = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          totalLeaveAllowance += parseFloat((leaveAllowance * entry.inputAsset).toFixed(2));
  
          // Accumulate total work hours in the week
          totalWorkHours += timeDifference / (1000 * 60 * 60);
        }
      }
    });
  
    // Check if the total work hours in the week exceed 15 hours
    if (totalWorkHours >= 15) {
      // Calculate and add weekly leave allowance
      const numberOfWorkingDays = 5; // 근무일 수가 다양한 경우 이 값을 업데이트하세요
      const excessWorkHours = totalWorkHours - 15;
      const excessLeaveAllowance = excessWorkHours * values[0].inputAsset; // inputAsset이 모든 항목에서 동일하다고 가정
      totalLeaveAllowance += parseFloat(excessLeaveAllowance.toFixed(2));
    }
  
    console.log(`totalLeaveAllowance ${totalLeaveAllowance}`);
    console.log(`totalWorkHours ${totalWorkHours}`);
  
    return totalLeaveAllowance;
  };
  
  
  
  
  

  const handleSave = () => {
    const workDataKey = getDateKey(selectedDate);
    const workMonthKey = getMonthKey(selectedDate);
    const workYearMonthKey = getYearMonthKey(selectedDate);
    const savedValues = JSON.parse(localStorage.getItem(workDataKey)) || [];

    const newWorkEntry = {
      workSource: workSource,
      inputAsset: parseFloat(inputAsset),
      workStartTime: workStartTime,
      workEndTime: workEndTime,
    };

    const updatedValues = [...savedValues, newWorkEntry];
    localStorage.setItem(workDataKey, JSON.stringify(updatedValues));

    const startOfMonthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

    const totalWageMonth = calculateTotalWageMonth(updatedValues, startOfMonthDate, endOfMonthDate);

    // const existingMonthData = parseFloat(localStorage.getItem(workMonthKey)) || 0;
    // const updatedMonthData = existingMonthData + totalWageMonth;
    // localStorage.setItem(workMonthKey, updatedMonthData.toString());

    const existingYearMonthData = parseFloat(localStorage.getItem(workYearMonthKey)) || 0;
    const updatedYearMonthData = existingYearMonthData + totalWageMonth;
    localStorage.setItem(workYearMonthKey, updatedYearMonthData.toString());

    const totalLeaveAllowance = calculateWeeklyLeaveAllowance(updatedValues, selectedDate);
    console.log('Allownce:' + totalLeaveAllowance);
  
    closeModal();
  };
  useEffect(() => {
    const workDataKey = getDateKey(selectedDate);
    const savedValues = JSON.parse(localStorage.getItem(workDataKey)) || [];

    // Other initialization logic...
  }, [selectedDate, isOpen]);

  return (
    <div className={`work-modal ${isOpen ? 'open' : ''}`}>
      <div className="date">{selectedDate.toLocaleDateString()}</div>
      <p> [근무]</p>
      <div className="Work-content">
        <p> 근무지 : </p>
        <input
          className="text"
          type="text"
          placeholder="근무지를 입력해주세요"
          value={workSource}
          onChange={handleWorkSourceChange}
        />
        <p> 시급 : </p>
        <input
          className="num"
          type="number"
          placeholder="시급을 입력해주세요"
          value={inputAsset}
          onChange={(e) => handleDateChange(e.target.value)}
          required
        />
        <p> 근무 시간 : </p>
        <input className="time" type="time" value={workStartTime} onChange={handleWorkStartTimeChange} /> ~
        <input className="time" type="time" value={workEndTime} onChange={handleWorkEndTimeChange} />
      </div>

      <p>
        <button className="btnOk" onClick={handleSave}>
          등록
        </button>
        <button className="btnCancel2" onClick={closeModal}>
          취소
        </button>
      </p>
    </div>
  );
};

export default WorkModal;
