// frontend/src/services/api.js
const API_BASE_URL = 'http://127.0.0.1:8002';

/**
 * 转换 JSON 文件
 * @param {File} file - JSON 文件
 * @param {string} targetFormat - 目标格式 (yaml 或 yml)
 * @param {Object} options - 转换选项
 * @returns {Promise<Object>} 转换结果
 */
export const convertJSON = async (file, targetFormat, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);
    
    // Add optional parameters
    if (options.indent) formData.append('indent', options.indent);
    if (options.sortKeys) formData.append('sort_keys', options.sortKeys);

    const response = await fetch(`${API_BASE_URL}/api/convert/json`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '转换失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
};

export const convertXML = async (file, targetFormat, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);
    
    // Add optional parameters (same as JSON)
    if (options.indent) formData.append('indent', options.indent);
    if (options.sortKeys) formData.append('sort_keys', options.sortKeys);

    const response = await fetch(`${API_BASE_URL}/api/convert/xml`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '转换失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
};

export const convertGeneral = async (file, targetFormat, options = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);
    
    // Add optional parameters
    if (options.encoding) formData.append('encoding', options.encoding);
    
    // HTML specific options
    if (options.enablePreview !== undefined) formData.append('enable_preview', options.enablePreview);
    if (options.cssHandling) formData.append('css_handling', options.cssHandling);
    if (options.compressCss !== undefined) formData.append('compress_css', options.compressCss);
    if (options.customCss) formData.append('custom_css', options.customCss);
    if (options.removeScripts !== undefined) formData.append('remove_scripts', options.removeScripts);
    if (options.removeComments !== undefined) formData.append('remove_comments', options.removeComments);
    if (options.compressHtml !== undefined) formData.append('compress_html', options.compressHtml);
    if (options.removeEmptyTags !== undefined) formData.append('remove_empty_tags', options.removeEmptyTags);
    if (options.pageSize) formData.append('page_size', options.pageSize);
    if (options.orientation) formData.append('orientation', options.orientation);
    
    // Image quality options
    if (options.quality !== undefined) formData.append('quality', options.quality);
    if (options.backgroundColor) formData.append('background_color', options.backgroundColor);
    
    // Watermark options
    if (options.watermark_text) formData.append('watermark_text', options.watermark_text);
    if (options.watermark_opacity !== undefined) formData.append('watermark_opacity', options.watermark_opacity);
    if (options.watermark_size !== undefined) formData.append('watermark_size', options.watermark_size);
    if (options.watermark_color) formData.append('watermark_color', options.watermark_color);
    if (options.watermark_angle !== undefined) formData.append('watermark_angle', options.watermark_angle);
    if (options.watermark_position) formData.append('watermark_position', options.watermark_position);
    
    // CSV options
    if (options.csvDelimiter) formData.append('csv_delimiter', options.csvDelimiter);
    
    // PDF page selection
    if (options.pdfPageSelection) formData.append('pdf_page_selection', options.pdfPageSelection);
    
    // GIF animation options
    if (options.animationDelay !== undefined) formData.append('animation_delay', options.animationDelay);
    if (options.loopAnimation !== undefined) formData.append('loop_animation', options.loopAnimation);

    const response = await fetch(`${API_BASE_URL}/api/convert/general`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '转换失败');
    }

    return await response.json();
  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
};

/**
 * 健康检查
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};
