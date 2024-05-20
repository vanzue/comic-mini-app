import { getSampleCards } from '../../utils/mock';
import {Card} from '../../utils/types'

Page({
  data: {
    activeTag: "all",  // Default to the first tab
    activeCards: [] as Card[]
  },

  onLoad: function () {
    this.setData({
      activeCards: getSampleCards(),
    })
  },

  switchTab: function (e: any) {
    const tag = e.currentTarget.dataset.tag;
    const sampleCards = getSampleCards();
    this.setData({
      activeTag: tag,
      activeCards: sampleCards.filter(c => tag == "all" || c.classification.toLowerCase() == tag)
    });
  },

  selectStyle: function () {
    wx.navigateTo({
      url: "/pages/illusion/illusion"
    });
  }
});
