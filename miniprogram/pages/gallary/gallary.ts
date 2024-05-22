import { ApiKey, ComicCreateApiEndpoint } from "../../utils/constants";

// index.ts
Page({
  data: {
    grid: 1,
    urls: [] as String[],
    proportion: "1 : 1",
  },
  onLoad(option) {
    this.setData({
      grid: Number(option.grid),
      proportion: option.proportion
    });
    const apiUrl = ComicCreateApiEndpoint; // 替换为你的API URL
    const apiKey = ApiKey; // 替换为你的API密钥
    const postData = {
      shortStory: option.story,
      n: Number(option.grid),
      style:option.style
    };

    wx.showLoading({
      title: '',
      mask: true
    });

    wx.request({
      url: apiUrl,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'x-api-key': apiKey
      },
      data: postData,
      success: (res) => {
        console.log("generate done,", res);
        this.setData({
          urls: res.data as String[]
        });
      },
      fail: (err) => {
        console.log(err);
        wx.showToast({ title: "Something went wrong, please try again", icon: 'none', duration: 2000 });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  goBack: function () {
    wx.navigateTo({
      url: "/pages/storyInput/storyInput"
    });
  }
}
)
