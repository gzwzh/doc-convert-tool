const icons = require('./icons.js');

const categories = [
  {
    id: 'word',
    name: 'Word 转换器',
    icon: icons.word,
    tools: [
      { id: 101, title: 'Word 转 PDF', icon: icons.pdf, source: 'docx', target: 'pdf' },
      { id: 102, title: 'Word 转 PNG', icon: icons.image, source: 'docx', target: 'png' },
      { id: 103, title: 'Word 转 JPG', icon: icons.image, source: 'docx', target: 'jpg' },
      { id: 104, title: 'Word 转 TXT', icon: icons.txt, source: 'docx', target: 'txt' },
      { id: 105, title: 'Word 转 EPUB', icon: icons.word, source: 'docx', target: 'epub' },
    ]
  },
  {
    id: 'pdf',
    name: 'PDF 转换器',
    icon: icons.pdf,
    tools: [
      { id: 201, title: 'PDF 转 Word (DOC)', icon: icons.word, source: 'pdf', target: 'doc' },
      { id: 202, title: 'PDF 转 Word (DOCX)', icon: icons.word, source: 'pdf', target: 'docx' },
      { id: 203, title: 'PDF 转 图片 (PNG)', icon: icons.image, source: 'pdf', target: 'png' },
      { id: 204, title: 'PDF 转 图片 (JPG)', icon: icons.image, source: 'pdf', target: 'jpg' },
      { id: 205, title: 'PDF 转 SVG', icon: icons.image, source: 'pdf', target: 'svg' },
      { id: 206, title: 'PDF 转 JSON', icon: icons.json, source: 'pdf', target: 'json' },
      { id: 207, title: 'PDF 转 EPUB', icon: icons.word, source: 'pdf', target: 'epub' },
      { id: 208, title: 'PDF 转 TXT', icon: icons.txt, source: 'pdf', target: 'txt' },
      { id: 209, title: 'PDF 转 HTML', icon: icons.html, source: 'pdf', target: 'html' },
      { id: 210, title: 'PDF 转 PPT', icon: icons.ppt, source: 'pdf', target: 'ppt' },
      { id: 211, title: 'PDF 转 GIF', icon: icons.image, source: 'pdf', target: 'gif' },
    ]
  },
  {
    id: 'html',
    name: 'HTML 转换器',
    icon: icons.html,
    tools: [
      { id: 301, title: 'HTML 转 PDF', icon: icons.pdf, source: 'html', target: 'pdf' },
      { id: 302, title: 'HTML 转 图片 (JPG)', icon: icons.image, source: 'html', target: 'jpg' },
      { id: 303, title: 'HTML 转 图片 (PNG)', icon: icons.image, source: 'html', target: 'png' },
      { id: 304, title: 'HTML 转 SVG', icon: icons.image, source: 'html', target: 'svg' },
      { id: 305, title: 'HTML 转 Word', icon: icons.word, source: 'html', target: 'docx' },
      { id: 306, title: 'HTML 转 TXT', icon: icons.txt, source: 'html', target: 'txt' },
      { id: 307, title: 'HTML 转 Markdown', icon: icons.txt, source: 'html', target: 'md' },
      { id: 308, title: 'HTML 转 JSON', icon: icons.json, source: 'html', target: 'json' },
    ]
  },
  {
    id: 'json',
    name: 'JSON 转换器',
    icon: icons.json,
    tools: [
      { id: 401, title: 'JSON 转 YAML', icon: icons.html, source: 'json', target: 'yaml' },
      { id: 402, title: 'JSON 转 XML', icon: icons.html, source: 'json', target: 'xml' },
      { id: 403, title: 'JSON 转 CSV', icon: icons.excel, source: 'json', target: 'csv' },
      { id: 404, title: 'JSON 转 HTML', icon: icons.html, source: 'json', target: 'html' },
      { id: 405, title: 'JSON 转 PDF', icon: icons.pdf, source: 'json', target: 'pdf' },
      { id: 406, title: 'JSON 转 图片 (PNG)', icon: icons.image, source: 'json', target: 'png' },
    ]
  },
  {
    id: 'txt',
    name: 'TXT 转换器',
    icon: icons.txt,
    tools: [
      { id: 501, title: 'TXT 转 PDF', icon: icons.pdf, source: 'txt', target: 'pdf' },
      { id: 502, title: 'TXT 转 图片 (JPG)', icon: icons.image, source: 'txt', target: 'jpg' },
      { id: 503, title: 'TXT 转 图片 (PNG)', icon: icons.image, source: 'txt', target: 'png' },
      { id: 504, title: 'TXT 转 HTML', icon: icons.html, source: 'txt', target: 'html' },
      { id: 505, title: 'TXT 转 CSV', icon: icons.excel, source: 'txt', target: 'csv' },
      { id: 506, title: 'TXT 转 语音 (MP3)', icon: icons.ppt, source: 'txt', target: 'mp3' },
      { id: 507, title: 'TXT 转 ASCII', icon: icons.txt, source: 'txt', target: 'ascii' },
      { id: 508, title: 'TXT 转 二进制', icon: icons.html, source: 'txt', target: 'binary' },
      { id: 509, title: 'TXT 转 十六进制', icon: icons.html, source: 'txt', target: 'hex' },
    ]
  },
  {
    id: 'xml',
    name: 'XML 转换器',
    icon: icons.html,
    tools: [
      { id: 601, title: 'XML 转 JSON', icon: icons.json, source: 'xml', target: 'json' },
      { id: 602, title: 'XML 转 YAML', icon: icons.html, source: 'xml', target: 'yaml' },
      { id: 603, title: 'XML 转 CSV', icon: icons.excel, source: 'xml', target: 'csv' },
      { id: 604, title: 'XML 转 PDF', icon: icons.pdf, source: 'xml', target: 'pdf' },
      { id: 605, title: 'XML 转 Excel', icon: icons.excel, source: 'xml', target: 'xlsx' },
      { id: 606, title: 'XML 转 HTML', icon: icons.html, source: 'xml', target: 'html' },
      { id: 607, title: 'XML 转 TXT', icon: icons.txt, source: 'xml', target: 'txt' },
      { id: 608, title: 'XML 转 图片 (PNG)', icon: icons.image, source: 'xml', target: 'png' },
    ]
  }
];

module.exports = {
  categories: categories,
  icons: icons
};
