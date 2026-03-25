const fs = require('fs');
const path = require('path');

const localeDir = path.join(__dirname, '..', 'frontend', 'src', 'locales');

const updates = {
  zh_CN: {
    webHeader: {
      brand_subtitle: '智能转换与效率工具箱',
      nav: {
        home: '首页',
        ai_tools: 'AI工具',
        office_tools: '办公工具',
        multimedia: '多媒体',
        development_tools: '开发工具',
        text_processing: '文本处理',
        file_processing: '文件处理',
        system_tools: '系统工具',
        life_tools: '生活工具',
        industry_news: '行业资讯',
        software_customization: '软件定制'
      },
      search_aria: '搜索',
      search_placeholder: '搜索工具、应用等',
      theme_to_dark: '切换深色模式',
      theme_to_light: '切换浅色模式',
      menu_aria: '导航菜单',
      login_register: '登录/注册',
      login: '登录'
    },
    webFooter: {
      brand_subtitle: 'KUNQIONG AI TOOLS',
      social: {
        douyin: '抖音',
        wechat: '微信',
        weibo: '微博'
      },
      icp_label: 'ICP备案',
      description: '我们致力于为个人和企业提供高质量的 AI 工具和咨询服务，帮助你在智能化工作流中保持效率和竞争力。',
      sections: {
        quick_links: '快速链接',
        tool_categories: '工具分类',
        contact_us: '联系我们'
      },
      quick_links: {
        home: '首页',
        ai_tools: 'AI工具',
        custom_service: '咨询服务',
        industry_news: '行业资讯',
        feedback: '问题反馈'
      },
      tool_links: {
        text_processing: '文本处理',
        image_generation: '图像生成',
        office_tools: '办公工具',
        file_processing: '文件处理',
        code_development: '代码开发'
      },
      contact: {
        company: '公司',
        phone: '电话',
        address: '地址',
        email: '邮箱'
      },
      copyright: '© {{year}} {{brand}}. 保留所有权利。',
      user_agreement: '用户协议',
      privacy_policy: '隐私政策'
    },
    toolDetail: {
      options: {
        cleanup_options: '清理选项',
        docx_page_range_placeholder: '例如：1-3,5',
        image_options: '图片选项',
        image_quality: '图片质量',
        inline_css: '内联 CSS',
        json_indent: 'JSON 缩进',
        pipe: '竖线 (|)',
        preview_html: '预览 HTML',
        quality_range: '质量范围',
        remove_css: '移除 CSS',
        watermark_info: '水印设置',
        watermark_text: '水印文字',
        watermark_size: '水印大小',
        watermark_opacity: '水印透明度',
        watermark_position: '水印位置',
        watermark_angle: '水印角度',
        watermark_color: '水印颜色'
      },
      messages: {
        files_added_success: '已添加 {{count}} 个文件',
        folder_invalid_filtered: '已过滤 {{count}} 个无效文件',
        folder_no_valid_files: '此文件夹中没有有效的 {{source}} 文件',
        no_downloadable_files: '没有可下载的文件',
        saving_files: '正在保存文件...',
        save_success: '已保存 {{count}} 个文件',
        save_failed: '保存失败：{{error}}',
        save_operation_failed: '保存操作失败',
        cannot_access_folder: '无法访问所选文件夹',
        batch_download_started: '已开始下载',
        packaging_files: '正在打包文件...',
        zip_download_success: 'ZIP 下载完成',
        zip_download_failed: 'ZIP 下载失败',
        conversion_cancelled: '已取消转换',
        pdf_page_range_invalid: '请输入有效的 PDF 页码范围',
        docx_page_range_invalid: '请输入有效的页码范围，例如 1-3,5',
        animation_delay_invalid: '请输入 10 到 5000 之间的有效动画延迟',
        background_color_invalid: '请输入有效的背景颜色，例如 #ffffff',
        watermark_color_invalid: '请输入有效的水印颜色，例如 #cccccc',
        ppt_video_wait: 'PPT 转视频耗时较长，请耐心等待。',
        converting_video_wait: '正在转换视频，请稍候...',
        processing_files: '正在处理文件...',
        operation_cancelled: '操作已取消',
        not_implemented: '该转换暂未实现',
        conversion_success: '转换成功',
        conversion_completed_mixed: '转换完成。成功 {{success}} 个，失败 {{failed}} 个。',
        conversion_process_error: '转换过程出错：{{error}}',
        restart_required: '功能暂不可用，请重启应用后重试。',
        unknown_error: '未知错误'
      },
      breadcrumb_home: '首页',
      breadcrumb_tools: '{{source}} 工具',
      breadcrumb_current: '{{source}} 转 {{target}}',
      title: '{{source}} 转 {{target}} 转换器',
      file_list: '文件列表',
      select_all: '全选',
      deselect_all: '取消全选',
      cancel_conversion: '取消转换',
      no_files: '暂时没有文件，请先添加。',
      status_converting: '转换中...',
      download: '下载',
      download_file: '下载文件',
      delete: '删除',
      error: '错误',
      progress_processing: '正在处理 {{current}} / {{total}}',
      zip_download_title: '打包下载 ZIP',
      zip_download_desc: '将全部转换后的文件打包为一个 ZIP 压缩包',
      download_to_folder_title: '下载到文件夹',
      html_preview: 'HTML 预览'
    }
  },
  zh_TW: {
    webHeader: {
      brand_subtitle: '智慧轉換與效率工具箱',
      nav: {
        home: '首頁',
        ai_tools: 'AI工具',
        office_tools: '辦公工具',
        multimedia: '多媒體',
        development_tools: '開發工具',
        text_processing: '文本處理',
        file_processing: '檔案處理',
        system_tools: '系統工具',
        life_tools: '生活工具',
        industry_news: '產業資訊',
        software_customization: '軟體客製'
      },
      search_aria: '搜尋',
      search_placeholder: '搜尋工具、應用等',
      theme_to_dark: '切換深色模式',
      theme_to_light: '切換淺色模式',
      menu_aria: '導覽選單',
      login_register: '登入/註冊',
      login: '登入'
    },
    webFooter: {
      brand_subtitle: 'KUNQIONG AI TOOLS',
      social: {
        douyin: '抖音',
        wechat: '微信',
        weibo: '微博'
      },
      icp_label: 'ICP備案',
      description: '我們致力於為個人與企業提供高品質的 AI 工具與諮詢服務，幫助你在智慧化工作流中保持效率與競爭力。',
      sections: {
        quick_links: '快速連結',
        tool_categories: '工具分類',
        contact_us: '聯絡我們'
      },
      quick_links: {
        home: '首頁',
        ai_tools: 'AI工具',
        custom_service: '諮詢服務',
        industry_news: '產業資訊',
        feedback: '問題回饋'
      },
      tool_links: {
        text_processing: '文本處理',
        image_generation: '圖像生成',
        office_tools: '辦公工具',
        file_processing: '檔案處理',
        code_development: '程式開發'
      },
      contact: {
        company: '公司',
        phone: '電話',
        address: '地址',
        email: '信箱'
      },
      copyright: '© {{year}} {{brand}}. 保留所有權利。',
      user_agreement: '使用者協議',
      privacy_policy: '隱私政策'
    },
    toolDetail: {
      options: {
        cleanup_options: '清理選項',
        docx_page_range_placeholder: '例如：1-3,5',
        image_options: '圖片選項',
        image_quality: '圖片品質',
        inline_css: '內嵌 CSS',
        json_indent: 'JSON 縮排',
        pipe: '直線 (|)',
        preview_html: '預覽 HTML',
        quality_range: '品質範圍',
        remove_css: '移除 CSS',
        watermark_info: '浮水印設定',
        watermark_text: '浮水印文字',
        watermark_size: '浮水印大小',
        watermark_opacity: '浮水印透明度',
        watermark_position: '浮水印位置',
        watermark_angle: '浮水印角度',
        watermark_color: '浮水印顏色'
      },
      messages: {
        files_added_success: '已新增 {{count}} 個檔案',
        folder_invalid_filtered: '已過濾 {{count}} 個無效檔案',
        folder_no_valid_files: '此資料夾中沒有有效的 {{source}} 檔案',
        no_downloadable_files: '沒有可下載的檔案',
        saving_files: '正在儲存檔案...',
        save_success: '已儲存 {{count}} 個檔案',
        save_failed: '儲存失敗：{{error}}',
        save_operation_failed: '儲存作業失敗',
        cannot_access_folder: '無法存取所選資料夾',
        batch_download_started: '已開始下載',
        packaging_files: '正在打包檔案...',
        zip_download_success: 'ZIP 下載完成',
        zip_download_failed: 'ZIP 下載失敗',
        conversion_cancelled: '已取消轉換',
        pdf_page_range_invalid: '請輸入有效的 PDF 頁碼範圍',
        docx_page_range_invalid: '請輸入有效的頁碼範圍，例如 1-3,5',
        animation_delay_invalid: '請輸入 10 到 5000 之間的有效動畫延遲',
        background_color_invalid: '請輸入有效的背景顏色，例如 #ffffff',
        watermark_color_invalid: '請輸入有效的浮水印顏色，例如 #cccccc',
        ppt_video_wait: 'PPT 轉影片耗時較長，請耐心等候。',
        converting_video_wait: '正在轉換影片，請稍候...',
        processing_files: '正在處理檔案...',
        operation_cancelled: '操作已取消',
        not_implemented: '該轉換暫未實作',
        conversion_success: '轉換成功',
        conversion_completed_mixed: '轉換完成。成功 {{success}} 個，失敗 {{failed}} 個。',
        conversion_process_error: '轉換過程出錯：{{error}}',
        restart_required: '功能暫不可用，請重新啟動應用後重試。',
        unknown_error: '未知錯誤'
      },
      breadcrumb_home: '首頁',
      breadcrumb_tools: '{{source}} 工具',
      breadcrumb_current: '{{source}} 轉 {{target}}',
      title: '{{source}} 轉 {{target}} 轉換器',
      file_list: '檔案列表',
      select_all: '全選',
      deselect_all: '取消全選',
      cancel_conversion: '取消轉換',
      no_files: '暫時沒有檔案，請先新增。',
      status_converting: '轉換中...',
      download: '下載',
      download_file: '下載檔案',
      delete: '刪除',
      error: '錯誤',
      progress_processing: '正在處理 {{current}} / {{total}}',
      zip_download_title: '打包下載 ZIP',
      zip_download_desc: '將所有轉換後的檔案打包為一個 ZIP 壓縮檔',
      download_to_folder_title: '下載到資料夾',
      html_preview: 'HTML 預覽'
    }
  }
};

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] = target[key] || {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

for (const [locale, data] of Object.entries(updates)) {
  const filePath = path.join(localeDir, `${locale}.json`);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
  deepMerge(json, data);
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}
