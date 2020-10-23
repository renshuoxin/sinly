<template lang="pug">
  .editor-container
    .toolbar(id="toolbar")
      button(type="button", class="ql-bold")
      button(type="button", class="ql-italic")
      button(type="button", class="ql-header" value="1")
      button(type="button", class="ql-blockquote")
      button(type="button", class="ql-image")
    .editor(id="editor")
    .footer
      button(:class="{red: active.bold}", type="button", @click="triggerFormat('bold')") B
      button(:class="{red: active.italic}", type="button", @click="triggerFormat('italic')") I
      button(:class="{red: active.header}", type="button", @click="triggerFormat('header')") H1
      button(:class="{red: active.blockquote}", type="button", @click="triggerFormat('blockquote')") blockquote
      span.image-uploader
        button(type="button", @click="triggerFormat('image')") image
        input(type="file", @change="fileChange")
</template>
<script>
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import customImage from './customImage.js'

const getInitActive = function() {
  return {
    bold: false,
    italic: false,
    header: false,
    blockquote: false
  }
}
const getInsertImageHtml = function(src, image_caption) {
  return `
  <div custom-type="image" class="insert-image-container">
    <img src="${src}"/>
    <div class="image-caption">${image_caption}</div>
  </div>`
}
export default {
  data() {
    return {
      editor: null,
      active: {
        bold: false,
        italic: false,
        header: false,
        blockquote: false
      },
      image_url: ''
    }
  },
  mounted() {
    let self = this;
    Quill.register(customImage);
    this.editor = new Quill('#editor', {
      modules: {toolbar: '#toolbar'},
      theme: 'snow'
    })
    this.editor.on('selection-change', function(range, oldRange, source) {
      let format = self.editor.getFormat();
      self.active = Object.assign(getInitActive(), format);
    })
    // h1换行之后样式清除，需要通知客户端
    this.editor.on('text-change', function(delta, oldDelta, source) {
      // 延迟获取编辑器样式，
      self.$nextTick(() => {
        let format = self.editor.getFormat();
        self.active = Object.assign(getInitActive(), format);
      })
    })
    this.processInsertImage();
    this.$http.get('/article')
    .then((response) => {
      let result = response.data;
      self.editor.pasteHTML(result.content);
    })
    window.triggerFormat = function(format) {

    }
  },
  methods: {
    triggerFormat(format, value) {
      switch(format) {
        case 'bold':
        case 'italic':
        case 'blockquote':
          this.active[format] = !this.active[format]; 
          this.editor.format(format, this.active[format]);
          break;
        case 'header':
          this.active.header = this.active.header ? false : 1;
          this.editor.format('header', this.active.header);
          break;
        case 'image':
          this.editor.format('image', true);
      }
    },
    fileChange(event) {
      const fileArr = Array.prototype.slice.call(event.target.files);
      const file = fileArr[0];

      const formData = new FormData();
      formData.append('upfile', file);
      this.$http.post('/upload', formData)
      .then(response => {
        this.image_url = response.data.url;
        let html = getInsertImageHtml(this.image_url, "图注");
        let selection = this.editor.getSelection();
        let index = selection && selection.index || 0;
        this.editor.insertEmbed(index, 'custom-image', {
          src: this.image_url
        });
      }).catch((error) => {
        console.log(error);
      })
    },
    processInsertImage() {
      let self = this;
      this.$el.addEventListener('click', (e) => {
        let target = e.target;
        // 裁剪逻辑
        if(target.className.indexOf('cropper-icon') > -1) {
          let selection = this.editor.getSelection();
          let index = selection && selection.index;
          let delta = this.editor.getContents(index, 1);
          delta.ops[0].insert['custom-image'].src = "https://si1.go2yd.com/get-image/0jUyR9usaLg";
          this.editor.updateContents(delta);
        } else if(target.className.indexOf('delete-icon') > -1) {
          // 删除逻辑
          let selection = this.editor.getSelection();
          let index = selection && selection.index;
          this.editor.deleteText(index, 1);
        } else if(target.className.indexOf('image-caption-input') > -1) {
          target.focus();
        }
      })
      // 图注处理
      this.$el.addEventListener('change', (e) => {
        let target = e.target;
        if(target.className.indexOf('image-caption-input') > -1) {
          let value = target.value;
          this.parentElement.parentElement.setAttribute('image_caption', event.target.value);
        }
      })
    }
  }
}
</script>
<style lang="less">
.editor-container
  .editor {
    min-height: 500px;
    .insert-image-container {
      white-space: normal;
      position: relative;
      font-size: 0;
      .image-caption-wrap {
        position: relative;
        top: -5px;
        input {
          font-size: 12px;
          border: 1px solid #E6E6E6;
          padding: 10px;
          box-sizing: border-box;
          width: 100%;
          outline: none;
        }
      }
      .operation-wrap {
        font-size: 12px;
        color: rgba(256,256,256, 0.49);
        width: 84px;
        height: 24px;
        line-height: 24px;
        border-radius: 2px;
        background-color: rgba(0,0,0, .4);
        padding: 0 13px;
        position: absolute;
        left: 8px;
        bottom: 44px;
        .split {
          vertical-align: middle;
          margin: 0 8px;
        }
        .icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          vertical-align: middle;
        }
        .cropper-icon {
          background: url('../../images/croper_icon@2x.png') center no-repeat;
          background-size: contain;
        }
        .delete-icon {
          background: url('../../images/delete_icon@2x.png') center no-repeat;
          background-size: contain;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px;
    font-size: 20px;
    font-weight: bold;
    .red {
      color: red;
    }
  }
</style>