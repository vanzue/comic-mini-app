import { generateCharacterStory, listCollections, pollingJobStatus, newCollection, addComicToCollection } from "../../utils/api";
import { CharacterStoryComic, ComicCollection, LogonResponse } from "../../utils/types";

interface JobIdResponse {
  jobId: string
}

// index.ts
Page({
  data: {
    urls: [] as string[],
    jobId: "",
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
    showCollections: false,
    selectedCollectionName: "",
    addingToCollection: false,
    added: false,
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
      regenerating: true
    });

    this.generateStory();
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
    const url = event.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: [url]
    });
  },

  handleRegenerateStory: function () {
    if (this.data.regenerating) {
      return;
    }

    this.setData({
      regenerating: true,
    });

    this.generateStory();
  },

  generateStory: async function () {
    this.setData({
      loading: false,
      added: false
    });
    const response = await generateCharacterStory(this.data.character,
      this.data.style, this.data.story, this.data.seed);
    if (response.statusCode != 200) {
      wx.showToast({
        title: "Error generating comic"
      })
      return;
    }
    const jobIdResponse = response.data as JobIdResponse;
    const jobId = jobIdResponse.jobId;

    console.log(`job submitted: jobId: ${jobId}`)
    pollingJobStatus({
      jobId: jobId,
      interval: 1500,
      maxAttempts: 120,
      onSuccess: (response) => {
        console.log('raw response: ', response);
        const character_comic_response: CharacterStoryComic = JSON.parse(response);
        console.log('successful job result : ', character_comic_response)
        this.setData({
          regenerating: false,
          urls: [character_comic_response.compressed_url, character_comic_response.url]
        })
        console.log(character_comic_response.compressed_url);
        console.log(character_comic_response.url);
        console.log("after set, urls: ", this.data.urls);
      },
      onFailure: (error) => {
        this.setData({
          regenerating: false
        })
      }
    })
  },

  formatDate: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  addToNewCollection: async function () {
    this.setData({
      addingToCollection: true
    });

    const newCollectionName = this.formatDate();
    const compressed_url = this.data.urls[0];
    const url = this.data.urls[1];
    let result = await newCollection({
      compressedUrl: compressed_url,
      url: url,
      collectionName: newCollectionName,
      sessionToken: this.data.session_token
    })
    this.setData({
      addingToCollection: false,
      added: true
    });
  },

  selectCollection: function (e: { currentTarget: { dataset: { name: any; }; }; }) {
    const selectedCollectoinName = e.currentTarget.dataset.name;
    this.setData({
      selectedCollectionName: selectedCollectoinName
    })
  },
  ///collection/add
  confirmAddComic: async function () {
    this.setData({
      addingToCollection: true
    });

    const selectedCollection = this.data.selectedCollectionName;
    const compressed_url = this.data.urls[0];
    const url = this.data.urls[1];

    let result = await addComicToCollection({
      sessionToken: this.data.session_token,
      collectionName: selectedCollection,
      compressedUrl: compressed_url,
      url: url
    });

    this.setData({
      addingToCollection: false,
      added: true
    });
  },

  getCollections: async function () {
    const session_token = this.data.session_token;
    this.setData({
      loadingCollection: true
    });
    const response = await listCollections(session_token);
    if (response.statusCode == 200) {
      const collections = response.data as ComicCollection[];
      this.setData({
        showCollections: true,
        loadingCollection: false,
        collections: collections
      })
    } else {
      wx.showToast({
        'title': "Fail to list collections"
      })
    }
    this.setData({
      loadingCollection: false,
      showCollections: true
    })
  },
});
