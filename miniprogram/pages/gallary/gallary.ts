import { ApiKey } from "../../utils/constants";
import { GetMockComicCollection } from "../../utils/mock";
import { CharacterStoryComic, ComicCollection, LogonResponse } from "../../utils/types";

// index.ts
Page({
  data: {
    grid: 1,
    urls: [] as String[],
    jobId: "",
    proportion: "1 : 1",
    style: "",
    loading: true,
    gameStatus: 0,
    seed: "",
    story: "",
    character: "",
    regenerating: false,
    session_token: "",
    collections: [] as ComicCollection[],
    loadingCollection: false,
    showCollections: false
  },
  async onLoad(option) {
    const userprofile = wx.getStorageSync('userProfile') as LogonResponse;

    this.setData({
      urls: [],
      style: String(option.style),
      story: String(option.story),
      seed: userprofile.seed,
      character: userprofile.user_description,
      session_token: userprofile.session_token,
      regenerating: true,
      collections: GetMockComicCollection()
    });

    this.generateStory();
  },

  callContainerAPI: async function (shortStory: String, n: Number, style: String) {
    const apiKey = ApiKey;
    console.log('short story', shortStory);
    const postData = {
      "shortStory": shortStory,
      "n": n,
      "style": style
    };
    console.log('short story', postData);

    try {
      const result = await wx.cloud.callContainer({
        path: "/generate/comics",
        header: {
          "X-WX-SERVICE": "flask-6pml",
          'x-api-key': apiKey
        },
        method: "POST",
        data: postData
      });

      // Check if res.data is a string and parse it if it is
      const data = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
      // Now data is treated as an object, so you can access jobId safely
      this.setData({
        jobId: data.jobId
      });

      this.pollJobStatus(data.jobId);
    } catch (err) {
      console.error('API调用失败:', err);
      wx.showToast({
        title: '请求失败', // 提示的内容
        icon: 'none', // 图标，默认为success，使用none表示无图标
        duration: 2000 // 提示的持续时间，单位为毫秒
      });
    }
  },

  pollJobStatus(jobId: String) {
    const checkStatus = async () => {
      try {
        const result = await wx.cloud.callContainer({
          path: `/job/status/${jobId}`,
          header: {
            "X-WX-SERVICE": "flask-6pml",
            'x-api-key': ApiKey
          },
          method: "GET"
        });

        console.log("Job status result:", result);
        const jobData = result.data;

        if (jobData.JobStatus === 'Success') {
          const urlList = JSON.parse(jobData.Result);
          console.log(urlList);
          this.setData({
            urls: urlList,
            loading: false
          });
        } else if (jobData.JobStatus === 'Failed') {
          wx.showToast({ title: "Job failed, please try again", icon: 'none', duration: 2000 });
          this.setData({
            loading: false
          });
        } else {
          // If the status is neither 'Success' nor 'Failed', keep polling
          setTimeout(checkStatus, 5000); // Recheck every 5 seconds
        }

      } catch (error) {
        console.error("Error fetching job status:", error);
        wx.showToast({ title: "Error fetching job status", icon: 'none', duration: 2000 });
      }
    };
    checkStatus(); // Initiate the first check
  },

  goBack: function () {
    wx.navigateTo({
      url: `/pages/storyInput/storyInput?style=${this.data.style}`
    });
  },

  selectCorrect: function () {
    this.setData({
      gameStatus: 1
    });
  },

  selectWrong: function () {
    this.setData({
      gameStatus: 0
    });
  },

  previewImage: function (event: { currentTarget: { dataset: { url: any; }; }; }) {
    const url = event.currentTarget.dataset.url; // 获取点击图片的 URL
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表，可以是多个
    });
  },

  handleRegenerateStory: function () {
    if (this.data.regenerating) {
      return;
    }

    this.setData({
      regenerating: true
    });

    this.generateStory();
  },

  generateStory: function () {
    wx.request({
      url: 'http://10.32.83.58:5000/image/character/story',
      method: 'POST',
      data: {
        "description": this.data.character,
        "style": this.data.style,
        "story": this.data.story,
        "seed": this.data.seed
      },
      success: (res) => {
        this.setData({
          loading: false
        });
        if (res.statusCode === 200) {
          const response = res.data as CharacterStoryComic;
          const photoUrl = response.url;
          const compressedUrl = response.compressed_url;
          this.setData({
            urls: [compressedUrl, photoUrl],
            regenerating: false
          })
        } else {
          console.error('request failed:', res);
          this.setData({
            regenerating: false
          })
        }
      },
      fail: (err) => {
        console.error('something error happened:', err);
        this.setData({
          regenerating: false
        });
      }
    });
  },

  getCollections: function () {
    const session_token = this.data.session_token;
    this.setData({
      loadingCollection: true
    });
    wx.request({
      url: `http://10.32.83.58:5000/collection/list/${session_token}`,
      method: 'GET',
      success: (res) => {
        this.setData({
          loadingCollection: false
        });
        if (res.statusCode === 200) {
          const response = res.data as ComicCollection[];
          this.setData({
            collections: response
          })
        } else {
          console.error('request failed:', res);
          this.setData({
            loadingCollection: false,
            showCollections: true
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
  }
}
)
