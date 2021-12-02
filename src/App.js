import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import HeaderContentFooter from './templates/HeaderContentFooter';
import CalibrationList from './pages/calibration/CalibrationList';
import Home from './pages/Home';
import CalibrationForm from './pages/calibration/CalibrationForm';
import AnimationList from './pages/animation/AnimationList';
import AnimationForm from './pages/animation/AnimationForm';
import AnimationDetail from './pages/animation/AnimationDetail';

function App() {
  return (
    <BrowserRouter>
      <HeaderContentFooter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calibration" exact element={<CalibrationList />} />
          <Route path="/calibration/new" exact element={<CalibrationForm />} />
          <Route path="/animations" exact element={<AnimationList />} />
          <Route path="/animation/new" exact element={<AnimationForm />} />
          <Route path="/animation/:id" exact element={<AnimationDetail />} />
        </Routes>
      </HeaderContentFooter>
    </BrowserRouter>
  )
}

export default App;
