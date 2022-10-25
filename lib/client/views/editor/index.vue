<template>
  <div class="editor-container">
    <h2 class="title">quill editor</h2>
    <div class="editor-wrap">
      <div class="toolbar" id="toolbar"></div>
      <div class="editor-content" id="editor"></div>
    </div>
    <br>
    <div>
      <button @click="getContent">getContent</button>
    </div>
    <br>
    <h2 class="title">原生editor</h2>
    <div>
      <button @click="upload">upload</button>
    </div>
    <div contenteditable="true" class="custom-editor"></div>
  </div>
</template>
<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import customImage from './customImage';
import customImageMatcher from './customImageMatcher';

export default {
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      Quill.register(customImage);
      this.editor = new Quill('#editor', {
        modules: {
          toolbar: [['bold', 'italic'], ['link', 'image']],
          clipboard: {
            // 匹配器：处理粘贴的图片，将img替换为custom-image
            matchers: [
              ['img', customImageMatcher(this)]
            ],
            matchVisual: false
          }
        },
        theme: 'snow',
        placeholder: '输入正文…',
      });
      const toolbar = this.editor.getModule('toolbar');
      toolbar.addHandler('image', this.insertImage);
    },
    insertImage() {
      let index = this.editor.selection.savedRange.index;
      this.editor.insertEmbed(index, 'custom-image', {
        src: 'https://vfiles.gtimg.cn/vupload/20210622/5b451e1624358658437.png',
      });
    },
    getContent() {
      console.log(this.editor.getContents());
    },
    upload() {
      document.execCommand('insertImage', false, 'https://vfiles.gtimg.cn/vupload/20210622/5b451e1624358658437.png');
    }
  }
};
</script>
<style lang="less">
.editor-container {
  margin: 0 20px;
  .editor-content {
    min-height: 500px;
    .insert-image-container {
      white-space: normal;
      position: relative;
      overflow: hidden;
      z-index: 2000;
      user-select: none;
      -webkit-user-select: none;
      img {
        display: block;
      }
      .image-caption-wrap {
        margin-bottom: 10px;
        input {
          font-size: 12px;
          color: #919191;
          border: 1px solid #E6E6E6;
          /* border-top: none; */
          padding: 10px;
          box-sizing: border-box;
          width: 100%;
          border-radius: 0;
          margin: 0;
          outline: none;
          /* user-select: text;
          -webkit-user-select: text; */
        }
      }
      .ignore-operation-wrap {
        width: 84px;
        height: 24px;
        line-height: 24px;
        border-radius: 2px;
        background-color: rgba(0,0,0, .4);
        position: absolute;
        left: 8px;
        bottom: 54px;
        font-size: 0;
        .split {
          display: inline-block;
          vertical-align: middle;
          height: 12px;
          width: 1px;
          background: rgba(255,255,255, .49);
        }
        .icon {
          display: inline-block;
          width: 41px;
          height: 16px;
          vertical-align: middle;
        }
        // .cropper-icon {
        //   background: url('images/writingEditor/editor.png') center no-repeat;
        //   background-size: contain;
        // }
        // .delete-icon {
        //   background: url('images/writingEditor/delete@2x.png') center no-repeat;
        //   background-size: contain;
        // }
      }
    }
  }

  .custom-editor {
    min-height: 500px;
    border: 1px solid gray;
    padding: 10px;
  }
}
</style>