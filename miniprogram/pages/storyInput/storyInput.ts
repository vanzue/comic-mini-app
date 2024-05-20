// page.ts

Page({
  data: {
    inputValue: '',
    selectedStyle: '', // Initially no style is selected
    charCount: 0,
    selectedGrid: "1",
    selectedPropotion: "1 : 1",
    hint: ""
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

  generateStory() {
    if (!this.data.inputValue || !this.data.selectedStyle) {
      wx.showToast({
        title: "Please input your content",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/gallary/gallary?story=${this.data.inputValue}&grid=${this.data.selectedGrid}&proportion=${this.data.selectedPropotion}`
    });
  },
  onInput: function (e: { detail: { value: string; }; }) {
    this.setData({
      charCount: e.detail.value.length,
      inputValue: e.detail.value,  // 捕捉到的文字
    });
    console.log(this.data.inputValue);
  },

  onPaste: function () {
    const that = this;
    wx.getClipboardData({
      success(res) {
        const currentText = that.data.inputValue + res.data;
        that.setData({
          inputValue: currentText,
          charCount: currentText.length
        });
        console.log("Paste action triggered: ", res.data);
      },
      fail(err) {
        console.log("Failed to get clipboard data: ", err);
      }
    });
  },

  onClear: function () {
    console.log("onclear called")
    this.setData({
      charCount: 0,
      inputValue: ""
    });
  },

  handleSelectHint: function (e: { detail: { value: string; }; }) {
    if (e.detail.value == "dream") {
      this.setData({
        hint: "I dreamed of a graveyard under the sea..."
      });
    } else if (e.detail.value == "diary") {
      this.setData({
        hint: "while walking down the street, I ran into..."
      });
    } else if (e.detail.value == "notice") {
      this.setData({
        hint: "Today, there was a seminar ..."
      });
    } else if (e.detail.value == "story") {
      this.setData({
        hint: "On my first trip , I encountered..."
      });
    }
  },

  handleSelectGrid: function (e: { detail: { value: string; }; }) {
    this.setData({
      selectedGrid: e.detail.value
    })
  },

  handleSelectPropotion: function (e: { detail: { value: string; }; }) {
    this.setData({
      selectedPropotion: e.detail.value
    })
  },

  handleDisposeHint: function (e: { detail: { value: string; }; }) {
    this.setData({
      hint: ""
    })
  },

  goback: function () {
    wx.navigateTo({
      url: "/pages/illusion/illusion"
    })
  },
});