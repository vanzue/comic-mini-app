import { determineDescription, newComic, pollingJobStatus } from "../../utils/api";
import { ComicPhoto, jobIdResponse, LogonResponse } from "../../utils/types";

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

    if (result.statusCode != 200) {
      wx.showToast({
        title: 'Create character failed.'
      })
      this.setData({
        regenerating: false
      });
      return;
    }

    const job_id_response: jobIdResponse = result.data as jobIdResponse;
    console.log("Job id from cloud: ", job_id_response.jobId);
    pollingJobStatus({
      jobId: job_id_response.jobId,
      interval: 1500,
      maxAttempts: 120,
      onSuccess: this.generateComicCharacterSuccessfully,
      onFailure: this.generateComicCharacterFailed
    })
  },

  generateComicCharacterSuccessfully(result: string) {
    const comic_response: ComicPhoto = JSON.parse(result) as ComicPhoto;
    console.log("comic response:", comic_response);
    this.setData({
      comicurl: comic_response.url,
      character_description: comic_response.character,
      seed: comic_response.seed,
      regenerating: false
    });
  },

  generateComicCharacterFailed(result: string) {
    wx.showToast({
      title: "Failed to generate comic."
    })
    this.setData({
      regenerating: false
    });
  },

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