// index.ts
Page({
  data: {
    images: [
      { url: 'https://example.com/image1.jpg', loaded: false },
      { url: 'https://example.com/image2.jpg', loaded: false },
      { url: 'https://example.com/image3.jpg', loaded: false },
      { url: 'https://example.com/image4.jpg', loaded: false }
    ]
  },

  handleImageLoad(e) {
    const index = e.currentTarget.dataset.index;
    const imageProperty = `images[${index}].loaded`;
    this.setData({
      [imageProperty]: true
    });
  },

  handleImageError(e) {
    const index = e.currentTarget.dataset.index;
    const imageProperty = `images[${index}].loaded`;
    this.setData({
      [imageProperty]: true
    });
  }
})
