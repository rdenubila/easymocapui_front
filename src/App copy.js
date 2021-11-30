import { useRef, useState } from 'react';
import './App.css';
import VideoRecorder from './components/VideoRecorder';

function App() {

  const refs = useRef([]);

  const [recStatus, setRecStatus] = useState('stopped');

  const startRecording = () => {
    refs.current.forEach(ref => ref.record())
  }
  const stopRecording = () => {
    refs.current.forEach(ref => ref.stopRecord())
  }
  return (
    <div className="App">
      <header className="App-header">
        {[1, 2, 3].map((v, i) => <VideoRecorder ref={el => (refs.current[i] = el)} recStatus={recStatus} />)}
        <button onClick={startRecording}>GRAVAR</button>
        <button onClick={stopRecording}>PARAR</button>
      </header>
    </div>
  );
}

export default App;
