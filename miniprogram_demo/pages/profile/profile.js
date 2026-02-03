Page({
  data: {
    userInfo: {
      name: '游客用户',
      id: '888888',
      avatar: '👤'
    }
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      });
    }
  },
  
  onTapMenu(e) {
    const item = e.currentTarget.dataset.item;
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
});