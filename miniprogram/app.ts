import { LogonResponse } from "./utils/types";

// app.ts
App({
  onLaunch() {
    const userProfile = wx.getStorageSync('userProfile') as LogonResponse;
    userProfile.session_token = "";
    if (!userProfile || !userProfile.session_token) {
      this.login();
    }
  },
  login() {
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: 'http://100.64.251.11:5000/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success: res => {
              const data = res.data as LogonResponse;
              console.log('from app.ts logon: ', data);
              wx.setStorageSync('userProfile', data);
              if(!data.user_description){
                wx.navigateTo({
                  url: "/pages/selfportrait/selfportrait"
                })
              }
            },
            fail: err => {
              wx.showToast({
                title:"failed to logon"
              });
            }
          });
        } else {
          console.log('Failed to logon' + res.errMsg);
        }
      }
    });
  },
  globalData: {
    userInfo: null
  }
});
