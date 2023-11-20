import React, { useState } from 'react';
import './modal.css';
import WorkModal from './WorkModal';
import ExpenditureModal from './ExpenditureModal';
import IncomeModal from './IncomeModal';

const Modal = ({ isOpen, closeModal, selectedDate }) => {
  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [expenditureOpen, setExpenditureOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);

  const handleWorkClick = (e) => {
    e.stopPropagation();
    console.log("Work button clicked");
    setWorkModalOpen(true);
    setExpenditureOpen(false);
    setIncomeOpen(false);
  };
  

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
        <p><b>선택한 날짜 : {selectedDate.toLocaleDateString()} </b></p>
        
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
      </div>
      {workModalOpen && (
        <WorkModal
          isOpen={workModalOpen}
          closeModal={() => setWorkModalOpen(false)}
          selectedDate={selectedDate}
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
