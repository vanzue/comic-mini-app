import { LogonResponse } from "./utils/types";

// app.ts
App({
  onLaunch() {
    wx.cloud.init({
      env: 'prod-4gt24l9s70faa013',
      traceUser: true,
    });
    const userProfile = wx.getStorageSync('userProfile') as LogonResponse;
    console.log("user profile", userProfile);
    if (!userProfile || !userProfile.session_token) {
      console.log("Will go login.");
      this.login();
    }

    if (!userProfile.user_description) {
      wx.navigateTo({
        url: "/pages/selfportrait/selfportrait"
      });
    }
  },

  login() {
    wx.login({
      success(res) {
        if (res.code) {
          // use code to 
        }
        else {
          wx.showToast({
            title: 'Fail log in',
          });
        }
      },
    })
  },

  exchangeForSessionToken(code) {
    
  },

  globalData: {
    userInfo: null
  }
});
