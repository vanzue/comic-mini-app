import { PollingOptions } from "./types";

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
  return await wx.cloud.callContainer({
    "config": {
      "env": "prod-4gt24l9s70faa013"
    },
    "path": `/job/status/${job_id}`,
    "header": {
      "X-WX-SERVICE": "llmproxy",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": ""
  });
}

export const pollingJobStatus = async (options: PollingOptions) {
  const { jobId, interval, maxAttempts = Infinity, onSuccess, onFailure } = options;
  let attempts = 0;
  const polling = () => {
    attempts += 1;
    callContainer({
      path: `/your/api/path/${jobId}`,
      method: 'GET',
    })
      .then((response) => {
        if (response.data && response.data.status === 'completed') {
          // 假设接口返回的数据中有 status 字段表示任务状态
          clearInterval(timer);
          onSuccess(response);
        } else if (attempts >= maxAttempts) {
          clearInterval(timer);
          onFailure(new Error('Max attempts reached'));
        }
      })
      .catch((error) => {
        clearInterval(timer);
        onFailure(error);
      });
  };

  const timer = setInterval(polling, interval);
}