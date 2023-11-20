import React, { useState,useEffect } from 'react';

const IncomeModal = ({ isOpen, closeModal, selectedDate, initialDate }) => {
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `income ${year}-${month}-${day}`;
  };

  // 추가: 월별 데이터를 업데이트하는 함수
  const updateMonthlyData = (currentMonth, updatedValue) => {
    // 해당 월의 데이터만 가져오도록 수정
    const monthlyData = localStorage.getItem(`monthlyData_${currentMonth}`) || 0;
    const updatedData = Number(monthlyData) + updatedValue;  // 값으로 받기

    localStorage.setItem(`monthlyData_${currentMonth}`, updatedData);
};


  const [incomeAsset, setIncomeAsset] = useState(initialDate || '');
  const [incomeSource, setIncomeSource] = useState('');
  const handleDateChange = (newWorkValue) => {
    setIncomeAsset(newWorkValue);
  };



  const handleIncomeSourceChange = (e) => {
    setIncomeSource(e.target.value);
  };

  const handleSave = () => {
    const currentDateKey = getDateKey(selectedDate);
    const savedValue = parseFloat(localStorage.getItem(currentDateKey)) || 0;
    const newValue = parseFloat(incomeAsset) || 0;

    const updatedValue = savedValue + newValue;

    const currentMonth = selectedDate.getMonth();
    updateMonthlyData(currentMonth, updatedValue);

    localStorage.setItem(currentDateKey, updatedValue.toString());

  
    if (incomeSource.trim() === '' || incomeAsset.trim() === '') {
      alert('수입 출처와 수입 금액을 모두 입력해주세요.');
      return;
    }
    
    closeModal();
  };


    // 추가: 월별 데이터 초기화 함수
    const initMonthlyData = () => {
      const currentMonth = new Date().getMonth();
      const monthlyData = JSON.parse(localStorage.getItem(`monthlyData_${currentMonth}`)) || Array(12).fill(0);
      console.log('Monthly Data from initMonthlyData:', monthlyData);
      return monthlyData;
    };
  
    
    
    // 선택한 날짜와 현재 날짜가 같으면 저장된 값을 초기값으로 설정
    useEffect(() => {
      const currentDateKey = getDateKey(selectedDate);
      const savedValue = localStorage.getItem(currentDateKey) || '';
  
      // 모달이 열릴 때 incomeAsset을 초기 상태나 빈 문자열로 설정
      setIncomeAsset(isOpen ? '' : savedValue);
  
      // 월별 데이터 초기화
      const monthlyData = initMonthlyData();
      console.log('Monthly Data from useEffect:', monthlyData); // 확인용 콘솔 로그
    }, [selectedDate, isOpen]);
  

  return (
    <div className={`income-modal ${isOpen ? 'open' : ''}`}>
      <div className="date">
        {selectedDate.toLocaleDateString()}
      </div>
      <p> [부가 수입] </p>

      <div className="Income-content">
        <p> 수입 출처 : </p>
        <input
          className='text'
          type='text'
          placeholder="수입 출처를 입력해주세요"
          value={incomeSource}
          onChange={handleIncomeSourceChange}
        />
        <p> 수입 금액 : </p>
        <input
          className='num'
          type='number'
          placeholder="수입 금액을 입력해주세요"
          value={incomeAsset}
          onChange={(e)=> handleDateChange(e.target.value)}
          required
        />
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

export default IncomeModal;