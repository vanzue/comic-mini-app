// page.ts
Page({
  data: {
    selectType: "",
    // [select-subject, upload-photo, choose-style]
    step: "select-subject",
    photourl: '',
    comicurl:''
  },

  onLoad(option) {
    console.log(option.style);
    this.setData({
      selectedStyle: option.style
    })
  },
  checkWordLimit(this: any, e: any) {
    const value: string = e.detail.value;
    this.setData({
      inputValue: value,
    });
  },

  clearSelected() {
    this.setData({
      selectedStyle: ""
    });
  },

  handleSelect(e: { currentTarget: { dataset: { type: any; }; }; }) {
    this.setData({
      selectType: e.currentTarget.dataset.type
    });
  },

  handleNext() {
    this.setData({
      step: "upload-photo"
    })
  },

  handleUploadDone() {
    this.setData({
      step: 'choose-style'
    });
  },

  handleClickUpload() {
    wx.chooseMedia({
      count: 1,  // 一次选择一张照片
      sizeType: ['compressed'],  // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'],  // 可以指定来源是相册还是相机
      success: (res) => {
        const tempFile = res.tempFiles;
        console.log("photourl:", tempFile[0].tempFilePath);
        this.setData({
          photourl: tempFile[0].tempFilePath,
        });
      }
    });
  }
})