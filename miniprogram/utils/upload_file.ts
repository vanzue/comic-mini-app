import { uploadMediaFile } from "./api";

export const uploadFile = function (localCallback: ((param: string) => void),
  cloudCallback: ((param: string) => void)) {
  wx.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    success: async function (res) {
      const tempFilePath = res.tempFiles[0].tempFilePath;
      localCallback(tempFilePath);
      const result = await uploadMediaFile(tempFilePath);
      console.log("uploading result:", result);
      cloudCallback(result);
    },
    fail: function (err) {
      console.error('选择媒体失败', err);
    }
  });
};

