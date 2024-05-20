// index.ts
Page({
  data: {
    loaded: false,
    urls: [] as String[]
  },

  onLoad(option) {
    const story = option.story;
    const grid = option.grid;
    const proportion = option.proportion;
    console.log(story, grid, proportion);

    wx.showLoading({
      title: '',
      mask: true
    });
  },

  handleImageLoad(e: { currentTarget: { dataset: { index: any; }; }; }) {
    const index = e.currentTarget.dataset.index;
    const imageProperty = `images[${index}].loaded`;
    this.setData({
      [imageProperty]: true
    });
  },

  handleImageError(e: { currentTarget: { dataset: { index: any; }; }; }) {
    const index = e.currentTarget.dataset.index;
    const imageProperty = `images[${index}].loaded`;
    this.setData({
      [imageProperty]: true
    });
  }
}
)
