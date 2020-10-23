import Quill from 'quill'
const BlockEmbed = Quill.import('blots/block/embed')
const { sanitize } = Quill.import('formats/link')

const getInsertImageHtml = function(src, image_caption) {
  return `
    <img src='${src}'/>
    <div class='image-caption-wrap'>
      <input type='text' class='image-caption-input' placeholder='添加图注' maxlength='50' value='${image_caption}'/>
    </div>
    <div class='operation-wrap' contenteditable='false'>
      <span class='icon cropper-icon' contenteditable='false'></span>
      <span class='split' contenteditable='false'>|</span>
      <span class='icon delete-icon' contenteditable='false'></span>
    </div>
    `    
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
  static formats(node) {
    return node;
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
  replace(target) {
    console.log(target);
  }
}

customImage.blotName = 'custom-image';
customImage.tagName = 'customimage';

export default customImage;