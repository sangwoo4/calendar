import React, { useState, useEffect } from "react";
import './mypage.css';

export const MypageExpenditure = () => {
  const [description, setDescription] = useState(""); // 지출 내용
  const [amount, setAmount] = useState(""); // 지출 금액
  const [expenditureDay, setExpenditureDay] = useState(""); // 지출일 (고정적인 매월 날짜)
  const [showConfirmation, setShowConfirmation] = useState(false); // 입력 확인 창 표시 여부
  const [expenses, setExpenses] = useState([]); // 지출 정보 목록
  const [currentExpenseIndex, setCurrentExpenseIndex] = useState(0); // 현재 선택된 지출 정보 인덱스

  // 페이지가 로드될 때 localStorage에서 저장된 데이터를 불러와 expenses 상태에 업데이트
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses"));

    if (savedExpenses) {
      setExpenses(savedExpenses);
    }
  }, []);

  // 확인 버튼 클릭 시 호출되는 함수
  const handleConfirm = () => {
    // 현재 입력된 지출 정보를 객체로 생성
    const expense = {
      description,
      amount,
      expenditureDay,
    };

    // 기존 expenses에 새로운 지출 정보를 추가
    setExpenses([...expenses, expense]);

    // 현재 입력된 지출 정보의 인덱스를 설정하고 확인 창을 표시
    setCurrentExpenseIndex(expenses.length);
    setShowConfirmation(true);

    // localStorage에 데이터를 저장
    localStorage.setItem("expenses", JSON.stringify([...expenses, expense]));

    // 입력 필드 초기화
    setDescription("");
    setAmount("");
    setExpenditureDay("");
  };

  // 취소 버튼 클릭 시 호출되는 함수
  const handleReset = () => {
    // 입력 필드를 초기화하고 확인 창을 닫음
    setDescription("");
    setAmount("");
    setExpenditureDay("");
    setCurrentExpenseIndex(0);
    setShowConfirmation(false);
  };

  // 이전 지출 정보 보기 버튼 클릭 시 호출되는 함수
  const handlePreviousExpense = () => {
    if (currentExpenseIndex > 0) {
      setCurrentExpenseIndex(currentExpenseIndex - 1);
    }
  };

  // 다음 지출 정보 보기 버튼 클릭 시 호출되는 함수
  const handleNextExpense = () => {
    if (currentExpenseIndex < expenses.length - 1) {
      setCurrentExpenseIndex(currentExpenseIndex + 1);
    }
  };

  // 지출 정보 삭제 버튼 클릭 시 호출되는 함수
  const handleDeleteExpense = () => {
    // 선택된 지출 정보를 제외한 나머지를 가진 새로운 배열을 생성하여 expenses를 업데이트
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(currentExpenseIndex, 1);
    setExpenses(updatedExpenses);

    // localStorage에 업데이트된 expenses를 저장
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    // 만약 업데이트된 expenses가 비어있다면 확인 창을 닫고, 그렇지 않으면 인덱스를 조정
    if (updatedExpenses.length === 0) {
      setShowConfirmation(false);
    } else {
      if (currentExpenseIndex === updatedExpenses.length) {
        setCurrentExpenseIndex(currentExpenseIndex - 1);
      }
    }
  };

  // 확인 창 토글 버튼 클릭 시 호출되는 함수
  const handleToggleConfirmation = () => {
    // 만약 지출 정보가 없다면 메시지를 표시하고, 그렇지 않으면 확인 창을 토글
    if (expenses.length === 0) {
      alert("지출 내용을 입력하세요.");
    } else {
      setShowConfirmation(!showConfirmation);
    }
  };

  // Generate an array of options for the select element
  const dayOptions = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <div className="mypage">
      <fieldset>
        <legend> 지출 정보 입력 </legend>
        내용: <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <br />
        금액: <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /> 원
        <br />
        지출일 (매월):
        <select value={expenditureDay} onChange={(e) => setExpenditureDay(e.target.value)}>
          {dayOptions.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select> 일
        <br /> <br />
        <button type="submit" className="btnConfirm" onClick={handleConfirm}>
          확인
        </button>
        <button type="reset" className="btnCancel" onClick={handleReset}>
          취소
        </button>
        <button className="btnToggleConfirmation" onClick={handleToggleConfirmation}>
          {expenses.length === 0 ? "지출 내용을 입력하세요" : "지출 내용 보기"}
        </button>
      </fieldset>

      {/* 입력 확인 창이 표시되고 지출 정보가 하나 이상일 때 */}
      {showConfirmation && expenses.length > 0 && (
        <fieldset className="confirmation-section">
          <legend>입력 확인</legend>
          <button onClick={handlePreviousExpense} disabled={currentExpenseIndex === 0}>
            이전
          </button>
          <button onClick={handleNextExpense} disabled={currentExpenseIndex === expenses.length - 1}>
            다음
          </button>
          <button onClick={handleDeleteExpense}>삭제</button>
          <div className="scrollable-content">
            {/* 현재 선택된 지출 정보를 표시 */}
            <div key={currentExpenseIndex}>
              <fieldset>
                <legend>입력 확인 {currentExpenseIndex + 1}</legend>
                <p>내용: {expenses[currentExpenseIndex].description}</p>
                <p>금액: {expenses[currentExpenseIndex].amount}원</p>
                <p>지출일(매달): {expenses[currentExpenseIndex].expenditureDay}일</p>
              </fieldset>
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
};