import Quill from 'quill'
const BlockEmbed = Quill.import('blots/block/embed')
const { sanitize } = Quill.import('formats/link')

const ATTRIBUTES = {
  src: 'image_src',
  caption: 'image_caption'
};
const getInsertImageHtml = function(src, image_caption) {
  return `
    <img src='${src}' contenteditable='false'/>
    <div class='image-caption-wrap' contenteditable='false'>
      <input type='text' class='image-caption-input' placeholder='添加图注' maxlength='50' value='${image_caption}'/>
    </div>
    <div class='ignore-operation-wrap' contenteditable='false'>
      <span class='icon cropper-icon' contenteditable='false'></span>
      <span class='split' contenteditable='false'></span>
      <span class='icon delete-icon' contenteditable='false'></span>
    </div>`    
}

class customImage extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    node.setAttribute('custom-type', 'image');
    node.setAttribute('class', 'insert-image-container');
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('image_src', value.src);
    node.setAttribute('image_caption', value.image_caption || '');
    node.innerHTML = getInsertImageHtml(value.src, value.image_caption || '');
    return node;
  }
  static formats(domNode) {
    let attributes = Object.values(ATTRIBUTES);
    return attributes.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }
  static value(node) {
    let src = node.getAttribute('src'),
        image_caption = node.getAttribute('image_caption');
    return {
      src: src,
      image_caption: image_caption
    };
  }
  // 格式化自定义图片（src or caption）,在updateContents时会用到
  format(name, value) {
    switch(name) {
      case ATTRIBUTES.src:
        if(!value) return;
        this.domNode.setAttribute(name, value);
        let imgDom = this.domNode.getElementsByTagName('img')[0];
        imgDom.setAttribute('src', value);
        break;
      case ATTRIBUTES.caption:
        this.domNode.setAttribute(name, value);
        let captionInputDom = this.domNode.getElementsByTagName('input')[0];
        captionInputDom.value = value;
        break;
    }
  }
}

// create时，通过blotName来正确创建blot实例
customImage.blotName = 'custom-image';
customImage.tagName = 'customimage';
customImage.className = 'ql-customimage'

export default customImage;