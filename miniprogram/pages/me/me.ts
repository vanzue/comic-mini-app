import { listCollections } from "../../utils/api";
import { ComicCollection, LogonResponse } from "../../utils/types";

Page({
  data: {
    collections: [] as ComicCollection[],
    session_token: "",
    loading: false,
    loadingDone: false,
    selectedCollectionName: "",
    selectedCollection: null as ComicCollection | null,
    current: 0,
    uncompressedUrl: ""
  },

  swiperChange(e: { detail: { current: any; }; }) {
    this.setData({
      current: e.detail.current
    });
  },

  async onLoad() {
    const userProfile = wx.getStorageSync('userProfile') as LogonResponse;
    this.setData({
      session_token: userProfile.session_token
    });
    const session_token = this.data.session_token;
    this.setData({
      loading: true
    });

    const result = await listCollections(session_token);
    if (result.statusCode == 200) {
      const response = result.data as ComicCollection[];
      this.setData({
        collections: response
      });
    } else {
      wx.showToast({
        title: "failed to list collections"
      })
    }
    this.setData({
      loading: false,
      loadingDone: true
    })
  },


  selectCollection(e: { currentTarget: { dataset: { name: any; }; }; }) {
    const selectedCollectionName = e.currentTarget.dataset.name;
    const collection = this.data.collections.find(collection => collection.CollectionName == selectedCollectionName);
    this.setData({
      selectedCollectionName: selectedCollectionName,
      selectedCollection: collection
    });
  },

  zoomin(e: { currentTarget: { dataset: { url: any; }; }; }) {
    const url = e.currentTarget.dataset.url;
    const index = this.data.selectedCollection?.CompressedComics.findIndex(comic => comic == url) ?? 0;

    const uncompressedurl = this.data.selectedCollection?.Comics[index];
    this.setData({
      uncompressedUrl: uncompressedurl
    });
  },
})