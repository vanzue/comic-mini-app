import { newComic, pollingJobStatus, uploadFileByFilePath } from "../../utils/api";
import { ComicPhoto, jobIdResponse } from "../../utils/types";
import { uploadFile } from "../../utils/upload_file";

// page.ts
Page({
  data: {
    selectType: "",
    step: "select-subject",
    photourl: '',
    photoCloudUrl: '',
    uploadingPhoto: false,
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
    console.log("clicks handle next");
    this.setData({
      step: "upload-photo"
    })
  },

  async handleUploadDone() {
    if (this.data.requestingComic || this.data.uploadingPhoto) {
      return;
    }

    this.setData({
      requestingComic: true
    });

    const result = await newComic("12345", this.data.photoCloudUrl);
    if (result.statusCode != 200) {
      wx.showToast({
        title: "Something wrong happened."
      })
      this.setData({
        requestingComic: true,
      });
      return;
    }

    const job_id_response: jobIdResponse = result.data as jobIdResponse;
    console.log("Job id from cloud: ", job_id_response.jobId);
    pollingJobStatus({
      jobId: job_id_response.jobId,
      interval: 1500,
      maxAttempts: 120,
      onSuccess: this.generateCharacterComicSuccessfully,
      onFailure: this.generateCharacterComicFailed
    })
  },

  generateCharacterComicFailed(result: string) {
    wx.showToast({
      title: "Failed to generate comic photo for character."
    });
  },

  generateCharacterComicSuccessfully(result: string) {
    // we should expect to get a json formated string as response.
    const comic_photo: ComicPhoto = JSON.parse(result) as ComicPhoto
    console.log("comic response:", comic_photo);
    const photoUrl = this.data.photoCloudUrl as string;
    wx.navigateTo({
      url: `/pages/comicphoto/comicphoto?comicurl=${encodeURIComponent(comic_photo.url)}&character=${comic_photo.character}&seed=${comic_photo.seed}&photo_url=${encodeURIComponent(photoUrl)}`
    })
  },

  setSelectedUrl(local_url: string) {
    this.setData({
      photourl: local_url
    });
  },

  async uploadFileToCloud(file_key: string) {
    const result = await uploadFileByFilePath(file_key);
    this.setData({
      uploadingPhoto: false
    })
    if (result.statusCode == 200) {
      console.log("Successfully uploaded photo to comic blob storage", result.data);
      this.setData({
        photoCloudUrl: result.data
      });
    } else {
      wx.showToast({
        title: "Something wrong happened"
      })
    }
  },

  handleClickUpload() {
    uploadFile(this.setSelectedUrl, this.uploadFileToCloud);
    this.setData({
      uploadingPhoto: true
    })
  }
})