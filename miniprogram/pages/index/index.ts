import { getSampleCards } from '../../utils/mock';
import { Card } from '../../utils/types'

Page({
  data: {
    activeTag: "all",  // Default to the first tab
    activeCards: [] as Card[],
    // 0 -> show default layout
    // 1 -> show ticktok detail
    // 2 -> show ticktok effect
    // 3 -> show red detail
    // 4 -> show red effect
    appPreview: 0,
    previewSrc: ""
  },

  onLoad: function () {
    this.setData({
      activeCards: getSampleCards(),
    })
  },

  switchTab: function (e: any) {
    const tag = e.currentTarget.dataset.tag;
    const sampleCards = getSampleCards();
    this.setData({
      activeTag: tag,
      activeCards: sampleCards.filter(c => tag == "all" || c.classification.toLowerCase() == tag)
    });
  },

  selectStyle: function (e: any) {
    const style = e.currentTarget.dataset.style;
    if (style == "Heiress Romance") {
      this.setData({
        appPreview: 1
      })
    } else if (style == "Therapeutic Series") {
      this.setData({
        appPreview: 3
      })
    }

    this.toggleStyle();
  },

  toggleStyle: function () {
    const currentStyle = this.data.appPreview;
    if (currentStyle === 0) {
      return;
    }
    const bonus = (currentStyle % 2 == 0 ? -1 : 1);

    const imageList = [
      "https://comicstorage.blob.core.windows.net/comics/tt-detail.png",
      "https://comicstorage.blob.core.windows.net/comics/tt-effect.png",
      "https://comicstorage.blob.core.windows.net/comics/red-detail.png",
      "https://comicstorage.blob.core.windows.net/comics/red-effect.png"
    ];

    const currentPreview = currentStyle + bonus;
    const currentImage = imageList[currentPreview-1];

    console.log(currentPreview, currentImage);

    this.setData({
      appPreview: currentPreview,
      previewSrc: currentImage
    })
  },
}
);
