import React, { useState, useEffect } from 'react';

const WorkModal = ({ isOpen, closeModal, initialDate, selectedDate }) => {
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `work ${year}-${month}-${day}`;
  };

  const getWeekStartDate = (date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  };
  
  // 해당 날짜가 속한 주의 끝 날짜를 찾는 함수
  const getWeekEndDate = (date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  // 추가: 월별 데이터를 업데이트하는 함수
  const updateMonthlyData = (currentMonth, updatedValue) => {
    // 해당 월의 데이터만 가져오도록 수정
    const monthlyData = localStorage.getItem(`monthlyData_${currentMonth}`) || 0;
    const updatedData = Number(monthlyData) + updatedValue;  // 값으로 받기

    localStorage.setItem(`monthlyData_${currentMonth}`, updatedData);
};

  
  const [inputAsset, setInputAsset] = useState(initialDate || '');
  const [workSource, setWorkSource] = useState('');
  const [workStartTime, setWorkStartTime] = useState('');
  const [workEndTime, setWorkEndTime] = useState('');

  const handleDateChange = (newWorkValue) => {
    setInputAsset(newWorkValue);
  };

  const handleWorkSourceChange = (e) => {
    setWorkSource(e.target.value);
  };

  const handleWorkStartTimeChange = (e) => {
    setWorkStartTime(e.target.value);
  };

  const handleWorkEndTimeChange = (e) => {
    setWorkEndTime(e.target.value);
  };

  const handleSave = () => {
    const currentDateKey = getDateKey(selectedDate);
    const savedValue = parseFloat(localStorage.getItem(currentDateKey)) || 0;
    const newValue = parseFloat(inputAsset) || 0;

    const startTimeValue = workStartTime || '00:00';
    const endTimeValue = workEndTime || '00:00';

    const startTime = new Date(`2000-01-01T${startTimeValue}`);
    const endTime = new Date(`2000-01-01T${endTimeValue}`);

    const timeDifference = endTime - startTime;
    const wage = timeDifference / 3600000;

    const weekStartDate = getWeekStartDate(selectedDate);
    const weekEndDate = getWeekEndDate(selectedDate);

    let totalWeeklyWorkHours = 0;

    let currentDate = weekStartDate;

    while (currentDate <= weekEndDate) {
      const currentDateKey = getDateKey(currentDate);
      const dailyWorkHours = parseFloat(localStorage.getItem(currentDateKey)) || 0;

      totalWeeklyWorkHours += dailyWorkHours;
      
      // 다음 날짜로 이동
      currentDate.setDate(currentDate.getDate() + 1);
    }

    let totalWage = 0;
    if (totalWeeklyWorkHours / (weekEndDate.getDay() - weekStartDate.getDay() + 1) >= 15) {
      totalWage = totalWeeklyWorkHours * inputAsset / 5;
    }

    const newTotalWage = totalWage;
    const weekKey = `weekwage ${weekEndDate.getFullYear()}-${weekEndDate.getMonth() + 1}-${weekEndDate.getDate()}`;
    console.log('Week Key:', weekKey, totalWage);
    localStorage.setItem(weekKey, newTotalWage.toString());

    const updatedValue = savedValue + (newValue * wage);

    const currentMonth = selectedDate.getMonth();
    updateMonthlyData(currentMonth, updatedValue);

    localStorage.setItem(currentDateKey, updatedValue.toString());

    // 빈칸 방지
    if (workSource.trim() === '' || inputAsset.trim() === '' || workStartTime.trim() === '' || workEndTime.trim() === '') {
      alert('빈칸을 모두 채워주세요');
      return;
    }

    // 모달을 닫기
    closeModal();

      };

  // 추가: 월별 데이터 초기화 함수
  const initMonthlyData = () => {
    const currentMonth = new Date().getMonth();
    const monthlyData = JSON.parse(localStorage.getItem(`monthlyData_${currentMonth}`)) || Array(12).fill(0);
    return monthlyData;
  };

  
  
  // 선택한 날짜와 현재 날짜가 같으면 저장된 값을 초기값으로 설정
  useEffect(() => {
    const currentDateKey = getDateKey(selectedDate);
    const savedValue = localStorage.getItem(currentDateKey) || '';

    // 모달이 열릴 때 inputAsset을 초기 상태나 빈 문자열로 설정
    setInputAsset(isOpen ? '' : savedValue);

    // 월별 데이터 초기화
    const monthlyData = initMonthlyData();
    console.log('Monthly Data from useEffect:', monthlyData); // 확인용 콘솔 로그
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
