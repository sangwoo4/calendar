import React, { useState, useEffect } from "react";
import './mypage.css';

export const MypageWork = () => {
  const [location, setLocation] = useState("");
  const [hourlyWage, setHourlyWage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tax, setTax] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("entries"));

    if (savedEntries) {
      setEntries(savedEntries);
    }
  }, []);

  const handleConfirm = () => {
    const entry = {
      location,
      hourlyWage,
      startTime,
      endTime,
      tax,
    };
    setEntries([...entries, entry]);
    setCurrentEntryIndex(entries.length); // Set the current entry index to the new entry
    setShowConfirmation(true);

    // Save data to localStorage
    localStorage.setItem("entries", JSON.stringify([...entries, entry]));

    // Reset input fields
    setLocation("");
    setHourlyWage("");
    setStartTime("");
    setEndTime("");
    setTax("");
  };

  const handleReset = () => {
    // Reset form input fields without affecting the entries
    setLocation("");
    setHourlyWage("");
    setStartTime("");
    setEndTime("");
    setTax("");
    setCurrentEntryIndex(0); // Reset the current entry index
    setShowConfirmation(false);
  };

  const handlePreviousEntry = () => {
    if (currentEntryIndex > 0) {
      setCurrentEntryIndex(currentEntryIndex - 1);
    }
  };

  const handleNextEntry = () => {
    if (currentEntryIndex < entries.length - 1) {
      setCurrentEntryIndex(currentEntryIndex + 1);
    }
  };

  const handleDeleteEntry = () => {
    const updatedEntries = [...entries];
    updatedEntries.splice(currentEntryIndex, 1);
    setEntries(updatedEntries);
    
    localStorage.setItem("entries", JSON.stringify(updatedEntries));

    if (updatedEntries.length === 0) {
      setShowConfirmation(false);
    } else {
      if (currentEntryIndex === updatedEntries.length) {
        setCurrentEntryIndex(currentEntryIndex - 1);
      }
    }
  };

  const handleToggleConfirmation = () => {
    if (entries.length === 0) {
      // Display a message if there are no entries
      alert("근무지를 입력하세요.");
    } else {
      setShowConfirmation(!showConfirmation);
    }
  };

  return (
    <div className="mypage">
      <fieldset>
        <legend>근무 정보 입력</legend>
        근무지: <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        <br />
        시급: <input type="number" value={hourlyWage} onChange={(e) => setHourlyWage(e.target.value)} /> 원
        <br />
        시간: <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /> ~ <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <br />
        <div>
          세금: 
          <input type="radio" name="tax" value="3.3" checked={tax === "3.3"} onChange={(e) => setTax(e.target.value)} /> 3.3% 
          <input type="radio" name="tax" value="9.32" checked={tax === "9.32"} onChange={(e) => setTax(e.target.value)} /> 9.32%
          <input type="radio" name="tax" value="noTax" checked={tax === "noTax"} onChange={(e) => setTax(e.target.value)} /> 적용 안함
        </div>
        <br />
        <button type="submit" className="btnConfirm" onClick={handleConfirm}>
          확인
        </button>
        <button type="reset" className="btnCancel" onClick={handleReset}>
          취소
        </button>
        <button
          className="btnToggleConfirmation"
          onClick={handleToggleConfirmation}
        >
          {entries.length === 0 ? '근무지를 입력하세요' : '근무지 보기'}
        </button>
      </fieldset>

      {showConfirmation && entries.length > 0 && (
        <fieldset className="confirmation-section">
          <legend>근무 정보 확인</legend>
          <button onClick={handlePreviousEntry} disabled={currentEntryIndex === 0}>
            이전
          </button>
          <button onClick={handleNextEntry} disabled={currentEntryIndex === entries.length - 1}>
            다음
          </button>
          <button onClick={handleDeleteEntry}>
            삭제
          </button>
          <div className="scrollable-content">
            <div key={currentEntryIndex}>
              <fieldset>
                <legend>근무지 {currentEntryIndex + 1}</legend>
                <p>근무지: {entries[currentEntryIndex].location}</p>
                <p>시급: {entries[currentEntryIndex].hourlyWage}원</p>
                <p>근무 시간: {entries[currentEntryIndex].startTime} ~ {entries[currentEntryIndex].endTime}</p>
                <p>세금: {entries[currentEntryIndex].tax === "noTax" ? "적용 안함" : entries[currentEntryIndex].tax + "%"}</p>
              </fieldset>
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
};