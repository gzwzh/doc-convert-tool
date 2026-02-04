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

    const apiBaseUrl = await getApiBaseUrl();
    const ready = await ensureBackendReady(apiBaseUrl);
    if (!ready) {
      throw new Error('后端服务未启动');
    }
    const response = await fetch(`${apiBaseUrl}/api/convert/xml`, {
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
    if (options.codeMode !== undefined) formData.append('code_mode', options.codeMode);
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
    if (options.pdf_page_range) formData.append('pdf_page_range', options.pdf_page_range);
    
    // GIF animation options
    if (options.animationDelay !== undefined) formData.append('animation_delay', options.animationDelay);
    if (options.loopAnimation !== undefined) formData.append('loop_animation', options.loopAnimation);

    const apiBaseUrl = await getApiBaseUrl();
    const ready = await ensureBackendReady(apiBaseUrl);
    if (!ready) {
      throw new Error('后端服务未启动');
    }
    
    // 创建一个带超时的 AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000); // 15分钟超时
    
    try {
      const response = await fetch(`${apiBaseUrl}/api/convert/general`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '转换失败');
      }

      return await response.json();
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
