import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import DocTools from './pages/DocTools';
import DocxTools from './pages/DocxTools';
import HtmlTools from './pages/HtmlTools';
import JsonTools from './pages/JsonTools';
import PdfTools from './pages/PdfTools';
import TxtTools from './pages/TxtTools';
import XmlTools from './pages/XmlTools';
import ToolPage from './pages/ToolPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/doc" element={<DocTools />} />
        <Route path="/tools/docx" element={<DocxTools />} />
        <Route path="/tools/html" element={<HtmlTools />} />
        <Route path="/tools/json" element={<JsonTools />} />
        <Route path="/tools/pdf" element={<PdfTools />} />
        <Route path="/tools/txt" element={<TxtTools />} />
        <Route path="/tools/xml" element={<XmlTools />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
