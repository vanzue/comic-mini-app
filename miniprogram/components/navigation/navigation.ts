Component({
  properties: {
    activeTab: {
      type: String,
      value: '',
    }
  },
  data: {
    // 定义组件的内部数据
    someData: 'Hello, World!'
  },
  methods: {
    gotoMoment: function () {
      wx.navigateTo({
        url: "/pages/moment/moment"
      })
    },
    gotoIdea: function () {
      wx.navigateTo({
        url: "/pages/index/index"
      })
      console.log("goto idea")
    },
    gotoProfile: function () {
      console.log('go to me');
      wx.navigateTo({
        url: "/pages/me/me"
      })
    },
    gotoMessage: function () {
      // wx.navigateTo({
      //   url: "/pages/message/message"
      // })
      console.log("goto message")
    },
    gotoCreate: function () {
      wx.navigateTo({
        url: "/pages/storyInput/storyInput"
      })
    },
  }
});
