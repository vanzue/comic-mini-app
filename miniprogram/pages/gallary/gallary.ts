import { ApiKey } from "../../utils/constants";

// index.ts
Page({
  data: {
    grid: 1,
    urls: [] as String[],
    jobId: "",
    proportion: "1 : 1",
  },
  async onLoad(option) {
    this.setData({
      grid: Number(option.grid || 2),
      proportion: option.proportion || "1 : 1",
      urls: ["https://dalleprodsec.blob.core.windows.net/private/images/b7afa12d-d413-453d-9099-a32756b67be9/generated_00.png?se=2024-05-25T05%3A03%3A54Z&sig=6l2i4VoQgvCgXp5DrJ8a5KPa%2FlGNc8APjZceWu4n954%3D&ske=2024-05-31T01%3A17%3A49Z&skoid=e52d5ed7-0657-4f62-bc12-7e5dbb260a96&sks=b&skt=2024-05-24T01%3A17%3A49Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02", "https://dalleprodsec.blob.core.windows.net/private/images/b7afa12d-d413-453d-9099-a32756b67be9/generated_00.png?se=2024-05-25T05%3A03%3A54Z&sig=6l2i4VoQgvCgXp5DrJ8a5KPa%2FlGNc8APjZceWu4n954%3D&ske=2024-05-31T01%3A17%3A49Z&skoid=e52d5ed7-0657-4f62-bc12-7e5dbb260a96&sks=b&skt=2024-05-24T01%3A17%3A49Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02"]
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
    this.callContainerAPI(option.story || "小猫和小狗在打架");
  },

  callContainerAPI: async function (shortStory: String) {
    const apiKey = ApiKey;
    console.log('short story', shortStory);
    const postData = {
      "shortStory": shortStory,
      "n": 1,
      "style": "chinese"
    };
    // 显示加载提示框
    wx.showLoading({
      title: 'Loading...',
    });

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
          // this.setData({
          //   urls: urlList
          // });
          wx.hideLoading();
        } else if (jobData.JobStatus === 'Failed') {
          wx.showToast({ title: "Job failed, please try again", icon: 'none', duration: 2000 });
          wx.hideLoading();
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
      url: "/pages/storyInput/storyInput"
    });
  }
}
)
