import Quill from 'quill'
const Delta = Quill.import('delta')
import fetchImage from './fetchImage'

export default function(vueInstance) {
  return function(node, delta) {
    let src = node.getAttribute('src');
    let lazySrc = node.getAttribute('data-src');
    if (lazySrc && /^(http|file:|data:(image|img)\/\w+;base64,)/.test(lazySrc)) {
      src = lazySrc;
    }
    if (src.substr(0, 2) === '//') {
      src = 'http' + src;
    }
    if (/^data:(image|img)\/\w+;base64,/.test(src) && src.length <= 500) {
      return new Delta().delete(1);
    }
    let newDelta = new Delta().insert({ 'custom-image': {src: src}});
    fetchImage.fetch(src, newDelta);
    return newDelta;
  }
}