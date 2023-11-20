import React, { useState, useEffect } from 'react';

const WorkModal = ({ isOpen, closeModal, initialDate, selectedDate }) => {
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
    const currentDateKey = getDateKey(selectedDate);
    const savedValues = JSON.parse(localStorage.getItem(currentDateKey)) || [];

    const newWorkEntry = {
      workSource: workSource,
      inputAsset: inputAsset,
      workStartTime: workStartTime,
      workEndTime: workEndTime
    };

    const updatedValues = [...savedValues, newWorkEntry];

    localStorage.setItem(currentDateKey, JSON.stringify(updatedValues));

    // Other save logic...

    closeModal();
  };

  useEffect(() => {
    const currentDateKey = getDateKey(selectedDate);
    const savedValues = JSON.parse(localStorage.getItem(currentDateKey)) || [];

    // Other initialization logic...
  }, [selectedDate, isOpen]);
  
  return (
    <div className={`work-modal ${isOpen ? 'open' : ''}`}>
      <div className="date">
        {selectedDate.toLocaleDateString()}
      </div>
      <p> [근무]</p>
      <div className="Work-content">
        <p> 근무지 : </p>
        <input
          className='text'
          type='text'
          placeholder="근무지를 입력해주세요"
          value={workSource}
          onChange={handleWorkSourceChange}
        />
        <p> 시급 :  </p>
        <input
          className="num"
          type="number"
          placeholder="시급을 입력해주세요"
          value={inputAsset}
          onChange={(e) => handleDateChange(e.target.value)}
          required
        />
        <p> 근무 시간 : </p>
        <input
          className="time"
          type="time"
          value={workStartTime}
          onChange={handleWorkStartTimeChange}
        /> ~
        <input
          className="time"
          type="time"
          value={workEndTime}
          onChange={handleWorkEndTimeChange}
        />
      </div>

      <p>
        <button className="btnOk" onClick={handleSave}>등록</button>
        <button className="btnCancel2" onClick={closeModal}>
          취소
        </button>
      </p>
    </div>
  );
};

export default WorkModal;
