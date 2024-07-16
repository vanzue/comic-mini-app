import { newComic, uploadFileByFilePath } from "../../utils/api";
import { ComicPhoto } from "../../utils/types";
import { uploadFile } from "../../utils/upload_file";

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
    console.log("clicks handle next");
    this.setData({
      step: "upload-photo"
    })
  },

  async handleUploadDone() {
    console.log("clicks handle next");

    if (this.data.requestingComic || this.data.uploadingPhoto) {
      return;
    }

    this.setData({
      requestingComic: true
    });

    const result = await newComic("12345", this.data.photoCloudUrl);
    this.setData({
      regenerating: false
    });

    if (result.statusCode == 200) {
      const response = result.data as ComicPhoto;
      const photoUrl = this.data.photoCloudUrl as string;
      console.log("comic response:", response);
      wx.navigateTo({
        url: `/pages/comicphoto/comicphoto?comicurl=${encodeURIComponent(response.url)}&character=${response.character}&seed=${response.seed}&photo_url=${encodeURIComponent(photoUrl)}`
      })
    } else {
      console.error('request failed:', result);
    }
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
  }
})