Component({
  properties: {

  },
  data: {
    // 定义组件的内部数据
    someData: 'Hello, World!'
  },
  methods: {
    handleTap: function (e: { currentTarget: { dataset: { to: any; }; }; }) {
      console.log("navigate to ", e.currentTarget.dataset.to);
      var page = e.currentTarget.dataset.to;
      wx.navigateTo({
        url: `/pages/${page}/${page}`
      })
    }
  }
});
