const { basename, extname } = require('path')
const fs = require('fs')
const { upload_apiUri, uploadMaxBuffer, uploadAllowFiles, uploadTimeout } = require('../conf')
const axios = require('axios');
const FormData = require('form-data');

const getExtNameByMine = (function () {
  const map = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
    'image/png': '.png',
    'image/x-png': '.png',
    'image/x-citrix-png': '.png',
    'image/x-citrix-jpeg': '.jpg',
    'image/pjpeg': '.jpg',
    'image/vnd.microsoft.icon': '.ico',
    'image/bmp': '.bmp',
    'image/webp': '.webp',
    'image/tiff': '.tif'
  };
  return function (fileType) {
    return map[fileType];
  };
})();

module.exports = async function uploadImage(ctx, repeat = 2) {
  let upfile = ctx.request.files.upfile;
  const tmpfileName = `/tmp/${Date.now()}${Math.floor(10000 * Math.random())}`
  let data = fs.readFileSync(upfile.path);
  fs.writeFileSync(tmpfileName, data);
  let file = {
    mimetype: 'image/png',
    path: tmpfileName,
    size: upfile.size
  }
  if (!file || !file.path) {
    throw '没有找到文件';
  }
  let ext = extname(file.name || file.path) || getExtNameByMine(file.mimetype) || '';
  ext = ext.toLowerCase();
  const uploadId = ctx.query.id || '';

  if (uploadAllowFiles.indexOf(ext) === -1) {
    throw `${ext || ''} 文件类型不支持, 请上传 ${uploadAllowFiles.join(',')} 类型的文件`
  } else if (file.size > uploadMaxBuffer) {
    throw `上传文件大小不能超过 6M ！`;
  } else {
    let response, result;
    let form = new FormData();
    form.append('pic', fs.createReadStream(file.path));
    try {
      response = await axios.post(upload_apiUri, form, {
        headers: form.getHeaders()
      })
      result = response.data;
    } catch (err) {
      result = err
      if (result && result.code === 12 && repeat > 0) {
        // 对于code=12, "reason":"duplicated id to insert." 额外重试一次
        return uploadImage(ctx, repeat - 1)
      }
    }
    if (result.status !== 'success') {
      throw '图片上传失败，请重新上传或换张图片重试';
    } else {
      return {
        status: 'success',
        url: result.url,
        format: result.format,
        id: uploadId
      };
    }
  }
}
