import './App.css';
import {Navbar} from "./cmponents/Navbar";
import {Route, Routes} from "react-router-dom";
import { Calender, Analyze, MypageWork, MypageExpenditure} from './cmponents/pages/index';


function App() {
  return (
    <div className = "App"> 
      <Navbar/>
      <Routes>
        <Route path="/" element={<Calender />} />
        <Route path="/calendar" element={<Calender />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/mypageWork" element={<MypageWork />} />
        <Route path="/mypageExpenditure" element={<MypageExpenditure />} />
      </Routes>
    </div>)
}

export default App;
