// frontend/src/services/api.js
let cachedApiBaseUrl = null;
const fallbackBaseUrl = import.meta?.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8002';

const resolveApiBaseUrl = async () => {
  if (cachedApiBaseUrl) {
    console.log('[API] Using cached base URL:', cachedApiBaseUrl);
    return cachedApiBaseUrl;
  }
  
  if (window?.electronAPI?.getBackendBaseUrl) {
    try {
      console.log('[API] Requesting backend URL from Electron...');
      const url = await window.electronAPI.getBackendBaseUrl();
      if (url) {
        console.log('[API] Got backend URL from Electron:', url);
        cachedApiBaseUrl = url;
        return cachedApiBaseUrl;
      }
    } catch (error) {
      console.error('[API] Failed to get backend URL from Electron:', error);
      cachedApiBaseUrl = fallbackBaseUrl;
      return cachedApiBaseUrl;
    }
  }
  
  console.log('[API] Using fallback base URL:', fallbackBaseUrl);
  cachedApiBaseUrl = fallbackBaseUrl;
  return cachedApiBaseUrl;
};

export const getApiBaseUrl = async () => resolveApiBaseUrl();

let backendReadyPromise = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureBackendReady = async (baseUrl) => {
  if (backendReadyPromise) return backendReadyPromise;
  backendReadyPromise = (async () => {
    console.log('[API] Checking backend health at:', baseUrl);
    const maxAttempts = 20;
    const delayMs = 300;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        console.log(`[API] Health check attempt ${attempt + 1}/${maxAttempts}...`);
        const response = await fetch(`${baseUrl}/api/health`, { method: 'GET' });
        if (response.ok) {
          console.log('[API] Backend is ready!');
          return true;
        }
        console.log('[API] Backend responded but not OK:', response.status);
      } catch (error) {
        console.log('[API] Health check failed:', error.message);
        await sleep(delayMs);
      }
    }
    console.error('[API] Backend failed to become ready after', maxAttempts, 'attempts');
    return false;
  })();
  const ready = await backendReadyPromise;
  if (!ready) backendReadyPromise = null;
  return ready;
};

const handleResponse = async (response, apiBaseUrl, file) => {
  if (!response.ok) {
    let errorDetail = '转换失败';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch {
      errorDetail = `转换失败 (${response.status}: ${response.statusText})`;
    }
    
    // 尝试获取诊断信息
    try {
      const diagResponse = await fetch(`${apiBaseUrl}/api/diagnostics`);
      if (diagResponse.ok) {
        const diagData = await diagResponse.json();
        console.error('[API] 转换失败诊断信息:', diagData);
        
        // 针对不同文件类型给出更具体的错误建议
        if (file) {
          const fileName = file.name.toLowerCase();
          if ((fileName.endsWith('.doc') || fileName.endsWith('.docx') || fileName.endsWith('.ppt') || fileName.endsWith('.pptx') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx'))) {
            if (diagData.office && !diagData.office.word && !diagData.office.excel && !diagData.office.ppt && !diagData.office.wps) {
              errorDetail += '。请确保电脑已安装 Microsoft Office 或 WPS Office。';
            }
          }
          if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
            if (diagData.browsers && !diagData.browsers.chrome && !diagData.browsers.edge) {
              errorDetail += '。请确保电脑已安装 Chrome 或 Edge 浏览器。';
            }
          }
        }
      }
    } catch (diagError) {
      console.warn('[API] 无法获取诊断信息:', diagError);
    }
    
    throw new Error(errorDetail);
  }
  return await response.json();
};

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

    const apiBaseUrl = await getApiBaseUrl();
    const ready = await ensureBackendReady(apiBaseUrl);
    if (!ready) {
      throw new Error('后端服务未启动');
    }
    const response = await fetch(`${apiBaseUrl}/api/convert/json`, {
      method: 'POST',
      body: formData,
      signal: options.signal,
    });

    return await handleResponse(response, apiBaseUrl, file);
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

    const apiBaseUrl = await getApiBaseUrl();
    const ready = await ensureBackendReady(apiBaseUrl);
    if (!ready) {
      throw new Error('后端服务未启动');
    }
    const response = await fetch(`${apiBaseUrl}/api/convert/xml`, {
      method: 'POST',
      body: formData,
      signal: options.signal,
    });

    return await handleResponse(response, apiBaseUrl, file);
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
    if (options.enable_preview !== undefined) formData.append('enable_preview', options.enable_preview);
    if (options.codeMode !== undefined) formData.append('code_mode', options.codeMode);
    if (options.css_handling) formData.append('css_handling', options.css_handling);
    if (options.compress_css !== undefined) formData.append('compress_css', options.compress_css);
    if (options.custom_css) formData.append('custom_css', options.custom_css);
    if (options.remove_scripts !== undefined) formData.append('remove_scripts', options.remove_scripts);
    if (options.remove_comments !== undefined) formData.append('remove_comments', options.remove_comments);
    if (options.compress_html !== undefined) formData.append('compress_html', options.compress_html);
    if (options.remove_empty_tags !== undefined) formData.append('remove_empty_tags', options.remove_empty_tags);
    if (options.page_size) formData.append('page_size', options.page_size);
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
    if (options.csv_delimiter) formData.append('csv_delimiter', options.csv_delimiter);
    
    // PDF page selection
    if (options.pdf_page_selection) formData.append('pdf_page_selection', options.pdf_page_selection);
    if (options.pdf_page_range) formData.append('pdf_page_range', options.pdf_page_range);
    
    // GIF animation options
    if (options.animation_delay !== undefined) formData.append('animation_delay', options.animation_delay);
    if (options.loop_animation !== undefined) formData.append('loop_animation', options.loop_animation);

    const apiBaseUrl = await getApiBaseUrl();
    const ready = await ensureBackendReady(apiBaseUrl);
    if (!ready) {
      throw new Error('后端服务未启动');
    }
    
    // 创建一个带超时的 AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000); // 15分钟超时
    
    // 如果提供了外部 signal，则监听其 abort 事件
    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        controller.abort();
      });
    }
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/convert/general`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await handleResponse(response, apiBaseUrl, file);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('转换超时，请稍后重试或联系管理员');
      }
      throw error;
    }
  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
};

/**
 * 批量打包下载
 * @param {string[]} files - 文件名列表
 * @returns {Promise<Blob>} ZIP 文件 Blob
 */
export const batchDownload = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const apiBaseUrl = await getApiBaseUrl();
    const ready = await ensureBackendReady(apiBaseUrl);
    if (!ready) {
      throw new Error('后端服务未启动');
    }
    
    const response = await fetch(`${apiBaseUrl}/api/batch-download`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Batch download failed');
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Batch download error:', error);
    throw error;
  }
};

/**
 * 健康检查
 */
export const healthCheck = async () => {
  try {
    const apiBaseUrl = await getApiBaseUrl();
    const ready = await ensureBackendReady(apiBaseUrl);
    if (!ready) {
      throw new Error('后端服务未启动');
    }
    const response = await fetch(`${apiBaseUrl}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};
