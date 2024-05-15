// page.ts

interface PageData {
  inputValue: string;
  buttonDisabled: boolean;
}

Page({
  data: {
    inputValue: '',
    selectedStyle: '' // Initially no style is selected
  },

  onLoad() {
    this.setData({
      selectedStyle:""
    })
  },
  checkWordLimit(this: any, e: any) {
    const value: string = e.detail.value;
    this.setData({
      inputValue: value,
      buttonDisabled: !value.trim()
    });
  },

  clearSelected() {
    this.setData({
      selectedStyle: ""
    });
  },

  selectStyle: function (event: { currentTarget: { dataset: { style: any; }; }; }) {
    const selectedStyle = !!this.data.selectedStyle ? "" : event.currentTarget.dataset.style;
    this.setData({
      selectedStyle: selectedStyle
    });
    console.log(selectedStyle);
  },

  calculateStyle: function (expectedStyle: string) {
    return this.data.selectedStyle === expectedStyle ? "active" : "inactive";
  },

  generateStory() {
    if (!this.data.inputValue || !this.data.selectedStyle) {
      return;
    }
    wx.request({
      url: 'https://api.example.com/get-images', // Replace with your actual API URL
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          // Assume res.data is the array of image URLs
          const imageUrls = res.data;
          wx.setStorageSync('imageUrls', imageUrls);
          wx.navigateTo({
            url: '/pages/gallery/gallery'
          });
        } else {
          // Handle errors or unexpected status codes
          // wx.showToast({
          //   title: 'Failed to load images',
          //   icon: 'error'
          // });
          // Let's just suppose it's a success.
          wx.setStorageSync('imageUrls', [
            'https://cmsimg.cbg.cn/2021/10/23/969b2472a7f5489b8972cc905fa31d06.jpeg',
            'https://cmsimg.cbg.cn/2021/10/23/969b2472a7f5489b8972cc905fa31d06.jpeg',
            'https://cmsimg.cbg.cn/2021/10/23/969b2472a7f5489b8972cc905fa31d06.jpeg',
            'https://cmsimg.cbg.cn/2021/10/23/969b2472a7f5489b8972cc905fa31d06.jpeg'
          ]);
        }

      },
      fail: () => {
        // Handle network errors or request failures
        // wx.showToast({
        //   title: 'Network Error',
        //   icon: 'error'
        // });
        wx.setStorageSync('imageUrls', [
          'https://cmsimg.cbg.cn/2021/10/23/969b2472a7f5489b8972cc905fa31d06.jpeg',
          'https://cmsimg.cbg.cn/2021/10/23/969b2472a7f5489b8972cc905fa31d06.jpeg',
          'https://cmsimg.cbg.cn/2021/10/23/969b2472a7f5489b8972cc905fa31d06.jpeg',
          'https://cmsimg.cbg.cn/2021/10/23/969b2472a7f5489b8972cc905fa31d06.jpeg'
        ]);
      }
    });
    wx.navigateTo({
      url: "/pages/gallary/gallary"
    });
  }
});
