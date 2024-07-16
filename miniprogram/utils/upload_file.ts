import { requestSignature } from "./api";

export const uploadFile = function (chooseImageCallback: ((param: string) => void),
  uploadCallback: ((param: string) => void),) {
  // 对更多字符编码的 url encode 格式
  var camSafeUrlEncode = function (str: string) {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  };

  // 获取签名
  var getAuthorization = function (options: { ext: string }, callback: { (AuthData: any): void; (arg0: string | Record<string, any> | ArrayBuffer): void; }) {
    requestSignature(options.ext).then(
      result => {
        console.log("Get Authorization Done, result:", result);
        var data = result.data;
        if (data) {
          callback(data);
        } else {
          wx.showModal({
            title: '临时密钥获取失败',
            content: JSON.stringify(data),
            showCancel: false,
          });
        }
      }
    )
  };

  /**
  * prefix: 请求 cos 的 url
  * filePath: 小程序选择上传的文件路径
  * key: 上传到 cos 的路径
  * formData: 服务端返回的鉴权参数
  */
  var putFile = function ({ prefix, filePath, key, AuthData }) {
    console.log("prefix for upload:", prefix)
    const wxfs = wx.getFileSystemManager();
    wxfs.readFile({
      filePath: filePath,
      success: function (fileRes) {
        var requestTask = wx.request({
          url: prefix + '/' + key,
          method: 'PUT',
          header: {
            Authorization: AuthData.authorization,
            'x-cos-security-token': AuthData.securityToken,
          },
          data: fileRes.data,
          success: function success(res) {
            var url = prefix + '/' + camSafeUrlEncode(key).replace(/%2F/g, '/');
            if (res.statusCode === 200) {
              // we should upload the image to blob container as well.
              uploadCallback(key);
            } else {
              wx.showModal({
                title: '上传失败1',
                content: JSON.stringify(res),
                showCancel: false,
              });
            }
          },
          fail: function fail(res) {
            wx.showModal({
              title: '上传失败2',
              content: JSON.stringify(res),
              showCancel: false,
            });
          },
        });
      },
    });
  };

  // 上传文件
  var uploadFile = function (filePath: string) {
    var extIndex = filePath.lastIndexOf('.');
    var fileExt = extIndex >= -1 ? filePath.substr(extIndex + 1) : '';
    getAuthorization({ ext: fileExt }, function (AuthData: any) {
      // 确认AuthData格式是否正确
      const prefix = 'https://' + AuthData.cosHost;
      const key = AuthData.cosKey;
      putFile({ prefix, filePath, key, AuthData });
    });
  };

  // 选择文件
  wx.chooseMedia({
    count: 1, // 默认9
    sizeType: ['original'], // 可以指定是原图还是压缩图，这里默认用原图
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      chooseImageCallback(res.tempFiles[0].tempFilePath);
      uploadFile(res.tempFiles[0].tempFilePath);
    },
  });
};

