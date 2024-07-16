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
      wx.redirectTo({
        url: "/pages/moment/moment"
      })
    },
    gotoIdea: function () {
      wx.redirectTo({
        url: "/pages/index/index"
      })
      console.log("goto idea")
    },
    gotoProfile: function () {
      console.log('go to me');
      wx.redirectTo({
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
      wx.redirectTo({
        url: "/pages/storyInput/storyInput",
        fail: function (err) {
          console.log(err);
        }
      })
    },
  }
});
