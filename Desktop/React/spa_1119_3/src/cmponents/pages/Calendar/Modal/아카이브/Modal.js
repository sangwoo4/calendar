import React, { useState, useEffect } from 'react';
import './modal.css';
import WorkModal from './WorkModal';
import ExpenditureModal from './ExpenditureModal';
import IncomeModal from './IncomeModal';

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

const Modal = ({ isOpen, closeModal, selectedDate }) => {
  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [expenditureOpen, setExpenditureOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [savedWorkValues, setSavedWorkValues] = useState([]);

  const handleWorkClick = (e) => {
    e.stopPropagation();
    console.log("Work button clicked");
    setWorkModalOpen(true);
    setExpenditureOpen(false);
    setIncomeOpen(false);
  };

  useEffect(() => {
    const currentDateKey = getDateKey(selectedDate);
    const savedValues = JSON.parse(localStorage.getItem(currentDateKey)) || [];
    setSavedWorkValues(savedValues);
  }, [selectedDate]);

  const handleExpenditureClick = (e) => {
    e.stopPropagation();
    setExpenditureOpen(true);
    setWorkModalOpen(false);
    setIncomeOpen(false);
  };

  const handleIncomeClick = (e) => {
    e.stopPropagation();
    setExpenditureOpen(false);
    setIncomeOpen(true);
    setWorkModalOpen(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`} onClick={handleModalClick}>
      <div className="modal-content">
        <span onClick={closeModal} className="close">
          &times;
        </span>
        <p><b>선택한 날짜 : {getDateKey(selectedDate)} </b></p>

        <p>
          <button className="work" onClick={handleWorkClick}>
            근무
          </button>
        </p>
        <p>
          <button className="expenditure" onClick={handleExpenditureClick}>
            지출
          </button>
        </p>
        <p>
          <button className="income" onClick={handleIncomeClick}>
            부가수입
          </button>
        </p>
        <p> [근무]</p>

        <p> [근무]</p>

{savedWorkValues.map((workEntry, index) => (
  <div key={index}>
    <p>근무지: {workEntry.workSource}</p>
    <p>시급: {workEntry.inputAsset}</p>
    <p>근무 시간: {workEntry.workStartTime} ~ {workEntry.workEndTime}</p>
  </div>
))}
      </div>
      {workModalOpen && (
        <WorkModal
          isOpen={workModalOpen}
          closeModal={() => setWorkModalOpen(false)}
          selectedDate={selectedDate}
          savedWorkValues={savedWorkValues}
        />
      )}
      {expenditureOpen && (
        <ExpenditureModal
          isOpen={expenditureOpen}
          closeModal={() => setExpenditureOpen(false)}
          selectedDate={selectedDate}
        />
      )}
      {incomeOpen && (
        <IncomeModal
          isOpen={incomeOpen}
          closeModal={() => setIncomeOpen(false)}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Modal;
