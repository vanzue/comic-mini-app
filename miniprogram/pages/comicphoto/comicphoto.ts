import { ComicPhoto, LogonResponse } from "../../utils/types";

// index.ts
Page({
  data: {
    comicurl: '',
    session_token: '',
    photo_url:'',
    regenerating: false,
    determining: false,
    confirming: false,
    character_description: '',
    style: '',
    seed: ''
  },
  async onLoad(option) {
    let userProfile = wx.getStorageSync('userProfile') as LogonResponse;
    console.log("Comic photo on load: ", userProfile);
    this.setData({
      comicurl: decodeURIComponent(option.comicurl as string),
      session_token: "12345",
      character_description: option.character,
      style: "warm",
      seed: option.seed,
      photo_url: decodeURIComponent(option.photo_url as string)
    });
  },

  regenerate() {
    console.log("begin to regenerate");
    this.setData({
      regenerating: true
    });
    wx.request({
      url: 'http://100.64.100.69:5000/image/new/comic',
      method: 'POST',
      data: {
        "session_token": this.data.session_token,
        "photo_url": this.data.photo_url
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
    console.log('session_token', this.data.session_token);
    console.log('character', this.data.character_description);
    console.log('style', this.data.style);
    console.log('seed', this.data.seed);

    if (!this.data.session_token || !this.data.character_description || !this.data.style || !this.data.seed) {
      wx.showToast({
        title: "Missing required info",
      });
      return;
    }
    this.setData({
      confirming: true
    });

    wx.setStorageSync('userProfile', {
      profile_done: true,
      session_token: this.data.session_token,
      user_description: this.data.character_description,
      seed: this.data.seed,
      style: 'warm'
    });
    
    const payload = {
      "session_token": this.data.session_token,
      "character": this.data.character_description,
      "seed": this.data.seed,
      "style": "warm"
    };
    wx.request({
      url: 'http://100.64.100.69:5000/image/determine',
      method: 'POST',
      data: payload,
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
          this.setData({
            confirming: false
          });
          wx.navigateTo({
            url: '/pages/storyInput/storyInput'
          })
        } else {
          this.setData({
            confirming: false
          });
          console.error('请求失败:', res);
        }
      },
      fail: (err) => {
        console.error('请求出错:', err);
        this.setData({
          confirming: false
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
  },

  clickYes() {
    this.setData({
      determining: false
    })
  }
})