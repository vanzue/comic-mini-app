import { ApiKey } from "../../utils/constants";

// index.ts
Page({
  data: {
    grid: 1,
    urls: [] as String[],
    jobId: "",
    proportion: "1 : 1",
    style: "",
    loading: true,
    gameStatus: 0
  },
  async onLoad(option) {
    console.log("grid:", this.data.grid);
    console.log("proportion:", this.data.proportion);

    this.setData({
      grid: Number(option.grid),
      proportion: option.proportion || "1 : 1",
      urls: [],
      style: String(option.style)
    });
    console.log('grid', this.data.grid);
    console.log('proportion', this.data.proportion);
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'prod-2gsuyczv841bd4e9'
      });
    }
    this.callContainerAPI(String(option.story), Number(option.grid), String(option.style));
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

      console.log("get jobId,", result);

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
  }
}
)
