/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    selectedStyle: String
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}