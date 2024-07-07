import { ComicPhoto, LogonResponse } from "../../utils/types";

// index.ts
Page({
  data: {
    comicurl: '',
    session_token: '',
    regenerating: false,
    determining: false,
    character_description: '',
    style: '',
    seed: ''
  },
  async onLoad(option) {
    let userProfile = wx.getStorageSync('userProfile') as LogonResponse;
    this.setData({
      comicurl: option.comicurl,
      session_token: userProfile.session_token,
      character_description: userProfile.user_description,
      style: userProfile.style,
      seed: userProfile.seed
    });
    this.setData({
      comicurl: "https://comicstorage.blob.core.windows.net/comics/chinese.png"
    });
  },

  regenerate() {
    console.log("begin to regenerate");
    this.setData({
      regenerating: true
    });
    wx.request({
      url: 'http://100.64.251.11:5000/image/new/comic', // 替换为你的API地址
      method: 'POST',
      data: {
        "session_token": "12345",
        "photo_url": "https://comicstorage.blob.core.windows.net/comics/self2.jpg"
      },
      success: (res) => {
        this.setData({
          regenerating: false
        });
        if (res.statusCode === 200) {
          const response = res.data as ComicPhoto;
          console.log("comic response:", response);
          this.setData({
            comicurl: response.url,
            character_description: response.character,
            seed: response.seed,
          });
        } else {
          console.error('请求失败:', res);
        }
      },
      fail: (err) => {
        console.error('请求出错:', err);
        this.setData({
          regenerating: false
        });
      }
    });
  },
  // session_token: '',
  // regenerating: false,
  // character_description: '',
  // style: '',
  // seed: '‘
  determine() {
    if (!this.data.session_token || !this.data.character_description || !this.data.style || !this.data.seed) {
      wx.showToast({
        title: "Missing required information to determine comic character."
      });
    }

    wx.request({
      url: 'http://100.64.251.11:5000/image/determine',
      method: 'POST',
      data: {
        "session_token": this.data.session_token,
        "character": this.data.character_description,
        "seed": this.data.seed,
        "style": this.data.style
      },
      success: (res) => {
        this.setData({
          regenerating: false
        });
        if (res.statusCode === 200) {
          const response = res.data as ComicPhoto;
          console.log("comic response:", response);
          this.setData({
            comicurl: response.url,
            character_description: response.character,
            seed: response.seed,
          });
        } else {
          console.error('请求失败:', res);
        }
      },
      fail: (err) => {
        console.error('请求出错:', err);
        this.setData({
          regenerating: false
        });
      }
    })
  },

  clickOk() {
    this.setData({
      determining: true,
    })
  },

  clickNo() {
    this.setData({
      determining: false
    })
  }
})