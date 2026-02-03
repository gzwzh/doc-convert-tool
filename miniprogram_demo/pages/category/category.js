const toolsData = require('../../utils/toolsData.js');
const app = getApp();

Page({
  data: {
    category: null
  },

  onLoad(options) {
    const categoryId = options.id;
    const category = toolsData.categories.find(c => c.id === categoryId);
    
    if (category) {
      this.setData({ category });
      wx.setNavigationBarTitle({
        title: category.name
      });
    }
  },

  onTapTool(e) {
    const tool = e.currentTarget.dataset.tool;
    
    // Use globalData to pass parameters to the TabBar page
    app.globalData.convertParams = {
      title: tool.title,
      source: tool.source,
      target: tool.target
    };
    
    // Switch to the convert tab
    wx.switchTab({
      url: '/pages/convert/convert'
    });
  }
});
