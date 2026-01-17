import { useNavigate } from 'react-router-dom';
import '../App.css';

const categoryMap = {
  'DOCX 转换': 'docx',
  'HTML 转换': 'html',
  'JSON 转换': 'json',
  'PDF 转换': 'pdf',
  'TXT 转换': 'txt',
  'XML 转换': 'xml'
};

const icons = {
  'DOCX 转换': '📝',
  'HTML 转换': '🌐',
  'JSON 转换': '🔢',
  'PDF 转换': '📕',
  'TXT 转换': '📄',
  'XML 转换': '🧩'
};

const descriptions = {
  'DOCX 转换': 'Word 文档转换为 PDF, 图片, 文本等',
  'HTML 转换': 'HTML 网页转换为 PDF, 图片, Markdown 等',
  'JSON 转换': 'JSON 数据转换为 YAML, XML, CSV, PDF 等',
  'PDF 转换': 'PDF 转换为 Word, 图片, 文本, HTML 等',
  'TXT 转换': '纯文本转换为 PDF, 语音, CSV, HTML 等',
  'XML 转换': 'XML 数据转换为 JSON, YAML, CSV, PDF 等'
};

function Home() {
  const navigate = useNavigate();
  const categories = Object.keys(categoryMap);

  return (
    <div className="app-container" style={{ background: '#f8fafc', minHeight: '100vh', height: 'auto', overflow: 'visible', padding: '60px 20px' }}>
      <div className="home-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 className="home-title">ConvertTool</h1>
        <p className="home-subtitle">简单、快速、安全的在线文件转换工具</p>
        
        <div className="home-grid">
          {categories.map((cat) => (
            <div 
              key={cat} 
              className="home-card"
              onClick={() => navigate(`/tools/${categoryMap[cat]}`)}
            >
              <div className="home-card-icon">{icons[cat]}</div>
              <h2 className="home-card-title">{cat}</h2>
              <p className="home-card-desc">{descriptions[cat]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
