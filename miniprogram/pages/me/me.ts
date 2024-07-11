import { ComicCollection, LogonResponse } from "../../utils/types";

// pages/me/me.ts
Page({

  /**
   * Page initial data
   */
  data: {
    // collections if empty, may be because user has not created 1.
    collections: [] as ComicCollection[],
    session_token: "",
    loading: false,
    loadingDone: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {
    const userProfile = wx.getStorageSync('userProfile') as LogonResponse;
    this.setData({
      session_token: userProfile.session_token
    });
    const session_token = this.data.session_token;
    this.setData({
      loading: true
    });
    wx.request({
      url: `http://100.64.251.11:5000/collection/list/${session_token}`,
      method: 'GET',
      success: (res) => {
        this.setData({
          loading: false
        });
        if (res.statusCode === 200) {
          const response = res.data as ComicCollection[];
          this.setData({
            collections: response
          })
        } else {
          console.error('request failed:', res);
          this.setData({
            loading: false,
          })
        }
      },
      fail: (err) => {
        console.error('something error happened:', err);
        this.setData({
          loadingCollection: false,
          showCollections: false
        });
      }
    });
  },
})