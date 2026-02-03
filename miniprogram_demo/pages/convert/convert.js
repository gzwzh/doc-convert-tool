const app = getApp();
const toolsData = require('../../utils/toolsData.js');

Page({
  data: {
    serverUrl: 'http://127.0.0.1:8002', 
    title: '文件转换',
    sourceFormat: '',
    targetFormat: '',
    filePath: '',
    fileName: '',
    uploading: false,
    downloadUrl: '',
    errorMsg: '',
    showDebug: false, // 控制调试区显示
    
    // Picker Data
    multiArray: [],
    multiIndex: [0, 0],
    objectMultiArray: [] // To store full objects for reference
  },

  onLoad(options) {
    this.initPickerData();
  },

  initPickerData() {
    const categories = toolsData.categories || [];
    if (categories.length === 0) return;

    // Build Object Array for logic
    // Structure: [ [Category Objects], [Tool Objects for current category] ]
    const categoryObjects = categories;
    const initialTools = categories[0].tools;
    
    // Build Display Array for Picker
    const categoryNames = categoryObjects.map(c => c.name);
    const toolNames = initialTools.map(t => t.title);

    this.setData({
      objectMultiArray: [categoryObjects, initialTools],
      multiArray: [categoryNames, toolNames],
      multiIndex: [0, 0]
    });

    // Set default if not set
    if (!this.data.sourceFormat && initialTools.length > 0) {
      const firstTool = initialTools[0];
      this.setData({
        title: firstTool.title,
        sourceFormat: firstTool.source,
        targetFormat: firstTool.target
      });
    }
  },

  onPickerColumnChange(e) {
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    
    // If first column (Category) changes, update second column (Tools)
    if (e.detail.column === 0) {
      const categoryIndex = e.detail.value;
      const categoryObjects = this.data.objectMultiArray[0];
      
      if (categoryObjects[categoryIndex]) {
        const newTools = categoryObjects[categoryIndex].tools;
        const newToolNames = newTools.map(t => t.title);
        
        data.multiArray[1] = newToolNames;
        data.multiIndex[1] = 0; // Reset tool selection to first item
        
        // Update object array for reference in onPickerChange
        const objectMultiArray = this.data.objectMultiArray;
        objectMultiArray[1] = newTools;
        this.setData({ objectMultiArray });
      }
    }
    
    this.setData(data);
  },

  onPickerChange(e) {
    const val = e.detail.value;
    const tools = this.data.objectMultiArray[1];
    const selectedTool = tools[val[1]];
    
    if (selectedTool) {
      this.setData({
        multiIndex: val,
        title: selectedTool.title,
        sourceFormat: selectedTool.source,
        targetFormat: selectedTool.target,
        // Reset file state
        filePath: '',
        fileName: '',
        downloadUrl: '',
        errorMsg: ''
      });
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }

    // Check for params passed from other pages via globalData
    if (app.globalData.convertParams) {
      const params = app.globalData.convertParams;
      this.setData({
        title: params.title || '文件转换',
        sourceFormat: params.source || '',
        targetFormat: params.target || '',
        // Clear previous file selection if context changes
        filePath: '',
        fileName: '',
        downloadUrl: '',
        errorMsg: ''
      });
      // Clear params to avoid resetting on simple hide/show
      app.globalData.convertParams = null;
    }
  },

  onUrlInput(e) {
    this.setData({ serverUrl: e.detail.value });
  },

  toggleDebug() {
    this.setData({ showDebug: !this.data.showDebug });
  },

  clearFile() {
    this.setData({
      filePath: '',
      fileName: '',
      downloadUrl: '',
      errorMsg: ''
    });
  },

  chooseFile() {
    const ext = this.data.sourceFormat;
    // If no format selected, allow any or prompt
    if (!ext) {
       wx.showToast({ title: '请先选择转换类型', icon: 'none' });
       return;
    }

    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: [ext],
      success: (res) => {
        const file = res.tempFiles[0];
        // 简单的格式校验
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (fileExt !== ext.toLowerCase()) {
           wx.showToast({ title: `请选择 .${ext} 文件`, icon: 'none' });
           return;
        }

        this.setData({
          filePath: file.path,
          fileName: file.name,
          downloadUrl: '',
          errorMsg: ''
        });
      }
    });
  },

  uploadAndConvert() {
    if (!this.data.filePath) return;
    
    this.setData({ uploading: true, errorMsg: '' });
    
    // 根据源格式选择不同的 API 端点
    let apiUrl = `${this.data.serverUrl}/api/convert/general`;
    const source = this.data.sourceFormat.toLowerCase();
    
    if (source === 'json') {
      apiUrl = `${this.data.serverUrl}/api/convert/json`;
    } else if (source === 'xml') {
      apiUrl = `${this.data.serverUrl}/api/convert/xml`;
    }
    
    wx.uploadFile({
      url: apiUrl,
      filePath: this.data.filePath,
      name: 'file',
      formData: {
        'target_format': this.data.targetFormat
      },
      success: (res) => {
        console.log('转换结果:', res);
        try {
          const data = JSON.parse(res.data);
          
          if (data.download_url) {
             let fullDownloadUrl = data.download_url;
             if (!fullDownloadUrl.startsWith('http')) {
                 fullDownloadUrl = `${this.data.serverUrl}${data.download_url}`;
             }
             this.setData({
               downloadUrl: fullDownloadUrl,
               uploading: false
             });
          } else if (data.error) {
            this.setData({
              errorMsg: data.error,
              uploading: false
            });
          } else {
             this.setData({
               errorMsg: '未知错误',
               uploading: false
             });
          }
        } catch (e) {
          this.setData({
            errorMsg: '解析响应失败',
            uploading: false
          });
        }
      },
      fail: (err) => {
        this.setData({
          errorMsg: '网络请求失败: ' + err.errMsg,
          uploading: false
        });
      }
    });
  },

  downloadFile() {
    if (!this.data.downloadUrl) return;
    
    wx.downloadFile({
      url: this.data.downloadUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          const filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            showMenu: true,
            success: function () {
              console.log('打开文档成功');
            },
            fail: function(e) {
               // Fallback for types not supported by openDocument or errors
               wx.showToast({ title: '无法预览，已保存到临时目录', icon: 'none' });
            }
          });
        }
      }
    });
  }
});