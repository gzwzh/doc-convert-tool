import { categories } from '../data';

export const getAllTools = () => {
  return Object.values(categories).flat().flatMap(section => 
    section.tools.map(tool => ({ ...tool, sectionName: section.name }))
  );
};

export const findToolByName = (name) => {
  const allTools = getAllTools();
  return allTools.find(tool => tool.name === name);
};

export const findSectionByToolName = (toolName) => {
  const sections = Object.values(categories).flat();
  for (const section of sections) {
    if (section.tools.some(t => t.name === toolName)) {
      return section;
    }
  }
  return null;
};

export const getCategoryByExtension = (ext) => {
  const extension = ext.toLowerCase().replace('.', '');
  const map = {
    'docx': 'docx_converter',
    'doc': 'docx_converter',
    'html': 'html_converter',
    'htm': 'html_converter',
    'json': 'json_converter',
    'pdf': 'pdf_converter',
    'ppt': 'ppt_converter',
    'pptx': 'ppt_converter',
    'xls': 'excel_converter',
    'xlsx': 'excel_converter',
    'txt': 'txt_converter',
    'xml': 'xml_converter'
  };
  return map[extension];
};
