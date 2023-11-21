import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  const calculateTotalSum = () => {
    let sum = 0;

    for (let key in localStorage) {
      if (key.startsWith('work')) {
        const totalSumValue = localStorage.getItem(key) || '0';
        const totalSum = parseFloat(totalSumValue);
        
        sum += totalSum;
      }
    }

    return sum.toString();
  };

  const [currentAsset, setCurrentAsset] = useState(() => {
    return calculateTotalSum();
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAsset(() => calculateTotalSum());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false); // State for MyPage submenu

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMyPageClick = () => {
    setIsMyPageOpen(!isMyPageOpen); // Toggle MyPage submenu
  };

  return (
    <nav role="navigation">
      <div id="menuToggle">
        <input type="checkbox" checked={isMenuOpen} onChange={handleMenuToggle} />
        <span></span>
        <span></span>
        <span></span>

        <ul id="menu">
          <li className="asset">
            <b>현재 자산</b>
            <br/><br/>&nbsp;{currentAsset}원
          </li>
          <li>
            <NavLink to="/calendar">
              달력
            </NavLink>
          </li>

          <li>
            <NavLink to="/analyze">
              분석
            </NavLink>
          </li>

          <li>
            <NavLink
              onClick={handleMyPageClick}
            >
              마이페이지
            </NavLink>
            {isMyPageOpen && (
              <ul>
                <li>
                  <NavLink to="/mypageWork">근무</NavLink>
                </li>
                <li>
                  <NavLink to="/mypageExpenditure">지출</NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};
