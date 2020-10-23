<template lang="pug">
  .wang-editor
    .toorbar(id="toorbar")
    .editor-box(id="editor-box")
</template>
<script>
const parseFilename = function (name) {
  const split = name.split('.')
  const ext = split.pop()
  return {
    name: split.join('.'),
    ext: ext
  }
}
import wangEditor from 'wangEditor'
import axios from 'axios'

export default {
  data() {
    return {

    }
  },
  mounted() {
    let self = this;
    let editor = new wangEditor('#toorbar', '#editor-box');
    // 自定义菜单配置
    editor.customConfig.menus = [
        'image',
        'bold',
        'italic',
        'head',
        'quote'
    ]
    editor.customConfig.uploadImgServer = '/upload';
    editor.customConfig.showLinkImg = false;
    editor.customConfig.customUploadImg = function (files, insert) {
      // files 是 input 中选中的文件列表
      let file = files[0];
      // insert 是获取图片 url 后，插入到编辑器的方法
      self.uploadImage(file).then((uploadFile) => {
        // 上传代码返回结果之后，将图片插入到编辑器中
        console.log(file, uploadFile)
        insert(uploadFile.url)
      })
    }
    editor.create()
  },
  methods: {
    uploadImage (file) {
      const uploadFile = {
        name: parseFilename(file.name).name,
        fullName: file.name,
        total: file.size,
        src: '',
        format: '',
        data: this.data,
        error: null
      }
      const formData = new FormData()
      console.log(file)
      formData.append('upfile', file)
      console.log(formData)
      return axios.post('/upload', formData)
        .then( (response) => {
          uploadFile.src = response.data.url
          uploadFile.format = response.data.format
          this.$emit('success', uploadFile)
        })
        .catch( (error)=> {
          file.error = error
          this.$emit('error', file)
        })
    },
  }
}
</script>
<style lang="less">
.wang-editor {
  height: 100%;
  .editor-box {
    height: calc(100% - 40px);
  }
}
</style>