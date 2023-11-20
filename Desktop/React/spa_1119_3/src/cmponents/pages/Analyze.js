import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js/auto';
import "./Analyze.css"

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '월별 수입 및 지출 분석',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      stepSize: 0.1,
      ticks: {
        callback: function (value, index, values) {
          return value.toFixed(0) + '원';
        },
      },
    },
  },
};

const labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export const Analyze = ({ updateMonthlyData, updateMonthlyExData }) => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [monthlyExData, setMonthlyExData] = useState([]);
  
    useEffect(() => {
      console.log("Fetching monthly data...");
  
      // 월별 데이터 가져오기
      const fetchedData = Array(12).fill(0).map((_, index) => {
        const storedData = parseFloat(localStorage.getItem(`monthlyData_${index}`)) || 0;
        return storedData;
      });

      const fetchedExData = Array(12).fill(0).map((_, index) => {
        const storedData = parseFloat(localStorage.getItem(`monthlyExData_${index}`)) || 0;
        return storedData;
      });
  
      setMonthlyData(fetchedData);
      setMonthlyExData(fetchedExData);
    }, [updateMonthlyData,updateMonthlyExData]);
  
    const data = {
      labels,
      datasets: [

        {
          label: '월별 지출',
          data: monthlyExData.map(value => Math.abs(value)),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: '월별 수입',
          data: monthlyData,
          backgroundColor: 'rgb(0, 119, 255)',
        },
      ],
    };
  
    return (
      <div className="analyze">
        <Bar options={options} data={data} />
      </div>
    );
  };