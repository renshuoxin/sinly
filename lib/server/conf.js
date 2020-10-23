module.exports = {
  wdsHost: "127.0.0.1",
  wdsPort: 3000,
  upload_apiUri: "http://static_image_api.ha.in.yidian.com/image/image.php?action=insert&type=wemedia",
  // 文件上传超时时间
  uploadTimeout: 10000,
  // 允许的图片文件后缀（jepg兼容客户端传图手误）
  uploadAllowFiles: [".png", ".jpg", ".jpeg", ".gif", ".bmp", '.webp', '.jepg'],
  // 允许的图片最大上传尺寸
  uploadMaxBuffer: 6 * 1024 * 1024
}