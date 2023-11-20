import React, { useState } from 'react';

const ExpenditureModal = ({ isOpen, closeModal, initialDate, selectedDate }) => {
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `expenditure ${year}-${month}-${day}`;
  };

    // 추가: 월별 데이터를 업데이트하는 함수
    const updatedMonthlyExData = (currentMonth, currentAsset) => {
      // 해당 월의 데이터만 가져오도록 수정
      const monthlyExData = localStorage.getItem(`monthlyExData_${currentMonth}`) || 0;
      const updatedExData = Number(monthlyExData) + currentAsset;  // 값으로 받기
  
      localStorage.setItem(`monthlyExData_${currentMonth}`, updatedExData);
  };
  

  const [expenditureSource, setExpenditureSource] = useState('');
  const [inputExpenditure, setInputExpenditure] = useState(initialDate || '');

  const handleExpenditureSourceChange = (e) => {
    setExpenditureSource(e.target.value);
  };

  const handleExpenditureAmountChange = (e) => {
    setInputExpenditure(e.target.value);
  };

  const handleSave = () => {
    const currentDateKey = getDateKey(selectedDate);
    const savedValue = parseFloat(localStorage.getItem(currentDateKey)) || 0;
    const newValue = parseFloat(inputExpenditure) || 0;

    const currentAsset = savedValue - newValue;

    const currentMonth = selectedDate.getMonth();
    updatedMonthlyExData(currentMonth, currentAsset);


    localStorage.setItem(currentDateKey, currentAsset.toString());

    //빈칸방지
    if (expenditureSource.trim() === '' || inputExpenditure.trim() === '') {
      alert('사용 내역과 사용 금액을 모두 입력해주세요.');
      return;
    }

    closeModal();
  };

  
  return (
    <div className={`expenditure-modal ${isOpen ? 'open' : ''}`}>
      <div className="date">
        {selectedDate.toLocaleDateString()}
      </div>
      <p> [지출] </p>

      <div className="Expenditure-content">
        <p> 지출 내역 : </p>
        <input
          className="text"
          type="text"
          placeholder="사용한 내역을 입력해주세요"
          value={expenditureSource}
          onChange={handleExpenditureSourceChange}
        />
        <p> 지출 금액 : </p>
        <input
          className="num"
          type="number"
          placeholder="사용한 금액을 입력해주세요"
          value={inputExpenditure}
          onChange={handleExpenditureAmountChange}
        />
      </div>
      <p>
        <button className="btnOk" onClick={handleSave}>등록</button>
        <button className="btnCancel2" onClick={closeModal}>취소</button>
      </p>
    </div>
  );
};

export default ExpenditureModal;
