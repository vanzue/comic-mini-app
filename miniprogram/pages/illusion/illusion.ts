Page({
  data: {
    reviewingStyle: "",
    styleName: ""
  },

  onLoad: function () {
    this.setData({
      reviewingStyle: "american",
      styleName: "American Comic"
    })
  },

  onSwiperChange: function (e: { detail: { current: any; }; }) {
    const styleList = [
      {
        style: "american",
        name: "American Comic"
      },
      {
        style: "korean",
        name: "Korean Comic"
      },
      {
        style: "chinese",
        name: "Chinese Comic"
      }
    ];
    const current = e.detail.current;
    const targetStyle = styleList[current].style;
    const targetName = styleList[current].name;
    this.setData({
      reviewingStyle: targetStyle,
      styleName: targetName
    });
  },

  selectStyle: function () {
    wx.navigateTo({
      url: `/pages/storyInput/storyInput?style=${this.data.reviewingStyle}`
    });
  },
  goBack: function () {
    wx.navigateTo({
      url: "/pages/index/index"
    });
  }
});
