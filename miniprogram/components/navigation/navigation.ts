Component({
  properties: {

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
      // wx.navigateTo({
      //   url: "/pages/idea/idea"
      // })
      console.log("goto idea")
    },
    gotoProfile: function () {
      // wx.navigateTo({
      //   url: "/pages/me/me"
      // })
      console.log("goto profile")
    },
    gotoMessage: function () {
      // wx.navigateTo({
      //   url: "/pages/message/message"
      // })
      console.log("goto message")
    },
    gotoCreate: function () {
      wx.navigateTo({
        url: "/pages/index/index"
      })
    },
  }
});
