import { ComicPhoto } from "../../utils/types";

// page.ts
Page({
  data: {
    selectType: "",
    step: "select-subject",
    photourl: '',
    photoCloudUrl: '',
    uploadingPhoto: true,
    requestingComic: false
  },

  onLoad(option) {
    console.log(option.style);
    this.setData({
      selectedStyle: option.style
    })
  },
  checkWordLimit(this: any, e: any) {
    const value: string = e.detail.value;
    this.setData({
      inputValue: value,
    });
  },

  clearSelected() {
    this.setData({
      selectedStyle: ""
    });
  },

  handleSelect(e: { currentTarget: { dataset: { type: any; }; }; }) {
    this.setData({
      selectType: e.currentTarget.dataset.type
    });
  },

  handleNext() {
    this.setData({
      step: "upload-photo"
    })
  },

  handleUploadDone() {
    if (this.data.requestingComic || this.data.uploadingPhoto) {
      return;
    }

    this.setData({
      requestingComic: true
    });

    wx.request({
      url: 'http://100.64.100.69:5000/image/new/comic',
      method: 'POST',
      data: {
        "session_token": "12345",
        "photo_url": this.data.photoCloudUrl
      },
      success: (res) => {
        this.setData({
          regenerating: false
        });
        if (res.statusCode === 200) {
          const response = res.data as ComicPhoto;
          const photoUrl = this.data.photoCloudUrl as string;
          console.log("comic response:", response);
          wx.navigateTo({
            url: `/pages/comicphoto/comicphoto?comicurl=${encodeURIComponent(response.url)}&character=${response.character}&seed=${response.seed}&photo_url=${encodeURIComponent(photoUrl)}`
          })
        } else {
          console.error('request failed:', res);
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

  handleClickUpload() {
    wx.chooseMedia({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: (res) => {
            const base64Encoded = res.data;
            this.setData({
              photourl: tempFilePath,
              uploadingPhoto: true
            });

            wx.request({
              url: 'http://100.64.100.69:5000/image/upload',
              method: 'POST',
              data: {
                "content": base64Encoded
              },
              success: (res) => {
                console.log(res.data);
                this.setData({
                  photoCloudUrl: res.data as string,
                  uploadingPhoto: false
                })
              },
              fail: (res) => {
                console.log("failed for upload");
                this.setData({
                  uploadingPhoto: false
                });
              }
            });
          }
        })
      }
    })
  }
})