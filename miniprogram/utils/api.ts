import { characterDescription, jobIdResponse, JobStatus, newCollectionRequest, PollingOptions } from "./types";

export const listCollections = async (session_token: string) => {
  return await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": `/collection/list/${session_token}`,
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": ""
  });
}

export const generateCharacterStory = async (character_description: string, comic_style: string, story: string, seed: string) => {
  return await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": '/image/character/story',
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "description": character_description,
      "style": comic_style,
      "story": story,
      "seed": seed
    }
  });
}

export const checkJobStatus = async (job_id: string) => {
  console.log("job id to call:", job_id);
  return await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": `/job/status/${job_id}`,
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "x-api-key": "6PG2oz3HzR9fY4siesUMJxKbZRxn/h4Q+qAIlbQ0/pQ=",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": ""
  });
}

export const pollingJobStatus = async (options: PollingOptions) => {
  console.log('starting to poll');
  const { jobId, interval, maxAttempts = options.maxAttempts, onSuccess, onFailure } = options;
  let attempts = 0;
  const polling = async () => {
    attempts += 1;
    console.log(`attemp count: ${attempts}`)
    let response = await checkJobStatus(jobId);
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
  const result = await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": '/collection/new',
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      session_token: request.sessionToken,
      collection_name: request.collectionName,
      compressed_url: request.compressedUrl,
      url: request.url
    }
  });

  return result;
}

// TODO: should merge with newCollection into 1 function
export const addComicToCollection = async (request: newCollectionRequest) => {
  const result = await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": '/collection/add',
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      session_token: request.sessionToken,
      collection_name: request.collectionName,
      compressed_url: request.compressedUrl,
      url: request.url
    }
  });

  return result;
}

export const uploadImage = async (request: newCollectionRequest) => {
  const result = await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": '/collection/new',
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      session_token: request.sessionToken,
      collection_name: request.collectionName,
      compressed_url: request.compressedUrl,
      url: request.url
    }
  });

  return result;
}


export const determineDescription = async (session_token: string, request: characterDescription) => {
  const result = await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": '/image/determine',
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      session_token: session_token,
      character: request.character_description,
      seed: request.seed,
      style: request.style
    }
  });

  return result;
}


export const uploadFileByFilePath = async (file_path: string) => {
  const result = await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": '/image/upload',
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      filePath: file_path
    }
  });

  console.log("After upload to blob container, url", result);
  return result;
}


export const newComic = async (session_token: string,
  photo_url: string) => {
  const result = await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": '/image/new/comic',
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      session_token: session_token,
      photo_url: photo_url
    }
  });

  return result;
}

export const requestSignature = (ext: string) => {
  return wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": '/put-sign?ext=' + ext,
    "header": {
      "X-WX-SERVICE": "stsserver",
      "content-type": "application/json",
      "x-api-key": "6PG2oz3HzR9fY4siesUMJxKbZRxn/h4Q+qAIlbQ0/pQ="
    },
    "method": "GET",
    "data": ""
  });
}