Page({
  data: {
    fileGroups: [
      {
        title: '今天',
        files: [
          { name: 'resume_v2.pdf', type: 'pdf', time: '14:30', status: 'success' },
          { name: 'invoice_001.docx', type: 'docx', time: '10:15', status: 'success' }
        ]
      },
      {
        title: '昨天',
        files: [
          { name: 'scan_092.jpg', type: 'jpg', time: '18:20', status: 'success' }
        ]
      }
    ]
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
  }
});