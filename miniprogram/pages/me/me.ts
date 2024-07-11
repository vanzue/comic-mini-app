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

  onLoad() {
    const userProfile = wx.getStorageSync('userProfile') as LogonResponse;
    this.setData({
      session_token: userProfile.session_token
    });
    const session_token = this.data.session_token;
    this.setData({
      loading: true
    });
    wx.request({
      url: `http://100.64.251.11:5000/collection/list/${session_token}`,
      method: 'GET',
      success: (res) => {
        this.setData({
          loading: false
        });
        if (res.statusCode === 200) {
          const response = res.data as ComicCollection[];
          console.log("collection list response", response);
          console.log("collection list", response[0].CompressedComics);
          this.setData({
            collections: response
          })
        } else {
          console.error('request failed:', res);
          this.setData({
            loading: false,
            loadingDone: true
          })
        }
      },
      fail: (err) => {
        console.error('something error happened:', err);
        this.setData({
          loadingCollection: false,
          showCollections: false
        });
      }
    });
  },


  selectCollection(e: { currentTarget: { dataset: { name: any; }; }; }) {
    const selectedCollectionName = e.currentTarget.dataset.name;
    const collection = this.data.collections.find(collection => collection.CollectionName == selectedCollectionName);
    console.log('selected collection:', collection);
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