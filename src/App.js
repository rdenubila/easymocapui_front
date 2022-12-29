import './App.css';
import { } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from 'react';
import CalibrationList from './pages/calibration/CalibrationList';
import Home from './pages/Home';
import CalibrationForm from './pages/calibration/CalibrationForm';
import AnimationList from './pages/animation/AnimationList';
import AnimationForm from './pages/animation/AnimationForm';
import AnimationDetail from './pages/animation/AnimationDetail';
import DevicesList from './pages/devices/DevicesList';
import GlobalContext, { GlobalStateContext } from './wrappers/GlobalContext';
import StreamCamera from './pages/stream/StreamCamera';
import CalibrationDetail from './pages/calibration/CalibrationDetail';
import LogsList from './pages/logs/LogsList';

function ServerRoute({ children }) {
  const { videoStream, addPeer, removePeer, peers } = useContext(GlobalStateContext);
  videoStream.replaceFns(addPeer, removePeer, peers).connect(true);
  return children;
}

function ClientRoute({ children }) {
  const { videoStream } = useContext(GlobalStateContext);
  //videoStream.connect(false);
  return children;
}

function App() {
  return (
    <GlobalContext>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<ServerRoute><Home /></ServerRoute>} />
          <Route path="/logs" exact element={<ServerRoute><LogsList /></ServerRoute>} />
          <Route path="/devices" exact element={<ServerRoute><DevicesList /></ServerRoute>} />
          <Route path="calibration" exact element={<ServerRoute><CalibrationList /></ServerRoute>} />
          <Route path="calibration/new" exact element={<ServerRoute><CalibrationForm /></ServerRoute>} />
          <Route path="calibration/:id" exact element={<ServerRoute><CalibrationDetail /></ServerRoute>} />
          <Route path="animation" exact element={<ServerRoute><AnimationList /></ServerRoute>} />
          <Route path="animation/new" exact element={<ServerRoute><AnimationForm /></ServerRoute>} />
          <Route path="animation/:id/edit" exact element={<ServerRoute><AnimationForm /></ServerRoute>} />
          <Route path="animation/:id" exact element={<ServerRoute><AnimationDetail /></ServerRoute>} />

          <Route path="/camera" element={<ClientRoute><StreamCamera /></ClientRoute>} />

        </Routes>
      </BrowserRouter>
    </GlobalContext>
  )
}

export default App;
