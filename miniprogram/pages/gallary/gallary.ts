import { ApiKey } from "../../utils/constants";

// index.ts
Page({
  data: {
    grid: 1,
    urls: [] as String[],
    proportion: "1 : 1",
  },
  async onLoad(option) {
    this.setData({
      grid: Number(option.grid),
      proportion: option.proportion
    });
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'prod-2gsuyczv841bd4e9',
        traceUser: true,
      });
    }
    this.callContainerAPI();
  },

  callContainerAPI: async function () {
    const apiKey = ApiKey;
    const postData = {
      "shortStory": "一只小猫和一个小狗在森林里散步",
      "n": 1,
      "style": "chinese"
    };
    // 显示加载提示框
    wx.showLoading({
      title: 'Loading...',
    });

    try {
      const result = await wx.cloud.callContainer({
        path: "/generate/comics",
        header: {
          "X-WX-SERVICE": "flask-6pml",
          'x-api-key': apiKey
        },
        method: "POST",
        data: postData
      });
      console.log('API调用成功:', result.data);
      this.setData({
        imageUrls: result.data
      });
    } catch (err) {
      console.error('API调用失败:', err);
      wx.showToast({
        title: '请求失败', // 提示的内容
        icon: 'none', // 图标，默认为success，使用none表示无图标
        duration: 2000 // 提示的持续时间，单位为毫秒
      });
    } finally {
      // 隐藏加载提示框
      wx.hideLoading();
    }
  },
  goBack: function () {
    wx.navigateTo({
      url: "/pages/storyInput/storyInput"
    });
  }
}
)
