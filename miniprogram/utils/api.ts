import { characterDescription, jobIdResponse, JobStatus, newCollectionRequest, PollingOptions } from "./types";

export const listCollections = async (session_token: string) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://comic.aipowernft.com/collection/list/${session_token}`,
      method: "GET",
      header: {
        "X-WX-SERVICE": "llmproxy",
        "content-type": "application/json"
      },
      data: "",
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}

export const generateCharacterStory = async (character_description: string, comic_style: string, story: string, seed: string) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://comic.aipowernft.com/image/character/story',
      method: 'POST',
      header: {
        "X-WX-SERVICE": "llmproxy",
        "content-type": "application/json"
      },
      data: {
        "description": character_description,
        "style": comic_style,
        "story": story,
        "seed": seed
      },
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}

export const checkJobStatus = async (job_id: string) => {
  console.log("job id to call:", job_id);
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://comic.aipowernft.com/job/status/${job_id}`,
      method: "GET",
      header: {
        "X-WX-SERVICE": "llmproxy",
        "x-api-key": "6PG2oz3HzR9fY4siesUMJxKbZRxn/h4Q+qAIlbQ0/pQ=",
        "content-type": "application/json"
      },
      data: "",
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}

export const pollingJobStatus = async (options: PollingOptions) => {
  console.log('starting to poll');
  const { jobId, interval, maxAttempts = options.maxAttempts, onSuccess, onFailure } = options;
  let attempts = 0;
  const polling = async () => {
    attempts += 1;
    console.log(`attempt count: ${attempts}`)
    let response: any = await checkJobStatus(jobId);
    console.log(response);
    let job_status = response.data as JobStatus;

    if (job_status.JobStatus == 'Success') {
      console.log('job success', job_status.Result);
      onSuccess(job_status.Result);
      clearInterval(timer);
    }
    else if (job_status.JobStatus == 'Failed') {
      console.log('job failed');
      onFailure(job_status.Result);
      clearInterval(timer);
    }
    else {
      console.log(`job status: ${job_status.JobStatus}`);
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        wx.showToast({
          title: "failed to poll job status, quit"
        });
        onFailure(job_status.Result);
      }
    }
  }
  const timer = setInterval(polling, interval);
}

export const newCollection = async (request: newCollectionRequest) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://comic.aipowernft.com/collection/new',
      method: 'POST',
      header: {
        "X-WX-SERVICE": "llmproxy",
        "content-type": "application/json"
      },
      data: {
        session_token: request.sessionToken,
        collection_name: request.collectionName,
        compressed_url: request.compressedUrl,
        url: request.url
      },
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}

// TODO: should merge with newCollection into 1 function
export const addComicToCollection = async (request: newCollectionRequest) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://comic.aipowernft.com/collection/add',
      method: 'POST',
      header: {
        "X-WX-SERVICE": "llmproxy",
        "content-type": "application/json"
      },
      data: {
        session_token: request.sessionToken,
        collection_name: request.collectionName,
        compressed_url: request.compressedUrl,
        url: request.url
      },
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}

export const uploadImage = async (request: newCollectionRequest) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://comic.aipowernft.com/collection/new',
      method: 'POST',
      header: {
        "X-WX-SERVICE": "llmproxy",
        "content-type": "application/json"
      },
      data: {
        session_token: request.sessionToken,
        collection_name: request.collectionName,
        compressed_url: request.compressedUrl,
        url: request.url
      },
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}

export const determineDescription = async (session_token: string, request: characterDescription) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://comic.aipowernft.com/image/determine',
      method: 'POST',
      header: {
        "X-WX-SERVICE": "llmproxy",
        "content-type": "application/json"
      },
      data: {
        session_token: session_token,
        character: request.character_description,
        seed: request.seed,
        style: request.style
      },
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}

export const uploadMediaFile = async (tempFilePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: 'https://comic.aipowernft.com/upload_image', // 替换为你的Flask API地址
      filePath: tempFilePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: res => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(`Upload failed with status code ${res.statusCode}`);
        }
      },
      fail: err => {
        reject(err.errMsg);
      }
    });
  });
};

export const newComic = async (session_token: string, photo_url: string) => {
  console.log("sessiontoken:", session_token);
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://comic.aipowernft.com/image/new/comic',
      method: 'POST',
      header: {
        "X-WX-SERVICE": "llmproxy",
        "content-type": "application/json"
      },
      data: {
        session_token: session_token,
        photo_url: photo_url
      },
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}

export const requestSignature = (ext: string) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://comic.aipowernft.com/put-sign?ext=' + ext,
      method: 'GET',
      header: {
        "X-WX-SERVICE": "stsserver",
        "content-type": "application/json",
        "x-api-key": "6PG2oz3HzR9fY4siesUMJxKbZRxn/h4Q+qAIlbQ0/pQ="
      },
      data: "",
      success: res => resolve(res),
      fail: err => reject(err)
    });
  });
}