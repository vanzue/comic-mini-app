// index.ts
interface Image {
  url: string;
  loaded: boolean;
}

Page({
  data: {
    imageUrls: [] as Image[]
  },

  onLoad() {
    // Retrieve the list of URLs from local storage
    const urlList: string[] = wx.getStorageSync('imageUrls'); // Replace 'imageUrls' with your actual key
    if (urlList) {
      // Convert each URL into an Image object
      const images: Image[] = urlList.map(url => ({
        url: url,
        loaded: false // Initialize as not loaded
      }));
      // Set the images to the page data
      this.setData({ images });
    }
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
