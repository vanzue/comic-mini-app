import { sampleCards } from '../../utils/constants';

Page({
  data: {
    activeTag: "all",  // Default to the first tab
    
  },

  switchTab: function (e: any) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({
      activeTag: tag,
      activeCards: sampleCards.filter(c => tag == "all" || c.subtitle.toLowerCase() == tag)
    });
  },

  selectStyle: function (e: any) {
    const style = e.currentTarget.dataset.style;
    console.log(style);
    var app = getApp();
    app.globalData.selectedStyle = style;

    wx.navigateTo({
      url: "/pages/storyInput/storyInput"
    });
  }
});
