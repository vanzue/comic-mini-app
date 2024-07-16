import { determineDescription, newComic } from "../../utils/api";
import { ComicPhoto, LogonResponse } from "../../utils/types";

// index.ts
Page({
  data: {
    comicurl: '',
    session_token: '',
    photo_url: '',
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

  async regenerate() {
    console.log("begin to regenerate");
    this.setData({
      regenerating: true
    });

    const result = await newComic(this.data.session_token, this.data.photo_url);

    this.setData({
      regenerating: false
    });
    if (result.statusCode === 200) {
      const response = result.data as ComicPhoto;
      console.log("comic response:", response);
      this.setData({
        comicurl: response.url,
        character_description: response.character,
        seed: response.seed,
      });
    } else {
      console.error('请求失败:', result);
    }
  },

  // session_token: '',
  // regenerating: false,
  // character_description: '',
  // style: '',
  // seed: '‘
  async determine() {
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

    const result = await determineDescription(this.data.session_token, {
      character_description: this.data.character_description,
      seed: this.data.seed,
      style: this.data.style
    });

    this.setData({
      regenerating: false
    });
    if (result.statusCode === 200) {
      const response = result.data as ComicPhoto;
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
      console.error('请求失败:', result);
    }
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