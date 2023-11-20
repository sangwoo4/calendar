import React, { useState, useEffect } from 'react';

const WorkModal = ({ isOpen, closeModal, selectedDate }) => {
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  const getWorkDateKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `work ${year}-${month}-${day}`;
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

  const handleSave = () => {
    const workDateKey = getWorkDateKey(selectedDate);
    const WorkDataKey = getDateKey(selectedDate);
    const savedValues = JSON.parse(localStorage.getItem(WorkDataKey)) || [];
  
    const newWorkEntry = {
      workSource: workSource,
      inputAsset: inputAsset,
      workStartTime: workStartTime,
      workEndTime: workEndTime,
    };
  
    const updatedValues = [...savedValues, newWorkEntry];
    localStorage.setItem(WorkDataKey, JSON.stringify(updatedValues));
  
    // Calculate totalWage for the selected date
    // Calculate totalWage for the whole month and store it in 'year-month' key
    const startOfMonthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  
    let totalWageMonth = 0;
    updatedValues.forEach((entry) => {
      const entryDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), parseInt(entry.workStartTime.split(":")[0]) + 1);
      if (entryDate >= startOfMonthDate && entryDate <= endOfMonthDate) {
        const startTime = new Date(`2000-01-01T${entry.workStartTime}`);
        const endTime = new Date(`2000-01-01T${entry.workEndTime}`);
        const timeDifference = endTime - startTime;
        const wage = (timeDifference / 3600000) * entry.inputAsset;
        totalWageMonth += parseFloat(wage.toFixed(2));
      }
    });
  
    const yearMonthKey = `work ${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}`;
    localStorage.setItem(yearMonthKey, totalWageMonth.toString());
  
    closeModal();
  };
  
  
  useEffect(() => {
    const WorkDataKey = getDateKey(selectedDate);
    const savedValues = JSON.parse(localStorage.getItem(WorkDataKey)) || [];

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
