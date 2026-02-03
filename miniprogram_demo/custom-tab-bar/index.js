Component({
  data: {
    selected: 0,
    color: "#64748B",
    selectedColor: "#2563EB",
    list: [{
      pagePath: "/pages/index/index",
      icon: "🏠",
      text: "首页"
    }, {
      pagePath: "/pages/convert/convert",
      icon: "🔄",
      text: "转换"
    }, {
      pagePath: "/pages/files/files",
      icon: "📁",
      text: "我的文件"
    }, {
      pagePath: "/pages/profile/profile",
      icon: "👤",
      text: "我的"
    }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
    }
  }
})