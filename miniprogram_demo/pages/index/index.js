const toolsData = require('../../utils/toolsData.js');
const app = getApp();

Page({
  data: {
    categories: [],
    recentFiles: [
      { id: 1, name: 'report_2024.pdf', type: 'pdf', date: '10分钟前' },
      { id: 2, name: 'meeting_notes.docx', type: 'docx', date: '1小时前' }
    ]
  },

  onLoad() {
    // Assign visual styles to categories
    const styledCategories = (toolsData.categories || []).map(cat => {
      let bg, color;
      switch(cat.id) {
        case 'word': bg = '#EFF6FF'; color = '#3B82F6'; break;
        case 'pdf': bg = '#FEF2F2'; color = '#EF4444'; break;
        case 'html': bg = '#ECFDF5'; color = '#10B981'; break;
        case 'json': bg = '#FFFBEB'; color = '#F59E0B'; break;
        case 'txt': bg = '#F5F3FF'; color = '#8B5CF6'; break;
        case 'xml': bg = '#EEF2FF'; color = '#6366F1'; break;
        default: bg = '#F3F4F6'; color = '#6B7280';
      }
      return { ...cat, bg, color };
    });

    this.setData({
      categories: styledCategories
    });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
  },

  onMainUpload() {
    // Set default params for main upload
    app.globalData.convertParams = {
      title: 'PDF 转 Word',
      source: 'pdf',
      target: 'docx'
    };
    wx.switchTab({
      url: '/pages/convert/convert'
    });
  },

  onTapCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/category/category?id=${categoryId}`
    });
  }
});