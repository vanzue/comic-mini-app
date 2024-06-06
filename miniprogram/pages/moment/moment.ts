import { Card } from '../../utils/types'

const SampleCards = [
  { title: "Work Diary", subtitle: "RED", image: "https://comicstorage.blob.core.windows.net/comics/landing-1-4grid.png", classification: "personal" },
  { title: "Love Story", subtitle: "RED", image: "https://comicstorage.blob.core.windows.net/comics/landing2.png", classification: "social" },
  { title: "Therapeutic Series", subtitle: "RED", image: "https://comicstorage.blob.core.windows.net/comics/landing-3.png", classification: "govent" },
]

const SampleStyleCards = [
  { title: "Anniversary Celebrate", subtitle: "Enterprise", image: "https://comicstorage.blob.core.windows.net/comics/landing-4.png", classification: "illustration" },
  { title: "Cafeteria Activities", subtitle: "Enterprise", image: "https://comicstorage.blob.core.windows.net/comics/landing-5.png", classification: "realistic" },
  { title: "Publicity Report", subtitle: "Government", image: "https://comicstorage.blob.core.windows.net/comics/landing-6.png", classification: "manga" }
]

Page({
  data: {
    activeTag: "all",  // Default to the first tab
    activeCards: [] as Card[],

    activeStyle: "all",
    activeStyleCards: [] as Card[]
  },

  onLoad: function () {
    this.setData({
      activeCards: SampleCards,
      activeStyleCards: SampleStyleCards
    })
  },

  switchTab: function (e: any) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({
      activeTag: tag,
      activeCards: SampleCards.filter(c => tag == "all" || c.classification.toLowerCase() == tag)
    });
  },

  switchStyle: function (e: any) {
    const style = e.currentTarget.dataset.style;
    this.setData({
      activeStyle: style,
      activeStyleCards: SampleStyleCards.filter(c => style == "all" || c.classification.toLowerCase() == style)
    });
  },
});
