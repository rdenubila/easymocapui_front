import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import HeaderContentFooter from './templates/HeaderContentFooter';
import CalibrationList from './pages/calibration/CalibrationList';
import Home from './pages/Home';
import CalibrationForm from './pages/calibration/CalibrationForm';

function App() {
  return (
    <BrowserRouter>
      <HeaderContentFooter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calibration" exact element={<CalibrationList />} />
          <Route path="/calibration/new" exact element={<CalibrationForm />} />
        </Routes>
      </HeaderContentFooter>
    </BrowserRouter>
  )
}

export default App;
