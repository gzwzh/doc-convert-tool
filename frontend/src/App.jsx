import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import VideoTools from './pages/VideoTools';
import ImageTools from './pages/ImageTools';
import DocTools from './pages/DocTools';
import AudioTools from './pages/AudioTools';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/video" element={<VideoTools />} />
        <Route path="/tools/image" element={<ImageTools />} />
        <Route path="/tools/doc" element={<DocTools />} />
        <Route path="/tools/audio" element={<AudioTools />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
